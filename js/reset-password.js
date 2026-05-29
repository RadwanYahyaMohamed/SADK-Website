import { completePasswordRecovery } from "./auth-service.js";
import { formatAuthError, authPageUrl } from "./auth-utils.js";
import { validatePassword } from "./auth-validation.js";
import { setupPasswordStrength, setupPasswordToggles } from "./auth-ui.js";

const form = document.getElementById("resetPasswordForm");
const alertBox = document.getElementById("authAlert");
const submitBtn = document.getElementById("resetSubmit");
const invalidLinkBox = document.getElementById("invalidLinkBox");

const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");
const secret = params.get("secret");

setupPasswordToggles();
setupPasswordStrength(
    document.getElementById("password"),
    document.getElementById("passwordStrength"),
    document.getElementById("passwordHint")
);

if (!userId || !secret) {
    if (form) form.hidden = true;
    if (invalidLinkBox) invalidLinkBox.hidden = false;
} else if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert();

        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const passwordCheck = validatePassword(password);

        if (!passwordCheck.valid) {
            showAlert(passwordCheck.errors[0], "error");
            return;
        }

        if (password !== confirmPassword) {
            showAlert("Passwords do not match.", "error");
            return;
        }

        setLoading(true);

        try {
            await completePasswordRecovery(userId, secret, password);
            showAlert(
                "Password updated! Wait a few seconds, then sign in with your new password.",
                "success"
            );
            setTimeout(() => {
                window.location.href = `${authPageUrl("login.html")}?reset=1`;
            }, 2000);
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
        ? '<i class="fas fa-spinner fa-spin"></i> Updating…'
        : '<i class="fas fa-key"></i> Set New Password';
}
