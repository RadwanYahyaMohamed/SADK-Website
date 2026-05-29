import {
    completeEmailVerification,
    sendEmailVerification,
    getCurrentUser,
} from "./auth-service.js";
import { isEmailVerified } from "./auth-validation.js";
import {
    authPageUrl,
    formatAuthError,
    isAlreadyVerifiedError,
} from "./auth-utils.js";
import { requireAuthForVerification } from "./auth-guard.js";

const alertBox = document.getElementById("authAlert");
const resendBtn = document.getElementById("resendVerificationBtn");
const continueBtn = document.getElementById("continueToAccountBtn");
const statusText = document.getElementById("verifyStatusText");

const verificationStorageKey = (userId) => `sadk_email_verified_${userId}`;

async function init() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");

    if (userId && secret) {
        if (sessionStorage.getItem(verificationStorageKey(userId)) === "1") {
            finishVerificationSuccess(null, true);
            return;
        }
        await handleVerificationLink(userId, secret);
        return;
    }

    const user = await requireAuthForVerification();
    if (!user) return;

    setStatus(`Signed in as ${user.email}. Open the verification link we sent to your email.`);
    showAlert(
        "Check your inbox (and spam). After verifying, you can open your account.",
        "success"
    );
}

async function handleVerificationLink(userId, secret) {
    setStatus("Verifying your email…");
    disableActions(true);

    try {
        const user = await completeEmailVerification(userId, secret);
        sessionStorage.setItem(verificationStorageKey(userId), "1");
        finishVerificationSuccess(user, false);
    } catch (error) {
        if (isAlreadyVerifiedError(error)) {
            sessionStorage.setItem(verificationStorageKey(userId), "1");
            finishVerificationSuccess(null, true);
            return;
        }

        showAlert(formatAuthError(error), "error");
        setStatus("Could not verify from this link. Try signing in — your email may already be verified.");
        disableActions(false);

        if (continueBtn) {
            continueBtn.hidden = false;
            continueBtn.textContent = "Go to Login";
            continueBtn.href = authPageUrl("login.html");
        }
    }
}

function finishVerificationSuccess(user, alreadyVerified) {
    const message = alreadyVerified
        ? "Your email is already verified! Redirecting…"
        : "Your email is verified!";
    showAlert(message, "success");
    window.history.replaceState({}, "", window.location.pathname);

    if (!user) {
        setStatus("Email confirmed. Sign in to open your account.");
        setTimeout(() => {
            window.location.href = `${authPageUrl("login.html")}?verified=1`;
        }, 1500);
        return;
    }

    setStatus(`Welcome, ${user.name || user.email}!`);
    setTimeout(() => {
        window.location.href = authPageUrl("account.html");
    }, 1000);
}

if (resendBtn) {
    resendBtn.addEventListener("click", async () => {
        hideAlert();
        resendBtn.disabled = true;

        try {
            await sendEmailVerification();
            showAlert("Verification email sent! Check your inbox and spam folder.", "success");
        } catch (error) {
            showAlert(formatAuthError(error), "error");
        } finally {
            resendBtn.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", init);

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

function setStatus(text) {
    if (statusText) statusText.textContent = text;
}

function disableActions(disabled) {
    if (resendBtn) resendBtn.disabled = disabled;
}
