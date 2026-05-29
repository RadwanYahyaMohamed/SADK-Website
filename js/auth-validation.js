const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

export function sanitizeName(name) {
    return String(name || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 128);
}

export function isValidEmail(email) {
    const normalized = normalizeEmail(email);
    return normalized.length <= 320 && EMAIL_PATTERN.test(normalized);
}

/**
 * @returns {{ valid: boolean, errors: string[], score: number }}
 */
export function validatePassword(password) {
    const errors = [];
    let score = 0;

    if (!password || password.length < 8) {
        errors.push("Password must be at least 8 characters.");
    } else {
        score += 1;
    }

    if (password && password.length >= 12) {
        score += 1;
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Include at least one lowercase letter.");
    } else {
        score += 1;
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Include at least one uppercase letter.");
    } else {
        score += 1;
    }

    if (!/[0-9]/.test(password)) {
        errors.push("Include at least one number.");
    } else {
        score += 1;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push("Include at least one symbol (e.g. ! @ #).");
    } else {
        score += 1;
    }

    if (password && password.length > 256) {
        errors.push("Password is too long (max 256 characters).");
    }

    return {
        valid: errors.length === 0,
        errors,
        score: Math.min(score, 5),
    };
}

export function isEmailVerified(user) {
    return Boolean(user?.emailVerification);
}
