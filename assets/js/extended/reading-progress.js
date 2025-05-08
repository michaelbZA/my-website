document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.querySelector('.reading-progress-bar');
    
    if (!progressBar) return; // Exit if no progress bar found
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}); 