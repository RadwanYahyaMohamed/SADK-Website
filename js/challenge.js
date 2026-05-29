import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "./appwrite.js";
import { getCurrentUser } from "./auth-service.js";
import { authPageUrl } from "./auth-utils.js";
import { isEmailVerified } from "./auth-validation.js";
import { AUTH_CONFIG } from "./auth-config.js";
import { LEVELS_DB, EXAMS_POOL } from "./questions.js";

const CHALLENGE_COLLECTION_ID = "challenge_stats";
const DATABASE_ID = AUTH_CONFIG.DATABASE_ID;
const PROFILES_COLLECTION_ID = AUTH_CONFIG.PROFILES_COLLECTION_ID;
const EXAMS_PER_LEVEL = 10;
const QUESTIONS_PER_EXAM = 5;

let currentUser = null;
let stats = null;
let statsDocId = null;

let activeLevel = null;
let activeExam = null;
let activeQuestion = 0;
let questionLocked = false;

const loadingState = () => document.getElementById("loadingState");
const mainGrid = () => document.getElementById("mainGrid");
const levelsView = () => document.getElementById("levelsView");
const examsView = () => document.getElementById("examsView");
const quizModal = () => document.getElementById("quizModal");

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getYesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
}

function examId(levelId, examIndex) {
    return `${levelId}_Exam${examIndex + 1}`;
}

function countCompletedExamsForLevel(levelId, data) {
    const completed = data.completedExams || [];
    return completed.filter((e) => e.startsWith(`${levelId}_`)).length;
}

function isLevelLocked(levelId, data) {
    const level = LEVELS_DB[levelId];
    if (!level?.requires) return false;
    return !(data.completedLevels || []).includes(level.requires);
}

function isLevelCompleted(levelId, data) {
    return countCompletedExamsForLevel(levelId, data) >= EXAMS_PER_LEVEL;
}

function isExamDone(levelId, examIndex, data) {
    return (data.completedExams || []).includes(examId(levelId, examIndex));
}

/** Exam 1 is open; each next exam unlocks after the previous is completed. */
function isExamLocked(levelId, examIndex, data) {
    if (examIndex === 0) return false;
    return !isExamDone(levelId, examIndex - 1, data);
}

function statsPermissions(userId) {
    const owner = Role.user(userId);
    return [
        Permission.read(owner),
        Permission.update(owner),
        Permission.delete(owner),
    ];
}

/**
 * Appwrite "String" attributes store lists as JSON text.
 * Also accepts native String[] if configured that way in Console.
 */
export function parseStringList(value) {
    if (Array.isArray(value)) {
        return value.filter((item) => typeof item === "string");
    }

    if (typeof value === "string" && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.filter((item) => typeof item === "string");
            }
        } catch {
            return value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    return [];
}

export function serializeStringList(list) {
    return JSON.stringify(Array.isArray(list) ? list : []);
}

function docToStats(doc) {
    return {
        $id: doc.$id,
        userId: doc.userId,
        xp: doc.xp ?? 0,
        currentStreak: doc.currentStreak ?? 0,
        lastActiveDate: doc.lastActiveDate ?? getToday(),
        completedExams: parseStringList(doc.completedExams),
        completedLevels: parseStringList(doc.completedLevels),
    };
}

async function getOrCreateStats(userId) {
    const result = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: CHALLENGE_COLLECTION_ID,
        queries: [Query.equal("userId", userId)],
    });

    if (result.documents.length > 0) {
        return docToStats(result.documents[0]);
    }

    const today = getToday();
    const created = await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: CHALLENGE_COLLECTION_ID,
        documentId: ID.unique(),
        data: {
            userId,
            xp: 0,
            currentStreak: 0,
            lastActiveDate: today,
            completedExams: serializeStringList([]),
            completedLevels: serializeStringList([]),
        },
        permissions: statsPermissions(userId),
    });

    return docToStats(created);
}

