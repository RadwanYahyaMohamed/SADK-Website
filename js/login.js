import { loginUser } from "./auth-service.js";
import { formatAuthError } from "./auth-utils.js";

const form = document.getElementById("loginForm");
const alertBox = document.getElementById("authAlert");
const submitBtn = document.getElementById("loginSubmit");

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert();

        const email = form.email.value.trim();
        const password = form.password.value;

        if (!email || !password) {
            showAlert("Please enter your email and password.", "error");
            return;
        }

        setLoading(true);

        try {
            await loginUser(email, password);
            showAlert("Login successful! Redirecting…", "success");
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
        ? '<i class="fas fa-spinner fa-spin"></i> Signing in…'
        : '<i class="fas fa-sign-in-alt"></i> Sign In';
}
