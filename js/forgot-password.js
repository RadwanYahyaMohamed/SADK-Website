import { requestPasswordRecovery } from "./auth-service.js";
import { formatAuthError, authPageUrl } from "./auth-utils.js";
import { redirectIfAuthenticated } from "./auth-guard.js";
import { isValidEmail, normalizeEmail } from "./auth-validation.js";

const form = document.getElementById("forgotPasswordForm");
const alertBox = document.getElementById("authAlert");
const submitBtn = document.getElementById("forgotSubmit");

document.addEventListener("DOMContentLoaded", () => {
    redirectIfAuthenticated();
});

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert();

        const email = normalizeEmail(form.email.value);

        if (!isValidEmail(email)) {
            showAlert("Please enter a valid email address.", "error");
            return;
        }

        setLoading(true);

        try {
            await requestPasswordRecovery(email);
            showAlert(
                "If an account exists for this email, you will receive a reset link shortly. Check spam too.",
                "success"
            );
            form.reset();
        } catch (error) {
            showAlert(formatAuthError(error), "error");
        } finally {
            setLoading(false);
        }
    });
}

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
        ? '<i class="fas fa-spinner fa-spin"></i> Sending…'
        : '<i class="fas fa-paper-plane"></i> Send Reset Link';
}
