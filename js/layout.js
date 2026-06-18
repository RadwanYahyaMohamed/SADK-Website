function addAnnouncementBar() {
    const expiryDate = new Date('2026-07-03T23:59:59+03:00');
    const now = new Date();

    if (now < expiryDate) {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sadk-gradient {
                0%   { background-position: 0% 50%; }
                50%  { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes sadk-shimmer {
                0%   { left: -70%; }
                100% { left: 130%; }
            }
            @keyframes sadk-slide-in {
                from { transform: translateY(-100%); opacity: 0; }
                to   { transform: translateY(0);     opacity: 1; }
            }
            @keyframes sadk-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(184,146,42,0.55); }
                50%       { box-shadow: 0 0 0 7px rgba(184,146,42,0);  }
            }
            @keyframes sadk-arrow {
                0%, 100% { transform: translateX(0); }
                50%       { transform: translateX(3px); }
            }
            @keyframes sadk-star {
                0%, 100% { opacity: 0.4; transform: scale(1)   rotate(0deg);  }
                50%       { opacity: 1;   transform: scale(1.3) rotate(15deg); }
            }
            @keyframes sadk-dot-pulse {
                0%, 100% { opacity: 1;   transform: scale(1);   }
                50%       { opacity: 0.5; transform: scale(0.7); }
            }

            #announcement-bar {
                position: fixed;
                top: 0; left: 0;
                width: 100%;
                z-index: 9999;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                border-bottom: 1.5px solid rgba(184,146,42,0.45);
                background: linear-gradient(
                    120deg,
                    #0f172a 0%, #1a2540 15%, #7a1a14 40%,
                    #c0392b 55%, #b8922a 72%, #1a2540 88%, #0f172a 100%
                );
                background-size: 300% 300%;
                animation: sadk-gradient 8s ease infinite, sadk-slide-in 0.5s ease-out;
                box-shadow:
                    0 2px 20px rgba(192,57,43,0.35),
                    0 1px 0 rgba(184,146,42,0.15) inset;
            }

            #announcement-bar::before {
                content: '';
                position: absolute;
                top: 0; left: -70%;
                width: 40%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
                animation: sadk-shimmer 3.5s linear infinite;
                pointer-events: none;
            }

            #announcement-bar::after {
                content: '';
                position: absolute;
                bottom: 0; left: 10%;
                width: 80%; height: 1px;
                background: linear-gradient(90deg, transparent, rgba(240,201,64,0.8), transparent);
            }

            #announcement-bar .ab-inner {
                display: flex;
                align-items: center;
                gap: 14px;
                position: relative;
                z-index: 1;
                padding: 0 16px;
                max-width: 100%;
            }

            #announcement-bar .ab-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(184,146,42,0.18);
                border: 1px solid rgba(184,146,42,0.5);
                color: #f0c940;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1.8px;
                text-transform: uppercase;
                padding: 3px 10px;
                border-radius: 20px;
                white-space: nowrap;
                flex-shrink: 0;
            }

            #announcement-bar .ab-dot {
                width: 5px; height: 5px;
                border-radius: 50%;
                background: #f0c940;
                animation: sadk-dot-pulse 1.8s ease-in-out infinite;
                flex-shrink: 0;
            }

            #announcement-bar .ab-text {
                color: rgba(255,255,255,0.93);
                font-size: 13.5px;
                font-weight: 500;
                letter-spacing: 0.2px;
                white-space: nowrap;
            }

            #announcement-bar .ab-text b {
                color: #ffffff;
                font-weight: 700;
            }

            #announcement-bar .ab-sep {
                width: 1px; height: 18px;
                background: rgba(255,255,255,0.2);
                flex-shrink: 0;
            }

            #announcement-bar .ab-star {
                color: rgba(240,201,64,0.65);
                font-size: 11px;
                animation: sadk-star 2.4s ease-in-out infinite;
                flex-shrink: 0;
                user-select: none;
            }

            #announcement-bar .ab-star.ab-star-2 {
                animation-delay: 1.2s;
            }

            #announcement-bar .ab-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: linear-gradient(135deg, #b8922a 0%, #f0c940 50%, #b8922a 100%);
                background-size: 200% 200%;
                color: #0f172a !important;
                font-size: 12.5px;
                font-weight: 800;
                letter-spacing: 0.4px;
                text-decoration: none !important;
                padding: 5px 15px;
                border-radius: 20px;
                white-space: nowrap;
                flex-shrink: 0;
                animation: sadk-gradient 3s ease infinite, sadk-pulse 2s ease-in-out infinite;
                transition: transform 0.2s ease, filter 0.2s ease;
            }

            #announcement-bar .ab-btn:hover {
                transform: scale(1.07);
                filter: brightness(1.1);
                color: #0f172a !important;
                text-decoration: none !important;
            }

            #announcement-bar .ab-arrow {
                font-size: 13px;
                animation: sadk-arrow 1.1s ease-in-out infinite;
                display: inline-block;
            }

            @media (max-width: 640px) {
                #announcement-bar .ab-badge,
                #announcement-bar .ab-star,
                #announcement-bar .ab-sep  { display: none; }
                #announcement-bar .ab-text { font-size: 12px; }
                #announcement-bar .ab-inner { gap: 10px; }
            }
        `;
        document.head.appendChild(style);

        const bar = document.createElement('div');
        bar.id = 'announcement-bar';
        bar.innerHTML = `
            <div class="ab-inner">
                <span class="ab-star">✦</span>
                <div class="ab-badge">
                    <span class="ab-dot"></span>
                    New Season
                </div>
                <span class="ab-text">
                    <b>STEM Asyut Deutsch Klub</b> — 2026–2027 Leadership Applications are open
                </span>
                <div class="ab-sep"></div>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScKWNI-QnYfjhmyy4V8K4SPtd7e2kjU_ZHF9ZROXM-cbNtsXw/viewform?usp=dialog"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="ab-btn">
                   Apply Now! <span class="ab-arrow">→</span>
                </a>
                <span class="ab-star ab-star-2">✦</span>
            </div>
        `;

        document.body.prepend(bar);
        document.body.style.paddingTop = '48px';
    }
}

document.addEventListener('DOMContentLoaded', addAnnouncementBar);
// ============================================
// Shared layout: navbar + footer injection
// ============================================

import "./appwrite.js";
import { injectAuthNav } from "./auth-nav.js";
import "./main.js";

function buildNavbarHTML() {
    return `
        <div class="nav-container">
            <div class="nav-logo">
                <img src="/Logo.png" alt="Deutsch Klub Logo" class="logo-img">
                <span class="logo-text">STEM Asyut Deutsch Klub</span>
            </div>
            <ul class="nav-menu" id="navMenu">
                <li class="nav-item">
                    <a href="/index.html" class="nav-link" data-nav="home">Home</a>
                </li>
                <li class="nav-item">
                    <a href="/pages/about.html" class="nav-link" data-nav="about">About Us</a>
                </li>
                <li class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle" data-nav="learn">Learn German ▼</a>
                    <ul class="dropdown-menu">
                        <li class="dropdown-item"><a class="dropdown-toggle-sub" href="/pages/Materials.html" data-nav="materials">Materials</a></li>
                        <li class="dropdown-item">
                            <a href="#" class="dropdown-toggle-sub">G10 ▼</a>
                            <ul class="dropdown-submenu">
                                <li class="dropdown-item">
                                    <a href="/pages/curriculum/g10/semester1/lektionen.html" class="dropdown-toggle-sub" data-nav="g10s1">Semester 1</a>
                                </li>
                                <li class="dropdown-item">
                                    <a href="/pages/curriculum/g10/semester2/lektionen.html" class="dropdown-toggle-sub" data-nav="g10s2">Semester 2</a>
                                </li>
                            </ul>
                        </li>
                        <li class="dropdown-item">
                            <a href="#" class="dropdown-toggle-sub">G11 ▼</a>
                            <ul class="dropdown-submenu">
                                <li class="dropdown-item">
                                    <a href="/pages/curriculum/g11/semester1/lektionen.html" class="dropdown-toggle-sub" data-nav="g11s1">Semester 1</a>
                                </li>
                                <li class="dropdown-item">
                                    <a href="/pages/curriculum/g11/semester2/lektionen.html" class="dropdown-toggle-sub" data-nav="g11s2">Semester 2</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a href="/pages/resources.html" class="nav-link" data-nav="resources">Resources</a>
                </li>
                <li class="nav-item">
                    <a href="/pages/test-banks.html" class="nav-link" data-nav="quizzes">Quizzes</a>
                </li>
                <li class="nav-item">
                    <a href="/pages/challenge.html" class="nav-link" data-nav="challenge">Challenge 🔥</a>
                </li>
                <li class="nav-item">
                    <a href="/pages/contact.html" class="nav-link" data-nav="contact">Contact Us</a>
                </li>
            </ul>
            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>`;
}

function buildFooterHTML() {
    return `
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Deutsch Klub</h3>
                <p>Empowering students to excel in German language learning</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="/index.html">Home</a></li>
                    <li><a href="/pages/about.html">About Team</a></li>
                    <li><a href="/pages/resources.html">Resources</a></li>
                    <li><a href="/pages/test-banks.html">Quizzes</a></li>
                    <li><a href="/pages/contact.html">Contact Us</a></li>
                    <li>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLScHW62ctySetNvA77ugYEDBZ3rTEvPl_3uHlcNOVpsYtgZROw/viewform?usp=header"
                           target="_blank"
                           rel="noopener noreferrer">
                            Apply Now! — Members Form
                        </a>
                    </li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Contact</h4>
                <p class="contact-number">+201024012428</p>
                <div class="social-icons">
                    <a href="https://www.facebook.com/profile.php?id=61564110370482" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="mailto:stemasyutdeutschklub@gmail.com" target="_blank">
                        <i class="fas fa-envelope"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/stem-asyut-deutsch-klub/" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://whatsapp.com/channel/0029VbBIB41ISTkC7JuaUb1q" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 SADK - STEM Asyut Deutsch Klub. All rights reserved.</p>
        </div>
    </div>`;
}

function setActiveNavLinks() {
    const pathname = window.location.pathname.replace(/\\/g, "/").toLowerCase();

    document.querySelectorAll(".nav-link, .dropdown-toggle-sub").forEach((link) => {
        link.classList.remove("active");
    });

    const file = pathname.split("/").pop() || "index.html";
    const isHome =
        file === "index.html" ||
        file === "" ||
        pathname.endsWith("/") ||
        !pathname.includes("/pages/");

    document.querySelectorAll(".nav-menu a[href]").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        let resolvedPath;
        try {
            resolvedPath = new URL(href, window.location.href).pathname.toLowerCase();
        } catch {
            return;
        }

        const linkFile = resolvedPath.split("/").pop();

        if (link.hasAttribute("data-nav") && link.getAttribute("data-nav") === "home" && isHome) {
            link.classList.add("active");
            return;
        }

        if (linkFile && file === linkFile) {
            link.classList.add("active");
        }

        if (pathname === resolvedPath || pathname.endsWith(resolvedPath)) {
            link.classList.add("active");
        }
    });

    if (
        pathname.includes("materials.html") ||
        pathname.includes("lektionen.html")
    ) {
        const learnToggle = document.querySelector(".dropdown-toggle[data-nav='learn']");
        if (learnToggle) learnToggle.classList.add("active");
    }

    if (pathname.includes("challenge.html")) {
        const challengeLink = document.querySelector(".nav-link[data-nav='challenge']");
        if (challengeLink) challengeLink.classList.add("active");
    }
}

function initHamburger() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    navMenu.querySelectorAll("a[href]").forEach((link) => {
        if (link.getAttribute("href") === "#") return;

        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });

    navMenu.querySelectorAll(".dropdown-toggle, .dropdown-toggle-sub").forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
            if (window.innerWidth > 1024) return;
            if (toggle.getAttribute("href") === "#") {
                e.preventDefault();
            }

            const parent = toggle.closest(".dropdown, .dropdown-item");
            const submenu = parent?.querySelector(
                ":scope > .dropdown-menu, :scope > .dropdown-submenu"
            );
            if (submenu) submenu.classList.toggle("open");
        });
    });

    document.addEventListener("click", (event) => {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });
}

export async function injectLayout() {
    const navbar = document.querySelector(".navbar");
    const footer = document.querySelector(".footer");

    if (navbar) {
        navbar.innerHTML = buildNavbarHTML();
    }

    if (footer) {
        footer.innerHTML = buildFooterHTML();
    }

    await injectAuthNav();
    setActiveNavLinks();
    initHamburger();
    initSmoothScroll();
}

document.addEventListener("DOMContentLoaded", () => {
    injectLayout();
});
