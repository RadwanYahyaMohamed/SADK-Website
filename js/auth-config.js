/**
 * Must match IDs created in Appwrite Console (see APPWRITE_SETUP.md).
 */
export const AUTH_CONFIG = {
    DATABASE_ID: "sadk_members",
    PROFILES_COLLECTION_ID: "profiles",
    AVATARS_BUCKET_ID: "avatars",
    /** Production fallback when building redirect URLs */
    SITE_ORIGIN: "https://sadk.appwrite.network",
    /** Max failed login attempts before temporary lock (client-side) */
    MAX_LOGIN_ATTEMPTS: 5,
    LOGIN_LOCKOUT_MINUTES: 15,
};

/** Base URL for Appwrite email verification / recovery links */
export function getSiteOrigin() {
    if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin.replace(/\/$/, "");
    }
    return AUTH_CONFIG.SITE_ORIGIN;
}

export function getVerifyEmailUrl() {
    return `${getSiteOrigin()}/pages/verify-email.html`;
}

export function getResetPasswordUrl() {
    return `${getSiteOrigin()}/pages/reset-password.html`;
}