function checkAndUpdateStreak(data) {
    const today = getToday();
    const yesterday = getYesterday();
    const updated = { ...data };

    if (
        updated.lastActiveDate !== today &&
        updated.lastActiveDate !== yesterday
    ) {
        updated.currentStreak = 0;
    }

    return updated;
}

async function saveStats(data) {
    const updated = await databases.updateDocument({
        databaseId: DATABASE_ID,
        collectionId: CHALLENGE_COLLECTION_ID,
        documentId: data.$id,
        data: {
            xp: data.xp,
            currentStreak: data.currentStreak,
            lastActiveDate: data.lastActiveDate,
            completedExams: serializeStringList(data.completedExams),
            completedLevels: serializeStringList(data.completedLevels),
        },
    });

    return docToStats(updated);
}

function renderStatsBar(data) {
    const bar = document.getElementById("statsBar");
    const streakEl = document.getElementById("streakCount");
    const xpEl = document.getElementById("xpCount");

    if (!bar || !streakEl || !xpEl) return;

    bar.classList.remove("hidden");
    streakEl.textContent = String(data.currentStreak);
    xpEl.textContent = String(data.xp);
}

function showSuccessMessage(message) {
    const banner = document.getElementById("challengeSuccess");
    if (!banner) return;

    banner.textContent = message;
    banner.classList.remove("hidden");

    setTimeout(() => {
        banner.classList.add("hidden");
    }, 4500);
}

function renderLevels(data) {
    const container = levelsView();
    const exams = examsView();
    if (!container) return;

    if (exams) exams.classList.add("hidden");
    container.classList.remove("hidden");

    const levelIds = Object.keys(LEVELS_DB);

    container.innerHTML = `
        <div class="levels-header">
            <h2><i class="fas fa-layer-group"></i> Choose Your Level</h2>
            <p>Complete all 10 exams in a level to unlock the next one.</p>
        </div>
        <div class="levels-grid">
            ${levelIds
                .map((id) => {
                    const level = LEVELS_DB[id];
                    const locked = isLevelLocked(id, data);
                    const completed = isLevelCompleted(id, data);
                    const doneCount = countCompletedExamsForLevel(id, data);
                    const progress = Math.round((doneCount / EXAMS_PER_LEVEL) * 100);

                    let stateClass = "";
                    if (completed) stateClass = "completed";
                    else if (locked) stateClass = "locked";

                    let statusBadge = `<span class="badge-pending">${doneCount}/${EXAMS_PER_LEVEL} exams</span>`;
                    if (completed) {
                        statusBadge = `<span class="badge-completed">Level Complete!</span>`;
                    } else if (locked) {
                        statusBadge = `<span class="badge-pending">Locked — finish ${level.requires} first</span>`;
                    }

                    return `
                        <div class="level-card ${stateClass}" data-level="${id}" ${locked ? 'aria-disabled="true"' : ""}>
                            <div class="level-icon"><i class="fas fa-graduation-cap"></i></div>
                            <h3>${escapeHtml(level.name)}</h3>
                            <p>${statusBadge}</p>
                            <div class="level-progress-bar" aria-hidden="true">
                                <div style="width: ${progress}%"></div>
                            </div>
                        </div>
                    `;
                })
                .join("")}
        </div>
    `;

    container.querySelectorAll(".level-card:not(.locked)").forEach((card) => {
        card.addEventListener("click", () => {
            const levelId = card.getAttribute("data-level");
            if (levelId) renderExams(levelId, stats);
        });
    });
}

