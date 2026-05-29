import { getCurrentUser } from "./auth-service.js";
import { authPageUrl } from "./auth-utils.js";
import { isEmailVerified } from "./auth-validation.js";

/**
 * Must be logged in (any verification state).
 */
export async function requireAuth(redirectTo = "login.html") {
    try {
        return await getCurrentUser();
    } catch {
        window.location.href = authPageUrl(redirectTo);
        return null;
    }
}

/**
 * Account page: logged in + email verified only.
 */
export async function requireVerifiedAuth() {
    const user = await requireAuth("login.html");
    if (!user) return null;

    if (!isEmailVerified(user)) {
        window.location.href = authPageUrl("verify-email.html");
        return null;
    }

    return user;
}

/**
 * verify-email page: logged in only (verified users go to account).
 */
export async function requireAuthForVerification() {
    const user = await requireAuth("login.html");
    if (!user) return null;

    if (isEmailVerified(user)) {
        window.location.href = authPageUrl("account.html");
        return null;
    }

    return user;
}

/**
 * Login/signup: already authenticated users leave these pages.
 */
export async function redirectIfAuthenticated() {
    try {
        const user = await getCurrentUser();
        const destination = isEmailVerified(user) ? "account.html" : "verify-email.html";
        window.location.href = authPageUrl(destination);
        return true;
    } catch {
        return false;
    }
}

export function assertEmailVerified(user) {
    if (!isEmailVerified(user)) {
        const error = new Error("EMAIL_NOT_VERIFIED");
        error.code = "EMAIL_NOT_VERIFIED";
        throw error;
    }
}
