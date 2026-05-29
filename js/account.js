import {
    getUserProfile,
    logoutUser,
    getAvatarPreviewUrl,
    uploadProfileAvatar,
    updateUserProfile,
} from "./auth-service.js";
import { authPageUrl, formatAuthError } from "./auth-utils.js";
import { refreshAuthNav } from "./auth-nav.js";
import { requireVerifiedAuth } from "./auth-guard.js";
import { sanitizeName } from "./auth-validation.js";
import { Query } from "appwrite";
import { databases } from "./appwrite.js";
import { AUTH_CONFIG } from "./auth-config.js";
import { LEVELS_DB } from "./questions.js";

const CHALLENGE_COLLECTION_ID = "challenge_stats";

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
    currentUser = await requireVerifiedAuth();
    if (!currentUser) return;

    try {
        currentProfile = await getUserProfile(currentUser.$id);

        if (!currentProfile) {
            showProfileAlert("Profile not found. Please contact support.", "error");
            return;
        }

        renderAvatar(currentProfile.avatarFileId, currentUser.name);
        renderProfileForm(currentUser, currentProfile);
        setupAvatarUpload(currentUser.$id);
        await loadChallengeStats(currentUser.$id);
    } catch (error) {
        showProfileAlert(formatAuthError(error), "error");
    }
}

function renderAvatar(avatarFileId, name) {
    const url = getAvatarPreviewUrl(avatarFileId);

    if (url) {
        avatarImg.src = url;
        avatarImg.style.display = "block";
        avatarPlaceholder.style.display = "none";
        return;
    }

    avatarImg.style.display = "none";
    avatarPlaceholder.style.display = "flex";
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
            <label>Email status</label>
            <p class="readonly-value">✓ Verified</p>
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

    const name = sanitizeName(profileForm.querySelector("#profileName")?.value);
    const grade = profileForm.querySelector("#profileGrade")?.value;

    if (!name || name.length < 2) {
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

document.addEventListener("DOMContentLoaded", loadAccount);

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

function getHighestLevel(completedLevels) {
    const order = ["B1", "A2", "A1"];
    for (const level of order) {
        if ((completedLevels || []).includes(level)) return LEVELS_DB[level].name;
    }

    const levelIds = Object.keys(LEVELS_DB);
    for (let i = levelIds.length - 1; i >= 0; i -= 1) {
        const id = levelIds[i];
        if (!(completedLevels || []).includes(id)) {
            const locked = LEVELS_DB[id].requires &&
                !(completedLevels || []).includes(LEVELS_DB[id].requires);
            if (!locked) return `Working on ${LEVELS_DB[id].name}`;
        }
    }

    return "A1 - Beginner";
}

async function loadChallengeStats(userId) {
    const section = document.getElementById("challengeStatsSection");
    if (!section) return;

    try {
        const result = await databases.listDocuments({
            databaseId: AUTH_CONFIG.DATABASE_ID,
            collectionId: CHALLENGE_COLLECTION_ID,
            queries: [Query.equal("userId", userId)],
        });

        if (result.documents.length === 0) {
            section.innerHTML = `
                <p class="account-challenge-empty">
                    Start your challenge journey! Complete daily German exams to earn XP and build your streak.
                </p>
            `;
            return;
        }

        const doc = result.documents[0];
        const completedExams = doc.completedExams || [];
        const completedLevels = doc.completedLevels || [];
        const totalExams = Object.keys(LEVELS_DB).length * 10;
        const highestLevel = getHighestLevel(completedLevels);

        section.innerHTML = `
            <div class="account-challenge-stats">
                <div class="account-challenge-stat">
                    <strong>${doc.xp ?? 0}</strong>
                    <span>Total XP</span>
                </div>
                <div class="account-challenge-stat">
                    <strong>${doc.currentStreak ?? 0}</strong>
                    <span>Day Streak</span>
                </div>
                <div class="account-challenge-stat">
                    <strong>${completedExams.length}</strong>
                    <span>Exams Done</span>
                </div>
                <div class="account-challenge-stat">
                    <strong>${completedLevels.length}/3</strong>
                    <span>Levels Complete</span>
                </div>
            </div>
            <p class="field-hint" style="text-align:center;margin-top:0.5rem;">
                Current level: <strong>${escapeHtml(highestLevel)}</strong>
                · ${completedExams.length}/${totalExams} total exams
            </p>
        `;
    } catch {
        section.innerHTML = `
            <p class="account-challenge-empty">
                Start your challenge journey! Complete daily German exams to earn XP and build your streak.
            </p>
        `;
    }
}