function renderExams(levelId, data) {
    const container = examsView();
    const levels = levelsView();
    if (!container || !levels) return;

    levels.classList.add("hidden");
    container.classList.remove("hidden");

    const level = LEVELS_DB[levelId];
    const doneCount = countCompletedExamsForLevel(levelId, data);

    container.innerHTML = `
        <button type="button" class="back-btn" id="backToLevels">
            <i class="fas fa-arrow-left"></i> Back to Levels
        </button>
        <div class="exams-header">
            <h2>${escapeHtml(level.name)}</h2>
            <p>${doneCount} of ${EXAMS_PER_LEVEL} exams completed · complete exams in order</p>
        </div>
        <div class="exam-grid">
            ${Array.from({ length: EXAMS_PER_LEVEL }, (_, i) => {
                const done = isExamDone(levelId, i, data);
                const locked = !done && isExamLocked(levelId, i, data);
                let stateClass = "";
                if (done) stateClass = "done";
                else if (locked) stateClass = "locked";

                let badge = '<span class="badge-pending">Start</span>';
                if (done) {
                    badge = '<span class="badge-completed">Completed</span>';
                } else if (locked) {
                    badge = `<span class="badge-pending">Locked — finish Exam ${i} first</span>`;
                }

                return `
                    <div class="exam-card ${stateClass}" data-exam="${i}">
                        <h4>Exam ${i + 1}</h4>
                        <p>${QUESTIONS_PER_EXAM} questions · +50 XP bonus</p>
                        ${badge}
                    </div>
                `;
            }).join("")}
        </div>
    `;

    container.querySelector("#backToLevels")?.addEventListener("click", () => {
        renderLevels(stats);
    });

    container.querySelectorAll(".exam-card:not(.done):not(.locked)").forEach((card) => {
        card.addEventListener("click", () => {
            const examIndex = Number(card.getAttribute("data-exam"));
            startQuiz(levelId, examIndex, stats);
        });
    });
}

function startQuiz(levelId, examIndex, data) {
    if (isExamLocked(levelId, examIndex, data)) return;

    activeLevel = levelId;
    activeExam = examIndex;
    activeQuestion = 0;
    questionLocked = false;
    stats = data;

    const modal = quizModal();
    if (modal) modal.classList.remove("hidden");

    renderQuestion();
}

function closeQuizModal() {
    const modal = quizModal();
    if (modal) modal.classList.add("hidden");

    const feedback = document.getElementById("quizFeedback");
    if (feedback) {
        feedback.classList.add("hidden");
        feedback.textContent = "";
        feedback.className = "hidden";
    }

    activeLevel = null;
    activeExam = null;
    activeQuestion = 0;
    questionLocked = false;
}

function renderQuestion() {
    const questions = EXAMS_POOL[activeLevel]?.[activeExam];
    if (!questions || activeQuestion >= questions.length) {
        completeExam();
        return;
    }

    questionLocked = false;
    const q = questions[activeQuestion];
    const tagEl = document.getElementById("quizTag");
    const progressEl = document.getElementById("quizProgress");
    const questionEl = document.getElementById("quizQuestion");
    const optionsEl = document.getElementById("quizOptions");
    const feedbackEl = document.getElementById("quizFeedback");

    if (tagEl) tagEl.textContent = `${activeLevel} — EXAM ${activeExam + 1}`;
    if (progressEl) {
        progressEl.textContent = `Question ${activeQuestion + 1}/${questions.length}`;
    }
    if (questionEl) questionEl.textContent = q.q;
    if (feedbackEl) {
        feedbackEl.classList.add("hidden");
        feedbackEl.textContent = "";
    }

    if (!optionsEl) return;

    optionsEl.innerHTML = q.o
        .map(
            (option, idx) =>
                `<button type="button" class="quiz-option" data-idx="${idx}">${escapeHtml(option)}</button>`
        )
        .join("");

    optionsEl.querySelectorAll(".quiz-option").forEach((btn) => {
        btn.addEventListener("click", () => {
            const selectedIdx = Number(btn.getAttribute("data-idx"));
            handleAnswer(selectedIdx, q.c, btn);
        });
    });
}

