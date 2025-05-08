// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Menu Trigger Script');
    
    // Get all required elements
    const menuTrigger = document.getElementById('menu-trigger');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    // Create and add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'mobile-menu-close';
    closeButton.setAttribute('aria-label', 'Close menu');
    mobileMenuOverlay.appendChild(closeButton);
    
    // Function to close the menu
    function closeMenu() {
        hamburgerIcon.classList.remove('open');
        mobileMenuOverlay.classList.remove('active');
        body.classList.remove('no-scroll');
    }
    
    // Debug log all elements
    console.log('Menu Elements:', {
        menuTrigger: menuTrigger,
        hamburgerIcon: hamburgerIcon,
        mobileMenuOverlay: mobileMenuOverlay,
        closeButton: closeButton
    });
    
    // Add click handler to menu trigger
    if (menuTrigger) {
        console.log('Adding click listener to menu trigger');
        menuTrigger.onclick = function(e) {
            console.log('Menu trigger clicked');
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle classes
            hamburgerIcon.classList.toggle('open');
            mobileMenuOverlay.classList.toggle('active');
            body.classList.toggle('no-scroll');
            
            // Debug log the state after toggle
            console.log('Menu state after click:', {
                hamburgerOpen: hamburgerIcon.classList.contains('open'),
                overlayActive: mobileMenuOverlay.classList.contains('active'),
                bodyNoScroll: body.classList.contains('no-scroll')
            });
        };
    } else {
        console.error('Menu trigger element not found!');
    }
    
    // Add click handler to close button
    closeButton.addEventListener('click', function(e) {
        console.log('Close button clicked');
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
    });
    
    // Close menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    console.log('Found mobile menu links:', mobileMenuLinks.length);
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Menu link clicked');
            closeMenu();
        });
    });
    
    // Close menu when clicking outside
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                console.log('Clicked outside menu');
                closeMenu();
            }
        });
    }
});