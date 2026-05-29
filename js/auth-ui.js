/** Shared UI helpers for auth pages (password toggle, strength meter) */

export function setupPasswordToggles(root = document) {
    root.querySelectorAll("[data-toggle-password]").forEach((button) => {
        const targetId = button.getAttribute("data-toggle-password");
        const input = root.getElementById(targetId);
        if (!input) return;

        button.addEventListener("click", () => {
            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";
            const icon = button.querySelector("i");
            if (icon) {
                icon.className = isHidden ? "fas fa-eye-slash" : "fas fa-eye";
            }
            button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
        });
    });
}

export function setupPasswordStrength(passwordInput, meterEl, hintEl) {
    if (!passwordInput || !meterEl) return;

    const segments = meterEl.querySelectorAll(".password-strength-segment");

    const update = () => {
        const value = passwordInput.value;
        let score = 0;

        if (value.length >= 8) score++;
        if (value.length >= 12) score++;
        if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        const level = value.length === 0 ? 0 : Math.min(score, 5);

        segments.forEach((seg, index) => {
            seg.classList.toggle("active", index < level);
            seg.classList.toggle("weak", level <= 2 && index < level);
            seg.classList.toggle("medium", level === 3 && index < level);
            seg.classList.toggle("strong", level >= 4 && index < level);
        });

        if (hintEl) {
            if (!value) {
                hintEl.textContent =
                    "Use 8+ characters with upper & lower case, a number, and a symbol.";
            } else if (level <= 2) {
                hintEl.textContent = "Weak — add more variety to your password.";
            } else if (level === 3) {
                hintEl.textContent = "Fair — almost there!";
            } else {
                hintEl.textContent = "Strong password.";
            }
        }
    };

    passwordInput.addEventListener("input", update);
    update();
}
