// ===== Test Banks / Quizzes Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Toggle quiz details
    const quizCards = document.querySelectorAll('.quiz-card');
    
    quizCards.forEach(card => {
        const header = card.querySelector('.quiz-header');
        const toggleBtn = card.querySelector('.toggle-details');
        
        const toggleFunction = function() {
            card.classList.toggle('expanded');
        };
        
        if (header) {
            header.addEventListener('click', toggleFunction);
        }
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFunction();
            });
        }
    });
    
    // Animate stats numbers (optional)
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        if (text.includes('/')) {
            // Skip for now
        } else if (!isNaN(parseInt(text))) {
            const finalValue = parseInt(text);
            let currentValue = 0;
            const duration = 1000;
            const increment = finalValue / (duration / 16);
            
            const updateValue = () => {
                currentValue += increment;
                if (currentValue < finalValue) {
                    stat.textContent = Math.floor(currentValue);
                    requestAnimationFrame(updateValue);
                } else {
                    stat.textContent = finalValue;
                }
            };
            
            // Only animate when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateValue();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        }
    });
    
    // Add certificate links (update when you have the Drive links)
    // Example: 
    // const certLinks = [
    //     "https://drive.google.com/file/d/CERT_ID_1/preview",
    //     "https://drive.google.com/file/d/CERT_ID_2/preview",
    // ];
});