// ============================================
// Deutsch Klub Website - Main JavaScript
// ============================================

import "./appwrite.js";
import { injectAuthNav } from "./auth-nav.js";

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    injectAuthNav();
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPage || 
            (currentPage === '' && linkPath === 'index.html') ||
            (currentPage === 'index.html' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Scroll Animation for Story Sections with Show/Hide
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.story-section');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const section = entry.target;
            const textContent = section.querySelector('.text-content');
            const visualContent = section.querySelector('.visual-content');
            
            if (entry.isIntersecting) {
                // Show when in view
                if (textContent) {
                    textContent.classList.add('visible');
                    textContent.classList.remove('hidden');
                }
                
                if (visualContent) {
                    setTimeout(() => {
                        visualContent.classList.add('visible');
                        visualContent.classList.remove('hidden');
                    }, 300);
                }
            } else {
                // Hide when out of view (scrolling up)
                const rect = section.getBoundingClientRect();
                
                // If section is above viewport (scrolled past it upward)
                if (rect.top < 0 && rect.bottom < window.innerHeight * 0.3) {
                    if (textContent) {
                        textContent.classList.add('hidden');
                        textContent.classList.remove('visible');
                    }
                    
                    if (visualContent) {
                        visualContent.classList.add('hidden');
                        visualContent.classList.remove('visible');
                    }
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Also add initial check for sections already in view
    window.addEventListener('load', function() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const textContent = section.querySelector('.text-content');
            const visualContent = section.querySelector('.visual-content');
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (textContent) {
                    textContent.classList.add('visible');
                }
                if (visualContent) {
                    setTimeout(() => {
                        visualContent.classList.add('visible');
                    }, 300);
                }
            }
        });
    });
});

// Timeline Animation
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove visible class when out of view (for scroll up effect)
                if (entry.boundingClientRect.top < 0) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});

// Team Sections Animation
document.addEventListener('DOMContentLoaded', function() {
    // Leadership Section
    const leadershipSection = document.querySelector('.leadership-section');
    const committeeCards = document.querySelectorAll('.committee-card');
    
    const teamObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // For a "no rewind" animation: once revealed, keep it revealed.
                // Unobserve committee cards so they never get re-processed.
                if (entry.target.classList.contains('committee-card')) {
                    teamObserver.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe leadership section
    if (leadershipSection) {
        teamObserver.observe(leadershipSection);
    }
    
    // Observe committee cards with staggered delay
    committeeCards.forEach((card, index) => {
        card.style.setProperty('--stagger-delay', `${index * 90}ms`);
        teamObserver.observe(card);
    });
});