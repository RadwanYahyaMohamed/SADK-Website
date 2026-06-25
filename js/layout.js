function addAnnouncementBar() {
    const expiryDate = new Date('2026-07-15T23:59:59+03:00');
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
                0%, 100% { box-shadow: 0 0 0 0 rgba(184,146,42,0.35); }
                50%       { box-shadow: 0 0 0 6px rgba(184,146,42,0);  }
            }
            @keyframes sadk-arrow {
                0%, 100% { transform: translateX(0); }
                50%       { transform: translateX(3px); }
            }

            #announcement-bar {
                position: fixed;
                top: 0; left: 0;
                width: 100%;
                z-index: 10000;
                min-height: 48px; /* تم تكبير حجمالشريط الإجمالي بأمان */
                display: flex;
                align-items: center;
                justify-content: center;
                border-bottom: 1px solid rgba(184,146,42,0.3);
                background: linear-gradient(120deg, #0f172a 0%, #1a2540 25%, #7a1a14 50%, #b8922a 75%, #0f172a 100%);
                background-size: 300% 300%;
                animation: sadk-gradient 10s ease infinite, sadk-slide-in 0.5s ease-out;
                padding: 8px 16px; /* زيادة المساحة الداخلية للشريط */
                box-sizing: border-box;
            }

            #announcement-bar .ab-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                max-width: 1200px;
                width: 100%;
                flex-wrap: nowrap;
            }

            #announcement-bar .ab-badge {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                background: rgba(184,146,42,0.15);
                border: 1px solid rgba(184,146,42,0.4);
                color: #f0c940;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                padding: 2px 8px;
                border-radius: 12px;
                white-space: nowrap;
            }

            #announcement-bar .ab-text {
                color: rgba(255,255,255,0.95);
                font-size: 15px; /* تم تكبير خط النص الأساسي للاب توب */
                font-weight: 500;
            }

            #announcement-bar .ab-text b {
                color: #ffffff;
                font-weight: 700;
            }

            #announcement-bar .ab-sep {
                width: 1px; height: 14px;
                background: rgba(255,255,255,0.2);
            }

            #announcement-bar .ab-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: linear-gradient(135deg, #b8922a 0%, #f0c940 100%);
                color: #0f172a !important;
                font-size: 13px; /* تم تكبير خط زر التقديم للاب توب */
                font-weight: 700;
                text-decoration: none !important;
                padding: 6px 16px; /* زيادة مساحة الزر الداخلية لراحة العين */
                border-radius: 12px;
                white-space: nowrap;
                animation: sadk-pulse 2s infinite;
                transition: transform 0.2s ease;
            }

            #announcement-bar .ab-btn:hover {
                transform: scale(1.04);
            }

            #announcement-bar .ab-arrow {
                animation: sadk-arrow 1.1s infinite;
                display: inline-block;
            }

            @media (max-width: 768px) {
                #announcement-bar {
                    padding: 8px 12px;
                }
                #announcement-bar .ab-inner {
                    flex-wrap: wrap;
                    gap: 6px;
                    justify-content: center;
                }
                #announcement-bar .ab-badge, 
                #announcement-bar .ab-sep { 
                    display: none; 
                }
                #announcement-bar .ab-text { 
                    font-size: 13px; /* حجم خط متناسق وآمن تماماً للموبايل لمنع أي تداخل */
                    text-align: center;
                    width: 100%;
                }
                #announcement-bar .ab-btn {
                    font-size: 12px;
                    padding: 5px 14px;
                }
            }
        `;
        document.head.appendChild(style);

        const bar = document.createElement('div');
        bar.id = 'announcement-bar';
        bar.innerHTML = `
            <div class="ab-inner">
                <div class="ab-badge">New Season</div>
                <span class="ab-text">
                    <b>STEM Asyut Deutsch Klub</b> — 2026–2027 Leadership Applications Are Open
                </span>
                <div class="ab-sep"></div>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScKWNI-QnYfjhmyy4V8K4SPtd7e2kjU_ZHF9ZROXM-cbNtsXw/viewform?usp=dialog"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="ab-btn">
                    Apply Now! <span class="ab-arrow">→</span>
                </a>
            </div>
        `;

        document.body.prepend(bar);
        
        // حساب الارتفاع تلقائياً لمنع أي تداخل للمقاسات
        //قائياً لمنع أي تداخل للمقاسات
        const updatePadding = () => {
    const barHeight = bar.offsetHeight;
    const navbar = document.querySelector('.navbar');
    
    let totalPadding = barHeight; 

    if (navbar) {
        navbar.style.top = barHeight + 'px';
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.zIndex = '9999';
        totalPadding += navbar.offsetHeight; 
    }

    document.body.style.paddingTop = totalPadding + 'px';

    // ====== الإضافة الجديدة ======
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.minHeight = `calc(100vh - ${totalPadding}px)`;
        hero.style.paddingTop = '0'; // إلغاء أي padding-top ثابت
    }
    // =============================
};
        updatePadding();
        window.addEventListener('resize', updatePadding);
    }
}

document.addEventListener('DOMContentLoaded', addAnnouncementBar);

import "./appwrite.js";
import { injectAuthNav } from "./auth-nav.js";
import "./main.js";

function buildNavbarHTML() {
    return `
        <div class="nav-container">
            <div class="nav-logo">
                <img src="/Logo.png" alt="Deutsch Klub Logo" class="logo-img">
                <span class="logo-text">SADK</span>
            </div>
            <ul class="nav-menu" id="navMenu">
                <li class="nav-item">
                    <a href="/index.html" class="nav-link" data-nav="home">Home</a>
                </li>
                <li class="nav-item">
                    <a href="/pages/about.html" class="nav-link" data-nav="about">About Us</a>
                </li>
                <li class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle" data-nav="learn">Learn German <i class="fas fa-chevron-down nav-chevron"></i></a>
                    <ul class="dropdown-menu">
                        <li class="dropdown-item"><a class="dropdown-toggle-sub" href="/pages/Materials.html" data-nav="materials">Materials</a></li>
                        <li class="dropdown-item dropdown-subparent">
                            <a href="#" class="dropdown-toggle-sub">G10 <i class="fas fa-chevron-right nav-chevron-sub"></i></a>
                            <ul class="dropdown-submenu">
                                <li class="dropdown-item">
                                    <a href="/pages/curriculum/g10/semester1/lektionen.html" class="dropdown-toggle-sub" data-nav="g10s1">Semester 1</a>
                                </li>
                                <li class="dropdown-item">
                                    <a href="/pages/curriculum/g10/semester2/lektionen.html" class="dropdown-toggle-sub" data-nav="g10s2">Semester 2</a>
                                </li>
                            </ul>
                        </li>
                        <li class="dropdown-item dropdown-subparent">
                            <a href="#" class="dropdown-toggle-sub">G11 <i class="fas fa-chevron-right nav-chevron-sub"></i></a>
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
        document.body.classList.toggle("nav-open");
    });

    navMenu.querySelectorAll("a[href]").forEach((link) => {
        if (link.getAttribute("href") === "#") return;

        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.classList.remove("nav-open");
        });
    });

    navMenu.querySelectorAll(".dropdown-toggle, .dropdown-toggle-sub").forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
            if (window.innerWidth > 1024) return;
            if (toggle.getAttribute("href") === "#" || toggle.classList.contains("dropdown-toggle") || toggle.nextElementSibling?.classList.contains("dropdown-submenu")) {
                e.preventDefault();
            }

            const submenu = toggle.nextElementSibling;
            if (submenu && (submenu.classList.contains("dropdown-menu") || submenu.classList.contains("dropdown-submenu"))) {
                submenu.classList.toggle("open");
                toggle.classList.toggle("submenu-expanded");
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.classList.remove("nav-open");
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
