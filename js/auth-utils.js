export function getPagesRelativePrefix() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (!path.includes("/pages/")) {
        return "pages/";
    }

    const afterPages = path.split("/pages/")[1] || "";
    const parts = afterPages.split("/").filter(Boolean);
    if (parts.length <= 1) {
        return "";
    }

    return "../".repeat(parts.length - 1);
}

export function authPageUrl(filename) {
    return `${getPagesRelativePrefix()}${filename}`;
}

export function formatAuthError(error) {
    const message = error?.message || "Something went wrong. Please try again.";

    if (message.includes("already exists")) {
        return "This email is already registered. Try logging in instead.";
    }
    if (message.includes("Invalid credentials")) {
        return "Wrong email or password.";
    }
    if (message.includes("password") && message.includes("8")) {
        return "Password must be at least 8 characters.";
    }
    if (message.includes("user_invalid_credentials")) {
        return "Wrong email or password.";
    }

    return message;
}
