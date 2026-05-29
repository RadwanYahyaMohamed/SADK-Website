/**
 * Auth pages always live under /pages/ — absolute paths avoid broken links
 * from nested curriculum URLs after deploy (Appwrite Sites).
 */
export function authPageUrl(filename) {
    const name = String(filename || "").replace(/^\//, "");
    if (!name) return "/pages/";
    if (name.startsWith("pages/")) return `/${name}`;
    return `/pages/${name}`;
}

export function formatAuthError(error) {
    const code = error?.code || "";
    const message = error?.message || "";

    if (code === "NETWORK_ERROR" || message.includes("Failed to fetch")) {
        return "Connection error. Check your internet, disable VPN/ad-blocker, wait a few seconds, and try again.";
    }

    if (code === "LOGIN_RATE_LIMIT" || message.includes("Too many failed")) {
        return message;
    }

    if (code === "EMAIL_NOT_VERIFIED") {
        return "Please verify your email first. Check your inbox or open the verification page.";
    }

    if (message.includes("already exists") || message.includes("user_already_exists")) {
        return "This email is already registered. Try logging in instead.";
    }

    if (
        message.includes("Invalid credentials") ||
        message.includes("user_invalid_credentials") ||
        message.includes("Invalid email or password")
    ) {
        return "Wrong email or password.";
    }

    if (message.includes("password") && message.includes("8")) {
        return "Password must be at least 8 characters.";
    }

    if (message.includes("user_blocked")) {
        return "This account has been blocked. Contact the Deutsch Klub team.";
    }

    if (message.includes("user_not_found")) {
        return "No account found with this email.";
    }

    if (isAlreadyVerifiedError(error)) {
        return "Your email is already verified. You can sign in to your account.";
    }

    if (isExpiredVerificationOrRecoveryLink(error)) {
        return "This link has expired or was already used. Sign in, or request a new link.";
    }

    if (message.includes("Invalid Origin") || message.includes("origin")) {
        return "Site configuration error. Please contact support.";
    }

    if (message) {
        return message;
    }

    return "Something went wrong. Please try again.";
}

/** Email was verified earlier (second click on the same link, etc.) */
export function isAlreadyVerifiedError(error) {
    const code = String(error?.code || "").toLowerCase();
    const message = String(error?.message || "").toLowerCase();

    return (
        code.includes("already_verified") ||
        code.includes("email_verified") ||
        message.includes("already verified") ||
        message.includes("email is verified") ||
        message.includes("email already verified")
    );
}

/** Only real verification / password-reset link errors — not every message containing "token" */
export function isExpiredVerificationOrRecoveryLink(error) {
    const code = String(error?.code || "").toLowerCase();
    const message = String(error?.message || "").toLowerCase();

    if (isAlreadyVerifiedError(error)) {
        return false;
    }

    const linkCodes = [
        "user_invalid_token",
        "invalid_token",
        "verification_failed",
        "recovery_failed",
    ];

    if (linkCodes.some((c) => code.includes(c))) {
        return true;
    }

    return (
        /invalid.*(verification|recovery|token)/i.test(message) ||
        /(verification|recovery|token).*(expired|invalid|used)/i.test(message)
    );
}