async function handleAnswer(selectedIdx, correctIdx, optionBtn) {
    if (questionLocked) return;
    questionLocked = true;

    const questions = EXAMS_POOL[activeLevel]?.[activeExam];
    const q = questions?.[activeQuestion];
    if (!q) return;

    const feedbackEl = document.getElementById("quizFeedback");
    const optionsEl = document.getElementById("quizOptions");
    const allButtons = optionsEl?.querySelectorAll(".quiz-option") ?? [];

    allButtons.forEach((btn) => {
        btn.disabled = true;
    });

    const advanceDelay = 1600;

    if (selectedIdx === correctIdx) {
        stats.xp += 10;
        renderStatsBar(stats);
        optionBtn.classList.add("correct");

        if (feedbackEl) {
            feedbackEl.textContent = "Richtig! +10 XP";
            feedbackEl.className = "success";
            feedbackEl.classList.remove("hidden");
        }
    } else {
        stats.xp = Math.max(0, stats.xp - 5);
        renderStatsBar(stats);
        optionBtn.classList.add("wrong");

        allButtons.forEach((btn) => {
            const idx = Number(btn.getAttribute("data-idx"));
            if (idx === correctIdx) {
                btn.classList.add("correct");
            }
        });

        const correctAnswer = q.o[correctIdx];
        if (feedbackEl) {
            feedbackEl.innerHTML =
                `Falsch! −5 XP<br><span class="quiz-correct-reveal">Richtige Antwort: <strong>${escapeHtml(correctAnswer)}</strong></span>`;
            feedbackEl.className = "error";
            feedbackEl.classList.remove("hidden");
        }
    }

    activeQuestion += 1;

    setTimeout(() => {
        if (activeQuestion < (questions?.length ?? 0)) {
            renderQuestion();
        } else {
            completeExam();
        }
    }, advanceDelay);
}

async function completeExam() {
    const id = examId(activeLevel, activeExam);
    const wasNew = !(stats.completedExams || []).includes(id);

    if (wasNew) {
        stats.completedExams = [...(stats.completedExams || []), id];
        stats.currentStreak += 1;
        stats.xp += LEVELS_DB[activeLevel]?.xpPerExam ?? 50;

        if (countCompletedExamsForLevel(activeLevel, stats) >= EXAMS_PER_LEVEL) {
            if (!(stats.completedLevels || []).includes(activeLevel)) {
                stats.completedLevels = [...(stats.completedLevels || []), activeLevel];
            }
        }
    }

    stats.lastActiveDate = getToday();

    try {
        stats = await saveStats(stats);
    } catch (error) {
        console.error("Failed to save challenge stats:", error);
        showSuccessMessage("Exam finished, but saving progress failed. Please refresh.");
        closeQuizModal();
        return;
    }

    closeQuizModal();
    await triggerConfetti();

    const bonusMsg = wasNew
        ? `Exam complete! +50 XP bonus · Streak: ${stats.currentStreak} 🔥`
        : "Exam reviewed — progress already saved.";
    showSuccessMessage(bonusMsg);

    renderStatsBar(stats);

    if (examsView() && !examsView().classList.contains("hidden")) {
        renderExams(activeLevel, stats);
    } else {
        renderLevels(stats);
    }

    await loadLeaderboard();
}

async function loadLeaderboard() {
    const listEl = document.getElementById("leaderboardList");
    if (!listEl) return;

    listEl.innerHTML = `<p class="leaderboard-empty"><i class="fas fa-spinner fa-spin"></i> Loading…</p>`;

    try {
        const result = await databases.listDocuments({
            databaseId: DATABASE_ID,
            collectionId: CHALLENGE_COLLECTION_ID,
            queries: [Query.orderDesc("xp"), Query.limit(10)],
        });

        if (result.documents.length === 0) {
            listEl.innerHTML = `<p class="leaderboard-empty">No challengers yet — be the first!</p>`;
            return;
        }

        const items = await Promise.all(
            result.documents.map(async (doc, index) => {
                const name = await resolveUserName(doc.userId);
                const rank = index + 1;
                let medal = `<span class="rank-medal">${rank}</span>`;
                if (rank === 1) medal = `<span class="rank-medal">🥇</span>`;
                else if (rank === 2) medal = `<span class="rank-medal">🥈</span>`;
                else if (rank === 3) medal = `<span class="rank-medal">🥉</span>`;

                return `
                    <div class="leaderboard-item">
                        ${medal}
                        <div class="user-info">
                            <div class="user-name">${escapeHtml(name)}</div>
                            <div class="user-streak"><i class="fas fa-fire"></i> ${doc.currentStreak ?? 0} day streak</div>
                        </div>
                        <div class="user-xp">${doc.xp ?? 0} XP</div>
                    </div>
                `;
            })
        );

        listEl.innerHTML = items.join("");
    } catch (error) {
        console.error("Leaderboard error:", error);
        listEl.innerHTML = `<p class="leaderboard-empty">Could not load leaderboard.</p>`;
    }
}

