// ===== Materials Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Animate cards on scroll
    const cards = document.querySelectorAll('.grade-card, .extras-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Add click tracking for semester links (optional)
    const semesterLinks = document.querySelectorAll('.semester-card');
    semesterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Navigating to:', this.getAttribute('href'));
            // You can add analytics or tracking here if needed
        });
    });
});