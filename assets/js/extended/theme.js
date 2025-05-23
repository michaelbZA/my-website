// Theme toggle functionality
document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("theme-toggle");
    const moon = document.getElementById("moon");
    const sun = document.getElementById("sun");

    function setTheme(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark");
            moon.style.display = "none";
            sun.style.display = "block";
        } else {
            document.body.classList.remove("dark");
            moon.style.display = "block";
            sun.style.display = "none";
        }
        localStorage.setItem("pref-theme", theme);
    }

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("pref-theme");
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
    }

    // Add click handler to theme toggle button
    themeToggle.addEventListener("click", function() {
        const currentTheme = document.body.classList.contains("dark") ? "light" : "dark";
        setTheme(currentTheme);
    });
});
