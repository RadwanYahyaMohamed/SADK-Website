import { getCurrentUser } from "./auth-service.js";
import { authPageUrl } from "./auth-utils.js";
import { isEmailVerified } from "./auth-validation.js";

let authNavInjection = null;

export async function refreshAuthNav() {
    document.querySelectorAll(".nav-auth-item").forEach((item) => item.remove());
    authNavInjection = null;
    await injectAuthNav();
}

export async function injectAuthNav() {
    const navMenu = document.getElementById("navMenu");
    if (!navMenu) {
        return;
    }

    if (navMenu.querySelector(".nav-auth-item")) {
        return;
    }

    if (authNavInjection) {
        await authNavInjection;
        return;
    }

    authNavInjection = injectAuthNavItems(navMenu);
    try {
        await authNavInjection;
    } finally {
        authNavInjection = null;
    }
}

async function injectAuthNavItems(navMenu) {
    if (navMenu.querySelector(".nav-auth-item")) {
        return;
    }

    let loggedIn = false;
    let userName = "";
    let verified = false;

    try {
        const user = await getCurrentUser();
        loggedIn = true;
        verified = isEmailVerified(user);
        userName = user.name || user.email;
    } catch {
        loggedIn = false;
    }

    const accountLi = document.createElement("li");
    accountLi.className = "nav-item nav-auth-item";

    if (loggedIn) {
        if (verified) {
            accountLi.innerHTML = `<a href="${authPageUrl("account.html")}" class="nav-link nav-link-account"><i class="fas fa-user"></i> ${escapeHtml(userName)}</a>`;
        } else {
            accountLi.innerHTML = `<a href="${authPageUrl("verify-email.html")}" class="nav-link nav-link-account"><i class="fas fa-envelope"></i> Verify Email</a>`;
        }
        navMenu.appendChild(accountLi);
        return;
    }

    accountLi.innerHTML = `<a href="${authPageUrl("login.html")}" class="nav-link nav-link-login">Login</a>`;
    navMenu.appendChild(accountLi);

    const signupLi = document.createElement("li");
    signupLi.className = "nav-item nav-auth-item";
    signupLi.innerHTML = `<a href="${authPageUrl("signup.html")}" class="nav-link nav-link-signup">Sign up</a>`;
    navMenu.appendChild(signupLi);
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
