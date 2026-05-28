import {
    getCurrentUser,
    getUserProfile,
    logoutUser,
    getAvatarPreviewUrl,
    uploadProfileAvatar,
    updateUserProfile,
} from "./auth-service.js";
import { authPageUrl, formatAuthError } from "./auth-utils.js";
import { refreshAuthNav } from "./auth-nav.js";

const profileForm = document.getElementById("profileForm");
const profileAlert = document.getElementById("profileAlert");
const logoutBtn = document.getElementById("logoutBtn");
const avatarImg = document.getElementById("avatarImg");
const avatarPlaceholder = document.getElementById("avatarPlaceholder");
const avatarInput = document.getElementById("avatarInput");
const avatarStatus = document.getElementById("avatarStatus");

let currentProfile = null;
let currentUser = null;

async function loadAccount() {
    try {
        currentUser = await getCurrentUser();
        currentProfile = await getUserProfile(currentUser.$id);

        if (!currentProfile) {
            showProfileAlert("Profile not found. Please contact support.", "error");
            return;
        }

        renderAvatar(currentProfile.avatarFileId, currentUser.name);
        renderProfileForm(currentUser, currentProfile);
        setupAvatarUpload(currentUser.$id);
    } catch {
        window.location.href = authPageUrl("login.html");
    }
}

function renderAvatar(avatarFileId, name) {
    const url = getAvatarPreviewUrl(avatarFileId);

    if (url) {
        avatarImg.src = url;
        avatarImg.hidden = false;
        avatarPlaceholder.hidden = true;
        return;
    }

    avatarImg.hidden = true;
    avatarPlaceholder.hidden = false;
    avatarPlaceholder.innerHTML = `<span>${getInitials(name)}</span>`;
}

function renderProfileForm(user, profile) {
    const grade = profile.grade || "";

    profileForm.innerHTML = `
        <div class="form-group">
            <label for="profileName">Full Name</label>
            <input type="text" id="profileName" name="name" value="${escapeAttr(user.name || "")}" required maxlength="128" autocomplete="name">
        </div>
        <div class="form-group">
            <label for="profileEmail">Email</label>
            <input type="email" id="profileEmail" value="${escapeAttr(user.email)}" disabled class="input-readonly">
            <span class="field-hint">Email cannot be changed here.</span>
        </div>
        <div class="form-group">
            <label for="profileGrade">Grade</label>
            <select id="profileGrade" name="grade" required>
                <option value="" ${grade === "" ? "selected" : ""}>Select your grade</option>
                <option value="G10" ${grade === "G10" ? "selected" : ""}>G10</option>
                <option value="G11" ${grade === "G11" ? "selected" : ""}>G11</option>
                <option value="G12" ${grade === "G12" ? "selected" : ""}>G12</option>
                <option value="Other" ${grade === "Other" ? "selected" : ""}>Other</option>
            </select>
        </div>
        <div class="form-group form-group-readonly">
            <label>Member since</label>
            <p class="readonly-value">${formatDate(user.$createdAt)}</p>
        </div>
        <button type="submit" class="auth-submit" id="saveProfileBtn">
            <i class="fas fa-save"></i> Save Changes
        </button>
    `;

    profileForm.addEventListener("submit", handleProfileSubmit);
}

async function handleProfileSubmit(event) {
    event.preventDefault();
    hideProfileAlert();

    const name = profileForm.querySelector("#profileName")?.value.trim();
    const grade = profileForm.querySelector("#profileGrade")?.value;

    if (!name) {
        showProfileAlert("Please enter your name.", "error");
        return;
    }

    if (!grade) {
        showProfileAlert("Please select your grade.", "error");
        return;
    }

    const submitBtn = profileForm.querySelector("#saveProfileBtn");
    setButtonLoading(submitBtn, true);

    try {
        currentUser = await updateUserProfile(currentProfile.$id, { name, grade });
        currentProfile.name = name;
        currentProfile.grade = grade;

        renderAvatar(currentProfile.avatarFileId, currentUser.name);
        await refreshAuthNav();
        showProfileAlert("Profile updated successfully!", "success");
    } catch (error) {
        showProfileAlert(formatAuthError(error), "error");
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

function setupAvatarUpload(userId) {
    if (!avatarInput || !currentProfile) return;

    avatarInput.addEventListener("change", async () => {
        const file = avatarInput.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setAvatarStatus("Image must be under 5 MB.", true);
            return;
        }

        setAvatarStatus("Uploading…");
        avatarInput.disabled = true;

        try {
            const fileId = await uploadProfileAvatar(
                currentProfile.$id,
                userId,
                file
            );
            currentProfile.avatarFileId = fileId;
            renderAvatar(fileId, currentUser?.name || currentProfile.name);
            setAvatarStatus("Photo updated!");
        } catch (error) {
            setAvatarStatus(formatAuthError(error), true);
        } finally {
            avatarInput.disabled = false;
            avatarInput.value = "";
        }
    });
}

function showProfileAlert(message, type) {
    if (!profileAlert) return;
    profileAlert.textContent = message;
    profileAlert.className = `auth-alert visible ${type}`;
}

function hideProfileAlert() {
    if (!profileAlert) return;
    profileAlert.className = "auth-alert";
    profileAlert.textContent = "";
}

function setButtonLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    button.innerHTML = loading
        ? '<i class="fas fa-spinner fa-spin"></i> Saving…'
        : '<i class="fas fa-save"></i> Save Changes';
}

function setAvatarStatus(message, isError = false) {
    if (!avatarStatus) return;
    avatarStatus.textContent = message;
    avatarStatus.style.color = isError ? "#9b1c1c" : "";
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        logoutBtn.disabled = true;
        try {
            await logoutUser();
            window.location.href = authPageUrl("login.html");
        } catch (error) {
            alert(formatAuthError(error));
            logoutBtn.disabled = false;
        }
    });
}

loadAccount();

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttr(text) {
    return escapeHtml(text).replace(/"/g, "&quot;");
}

function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
