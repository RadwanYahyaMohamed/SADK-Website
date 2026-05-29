import { loginUser } from "./auth-service.js";
import { formatAuthError, authPageUrl } from "./auth-utils.js";
import { redirectIfAuthenticated } from "./auth-guard.js";
import { isValidEmail, isEmailVerified, normalizeEmail } from "./auth-validation.js";
import { setupPasswordToggles } from "./auth-ui.js";

const form = document.getElementById("loginForm");
const alertBox = document.getElementById("authAlert");
const submitBtn = document.getElementById("loginSubmit");

function showAlert(message, type) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `auth-alert visible ${type}`;
}

function hideAlert() {
    if (!alertBox) return;
    alertBox.className = "auth-alert";
    alertBox.textContent = "";
}

function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
        ? '<i class="fas fa-spinner fa-spin"></i> Signing in…'
        : '<i class="fas fa-sign-in-alt"></i> Sign In';
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("reset") === "1") {
        showAlert("Password changed successfully. Sign in with your new password.", "success");
    }

    if (params.get("verified") === "1") {
        showAlert("Email verified! Sign in to open your account.", "success");
    }

    redirectIfAuthenticated();
    setupPasswordToggles();
});

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert();

        const email = normalizeEmail(form.email.value);
        const password = form.password.value;

        if (!email || !password) {
            showAlert("Please enter your email and password.", "error");
            return;
        }

        if (!isValidEmail(email)) {
            showAlert("Please enter a valid email address.", "error");
            return;
        }

        setLoading(true);

        try {
            const user = await loginUser(email, password);
            const destination = isEmailVerified(user)
                ? "account.html"
                : "verify-email.html";
            showAlert("Login successful! Redirecting…", "success");
            setTimeout(() => {
                window.location.href = authPageUrl(destination);
            }, 800);
        } catch (error) {
            showAlert(formatAuthError(error), "error");
        } finally {
            setLoading(false);
        }
    });
}