async function resolveUserName(userId) {
    try {
        const profileResult = await databases.listDocuments({
            databaseId: DATABASE_ID,
            collectionId: PROFILES_COLLECTION_ID,
            queries: [Query.equal("userId", userId)],
        });

        const profile = profileResult.documents[0];
        if (profile?.name) return profile.name;
    } catch {
        /* fallback below */
    }

    return `Member ${userId.slice(0, 6)}…`;
}

async function triggerConfetti() {
    try {
        if (!window.confetti) {
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src =
                    "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        window.confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#DE0000", "#FFCC00", "#000000"],
        });
    } catch {
        /* confetti is optional */
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showAuthGateMessage(title, message, redirectUrl, delayMs = 3500, redirectLabel = "Redirecting…") {
    const loading = loadingState();
    if (loading) {
        loading.classList.add("challenge-auth-gate");
        loading.innerHTML = `
            <i class="fas fa-lock"></i>
            <p class="auth-gate-title">${escapeHtml(title)}</p>
            <p class="auth-gate-message">${escapeHtml(message)}</p>
            <p class="auth-gate-redirect">${escapeHtml(redirectLabel)}</p>
            <a href="${redirectUrl}" class="btn btn-primary auth-gate-btn">Continue</a>
        `;
    }

    setTimeout(() => {
        window.location.href = redirectUrl;
    }, delayMs);
}

async function initChallenge() {
    let user;

    try {
        user = await getCurrentUser();
    } catch {
        showAuthGateMessage(
            "Login Required",
            "You must sign in before accessing the Daily Challenge. Please log in to track your XP and streak.",
            authPageUrl("login.html"),
            3500,
            "Redirecting you to sign in…"
        );
        return;
    }

    if (!isEmailVerified(user)) {
        showAuthGateMessage(
            "Email Verification Required",
            "Please verify your email before using the Daily Challenge.",
            authPageUrl("verify-email.html"),
            3500,
            "Redirecting you to email verification…"
        );
        return;
    }

    currentUser = user;

    document.getElementById("closeQuiz")?.addEventListener("click", closeQuizModal);

    quizModal()?.addEventListener("click", (event) => {
        if (event.target === quizModal()) closeQuizModal();
    });

    try {
        stats = await getOrCreateStats(user.$id);
        statsDocId = stats.$id;
        stats = checkAndUpdateStreak(stats);

        loadingState()?.classList.add("hidden");
        mainGrid()?.classList.remove("hidden");

        renderStatsBar(stats);
        renderLevels(stats);
        await loadLeaderboard();
    } catch (error) {
        const loading = loadingState();
        if (loading) {
            loading.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Could not load challenge data. Check the <strong>challenge_stats</strong> collection in Appwrite.</p>
                <p style="font-size:0.9rem;margin-top:0.5rem;">${escapeHtml(error?.message || "Unknown error")}</p>
                <p style="font-size:0.85rem;margin-top:0.75rem;color:#666;">
                    <strong>completedExams</strong> and <strong>completedLevels</strong> must be type
                    <strong>String</strong> (size 1000 and 100) — not String Array. The app stores them as JSON text.
                </p>
            `;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("challengeApp")) {
        initChallenge();
    }
});

export {
    getOrCreateStats,
    docToStats,
    countCompletedExamsForLevel,
};
