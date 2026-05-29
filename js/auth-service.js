import { ID, Permission, Query, Role } from "appwrite";
import { account, databases, storage } from "./appwrite.js";
import { AUTH_CONFIG, getResetPasswordUrl, getVerifyEmailUrl } from "./auth-config.js";
import {
    isValidEmail,
    normalizeEmail,
    sanitizeName,
} from "./auth-validation.js";
import { isAlreadyVerifiedError } from "./auth-utils.js";

const LOGIN_ATTEMPTS_KEY = "sadk_login_attempts";
const PROJECT_ID = "69a8b588001ea207b07c";
const SESSION_STORAGE_KEY = `a_session_${PROJECT_ID}`;

function profilePermissions(userId) {
    const owner = Role.user(userId);
    return [
        Permission.read(owner),
        Permission.update(owner),
        Permission.delete(owner),
    ];
}

function isNetworkError(error) {
    const message = error?.message || "";
    return (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        error?.name === "TypeError"
    );
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Clear broken Appwrite session from localStorage (cross-origin fallback). */
export function clearStoredSession() {
    if (typeof window === "undefined" || !window.localStorage) return;

    try {
        const raw = localStorage.getItem("cookieFallback");
        if (!raw) return;

        const cookie = JSON.parse(raw);
        if (cookie[SESSION_STORAGE_KEY]) {
            delete cookie[SESSION_STORAGE_KEY];
            localStorage.setItem("cookieFallback", JSON.stringify(cookie));
        }
    } catch {
        localStorage.removeItem("cookieFallback");
    }
}

function checkLoginRateLimit() {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    const data = raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
    const now = Date.now();

    if (data.lockedUntil && now < data.lockedUntil) {
        const minutesLeft = Math.ceil((data.lockedUntil - now) / 60000);
        const error = new Error(`Too many failed attempts. Try again in ${minutesLeft} minute(s).`);
        error.code = "LOGIN_RATE_LIMIT";
        throw error;
    }

    if (data.lockedUntil && now >= data.lockedUntil) {
        sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    }

    return data;
}

function recordFailedLogin() {
    const data = checkLoginRateLimit();
    data.count = (data.count || 0) + 1;

    if (data.count >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        data.lockedUntil =
            Date.now() + AUTH_CONFIG.LOGIN_LOCKOUT_MINUTES * 60 * 1000;
        data.count = 0;
    }

    sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(data));
}

function clearLoginAttempts() {
    sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
}

async function clearStaleSessions() {
    try {
        await account.deleteSession({ sessionId: "current" });
    } catch {
        /* no active session */
    }
}

export async function getCurrentUser() {
    try {
        return await account.get();
    } catch (error) {
        if (!isNetworkError(error)) {
            throw error;
        }

        await delay(400);
        return await account.get();
    }
}

export async function registerUser({ name, email, password, grade }) {
    const safeName = sanitizeName(name);
    const safeEmail = normalizeEmail(email);

    if (!safeName || safeName.length < 2) {
        throw new Error("Please enter your full name (at least 2 characters).");
    }

    if (!isValidEmail(safeEmail)) {
        throw new Error("Please enter a valid email address.");
    }

    const user = await account.create({
        userId: ID.unique(),
        email: safeEmail,
        password,
        name: safeName,
    });

    try {
        await account.createEmailPasswordSession({
            email: safeEmail,
            password,
        });

        await databases.createDocument({
            databaseId: AUTH_CONFIG.DATABASE_ID,
            collectionId: AUTH_CONFIG.PROFILES_COLLECTION_ID,
            documentId: ID.unique(),
            data: {
                userId: user.$id,
                name: safeName,
                email: safeEmail,
                grade: grade || "",
                avatarFileId: "",
            },
            permissions: profilePermissions(user.$id),
        });

        await sendEmailVerification();

        return account.get();
    } catch (error) {
        await clearStaleSessions();
        clearStoredSession();
        throw error;
    }
}

