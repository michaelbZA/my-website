document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Add scrolled class for styling
                if (lastScrollY > 0) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide/show header based on scroll direction
                if (lastScrollY > 100) { // Only start hiding after 100px scroll
                    if (lastScrollY > window.previousScrollY) {
                        // Scrolling down
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        // Scrolling up
                        header.style.transform = 'translateY(0)';
                    }
                } else {
                    // At the top of the page
                    header.style.transform = 'translateY(0)';
                }

                window.previousScrollY = lastScrollY;
                ticking = false;
            });

            ticking = true;
        }
    });
}); 