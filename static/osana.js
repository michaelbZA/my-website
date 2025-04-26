// === Osana Cookie Banner Logic ===

// Wait for the page to load
document.addEventListener("DOMContentLoaded", function() {
    const banner = document.getElementById("osana-banner");
    const settingsModal = document.getElementById("osana-settings");
    const acceptAllBtn = document.getElementById("osana-accept-all");
    const acceptNecessaryBtn = document.getElementById("osana-accept-necessary");
    const settingsBtn = document.getElementById("osana-settings-button");
    const saveSettingsBtn = document.getElementById("osana-save-settings");
  
    // Check if consent already exists
    const consent = localStorage.getItem("cookieConsent");
  
    if (!consent) {
      banner.style.display = "flex";
    } else {
      if (consent === "all") {
        enableAnalytics();
      }
      // else if "necessary" - don't load analytics
    }
  
    // Accept All Cookies
    acceptAllBtn.addEventListener("click", function() {
      localStorage.setItem("cookieConsent", "all");
      enableAnalytics();
      banner.style.display = "none";
    });
  
    // Accept Necessary Cookies Only
    acceptNecessaryBtn.addEventListener("click", function() {
      localStorage.setItem("cookieConsent", "necessary");
      banner.style.display = "none";
    });
  
    // Open Settings Modal
    settingsBtn.addEventListener("click", function() {
      settingsModal.style.display = "block";
    });
  
    // Save Settings (assume only necessary cookies are saved)
    saveSettingsBtn.addEventListener("click", function() {
      localStorage.setItem("cookieConsent", "necessary");
      settingsModal.style.display = "none";
      banner.style.display = "none";
    });
  
    function enableAnalytics() {
      // Insert your Google Analytics tag dynamically
      const gaScript = document.createElement("script");
      gaScript.setAttribute("async", "");
      gaScript.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=YOUR_MEASUREMENT_ID");
      document.head.appendChild(gaScript);
  
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-XJJLP6S9JL', { anonymize_ip: true });
    }
  });  