export async function loginUser(email, password) {
    checkLoginRateLimit();

    const safeEmail = normalizeEmail(email);

    if (!isValidEmail(safeEmail)) {
        recordFailedLogin();
        throw new Error("Wrong email or password.");
    }

    await clearStaleSessions();
    clearStoredSession();

    try {
        await account.createEmailPasswordSession({
            email: safeEmail,
            password,
        });
        clearLoginAttempts();
        return account.get();
    } catch (error) {
        recordFailedLogin();

        if (isNetworkError(error)) {
            const networkError = new Error(
                "Connection error. Check your internet, disable VPN/ad-blocker, and try again."
            );
            networkError.code = "NETWORK_ERROR";
            throw networkError;
        }

        throw error;
    }
}

export async function logoutUser() {
    try {
        await account.deleteSession({ sessionId: "current" });
    } catch {
        /* ignore */
    }
    clearStoredSession();
    clearLoginAttempts();
}

export async function logoutAllSessions() {
    try {
        await account.deleteSessions();
    } catch {
        /* ignore */
    }
    clearStoredSession();
    clearLoginAttempts();
}

export async function getUserProfile(userId) {
    const result = await databases.listDocuments({
        databaseId: AUTH_CONFIG.DATABASE_ID,
        collectionId: AUTH_CONFIG.PROFILES_COLLECTION_ID,
        queries: [Query.equal("userId", userId)],
    });

    return result.documents[0] || null;
}

export async function sendEmailVerification() {
    return account.createVerification({
        url: getVerifyEmailUrl(),
    });
}

export async function completeEmailVerification(userId, secret) {
    try {
        await account.updateVerification({ userId, secret });
    } catch (error) {
        if (!isAlreadyVerifiedError(error)) {
            throw error;
        }
    }

    try {
        return await account.get();
    } catch {
        return null;
    }
}

export async function requestPasswordRecovery(email) {
    const safeEmail = normalizeEmail(email);

    if (!isValidEmail(safeEmail)) {
        throw new Error("Please enter a valid email address.");
    }

    return account.createRecovery({
        email: safeEmail,
        url: getResetPasswordUrl(),
    });
}

export async function completePasswordRecovery(userId, secret, password) {
    await account.updateRecovery({ userId, secret, password });
    clearStoredSession();
    await clearStaleSessions();
}

export function getAvatarPreviewUrl(fileId, size = 256) {
    if (!fileId) return null;

    return storage.getFilePreview({
        bucketId: AUTH_CONFIG.AVATARS_BUCKET_ID,
        fileId,
        width: size,
        height: size,
    });
}

export async function uploadProfileAvatar(profileDocumentId, userId, file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
        throw new Error("Only JPG, PNG, WebP, or GIF images are allowed.");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be under 5 MB.");
    }

    const uploaded = await storage.createFile({
        bucketId: AUTH_CONFIG.AVATARS_BUCKET_ID,
        fileId: ID.unique(),
        file,
        permissions: [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId)),
        ],
    });

    await databases.updateDocument({
        databaseId: AUTH_CONFIG.DATABASE_ID,
        collectionId: AUTH_CONFIG.PROFILES_COLLECTION_ID,
        documentId: profileDocumentId,
        data: {
            avatarFileId: uploaded.$id,
        },
    });

    return uploaded.$id;
}

export async function updateUserProfile(profileDocumentId, { name, grade }) {
    const trimmedName = sanitizeName(name);

    if (!trimmedName || trimmedName.length < 2) {
        throw new Error("Please enter a valid name.");
    }

    await account.updateName({ name: trimmedName });

    await databases.updateDocument({
        databaseId: AUTH_CONFIG.DATABASE_ID,
        collectionId: AUTH_CONFIG.PROFILES_COLLECTION_ID,
        documentId: profileDocumentId,
        data: {
            name: trimmedName,
            grade: grade || "",
        },
    });

    return account.get();
}
