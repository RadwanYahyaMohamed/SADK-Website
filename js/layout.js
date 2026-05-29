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
