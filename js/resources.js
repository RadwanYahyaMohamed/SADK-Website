// ===== Resources Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Add smooth hover animations for resource links
    const resourceLinks = document.querySelectorAll('.resource-link');
    
    resourceLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Optional: Add any hover effects here
        });
    });
    
    // Add animation for PDF container on load
    const pdfContainer = document.querySelector('.pdf-container');
    if (pdfContainer) {
        pdfContainer.style.opacity = '0';
        pdfContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            pdfContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            pdfContainer.style.opacity = '1';
            pdfContainer.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Add scroll animation for category cards
    const cards = document.querySelectorAll('.category-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 50);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
});