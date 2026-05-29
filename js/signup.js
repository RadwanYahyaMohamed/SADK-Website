import { registerUser } from "./auth-service.js";
import { formatAuthError, authPageUrl } from "./auth-utils.js";
import { redirectIfAuthenticated } from "./auth-guard.js";
import {
    isValidEmail,
    normalizeEmail,
    sanitizeName,
    validatePassword,
} from "./auth-validation.js";
import { setupPasswordStrength, setupPasswordToggles } from "./auth-ui.js";

const form = document.getElementById("signupForm");
const alertBox = document.getElementById("authAlert");
const submitBtn = document.getElementById("signupSubmit");

document.addEventListener("DOMContentLoaded", () => {
    redirectIfAuthenticated();
    setupPasswordToggles();
    setupPasswordStrength(
        document.getElementById("password"),
        document.getElementById("passwordStrength"),
        document.getElementById("passwordHint")
    );
});

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert();

        const name = sanitizeName(form.name.value);
        const email = normalizeEmail(form.email.value);
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const grade = form.grade.value;
        const termsAccepted = form.terms?.checked;

        if (!name || name.length < 2) {
            showAlert("Please enter your full name (at least 2 characters).", "error");
            return;
        }

        if (!isValidEmail(email)) {
            showAlert("Please enter a valid email address.", "error");
            return;
        }

        if (!grade) {
            showAlert("Please select your grade.", "error");
            return;
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            showAlert(passwordCheck.errors[0], "error");
            return;
        }

        if (password !== confirmPassword) {
            showAlert("Passwords do not match.", "error");
            return;
        }

        if (!termsAccepted) {
            showAlert("Please accept the membership terms to continue.", "error");
            return;
        }

        setLoading(true);

        try {
            await registerUser({ name, email, password, grade });
            showAlert(
                "Account created! Check your email to verify your account, then continue.",
                "success"
            );
            setTimeout(() => {
                window.location.href = authPageUrl("verify-email.html");
            }, 1200);
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
        ? '<i class="fas fa-spinner fa-spin"></i> Creating account…'
        : '<i class="fas fa-user-plus"></i> Create Account';
}
