document.addEventListener('DOMContentLoaded', function() {
    const menuTrigger = document.getElementById('menu-trigger');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    if (menuTrigger) {
        menuTrigger.addEventListener('click', function() {
            hamburgerIcon.classList.toggle('open');
            mobileMenuOverlay.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
    }
    
    // Close menu when clicking on a link or outside the menu
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburgerIcon.classList.remove('open');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });
    
    // Close menu when clicking outside
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            hamburgerIcon.classList.remove('open');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
});