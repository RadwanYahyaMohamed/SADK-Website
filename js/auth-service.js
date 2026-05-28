import { ID, Permission, Query, Role } from "appwrite";
import { account, databases, storage } from "./appwrite.js";
import { AUTH_CONFIG } from "./auth-config.js";

export async function registerUser({ name, email, password, grade }) {
    const user = await account.create({
        userId: ID.unique(),
        email,
        password,
        name,
    });

    await account.createEmailPasswordSession({ email, password });

    await databases.createDocument({
        databaseId: AUTH_CONFIG.DATABASE_ID,
        collectionId: AUTH_CONFIG.PROFILES_COLLECTION_ID,
        documentId: ID.unique(),
        data: {
            userId: user.$id,
            name,
            email,
            grade: grade || "",
            avatarFileId: "",
        },
        permissions: [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
        ],
    });

    return user;
}

export async function loginUser(email, password) {
    await account.createEmailPasswordSession({ email, password });
    return account.get();
}

export async function logoutUser() {
    await account.deleteSession({ sessionId: "current" });
}

export async function getCurrentUser() {
    return account.get();
}

export async function getUserProfile(userId) {
    const result = await databases.listDocuments({
        databaseId: AUTH_CONFIG.DATABASE_ID,
        collectionId: AUTH_CONFIG.PROFILES_COLLECTION_ID,
        queries: [Query.equal("userId", userId)],
    });

    return result.documents[0] || null;
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
    const trimmedName = name.trim();

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
