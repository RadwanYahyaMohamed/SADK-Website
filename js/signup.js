import { registerUser } from "./auth-service.js";
import { formatAuthError } from "./auth-utils.js";

const form = document.getElementById("signupForm");
const alertBox = document.getElementById("authAlert");
const submitBtn = document.getElementById("signupSubmit");

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const grade = form.grade.value;

        if (!name || !email || !password) {
            showAlert("Please fill in all required fields.", "error");
            return;
        }

        if (password.length < 8) {
            showAlert("Password must be at least 8 characters.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showAlert("Passwords do not match.", "error");
            return;
        }

        setLoading(true);

        try {
            await registerUser({ name, email, password, grade });
            showAlert("Account created! Redirecting…", "success");
            setTimeout(() => {
                window.location.href = "account.html";
            }, 800);
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
