document.addEventListener('DOMContentLoaded', function() {
    console.log('Back to top script loaded'); // Debug log

    const button = document.getElementById('back-to-top');
    
    if (!button) {
        console.error('Back to top button not found!');
        return;
    }

    console.log('Button found:', button); // Debug log

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        // Show button when user has scrolled down 800px
        if (window.scrollY > 800) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    // Smooth scroll to top when clicked
    button.addEventListener('click', function() {
        console.log('Button clicked'); // Debug log
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 