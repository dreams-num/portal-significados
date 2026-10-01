document.addEventListener('DOMContentLoaded', function () {
    /* ==========================================================================
       1. Menu Mobile Toggle
       ========================================================================== */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
    }

    /* ==========================================================================
       2. Sistema de Consentimento de Cookies (LGPD / localStorage)
       ========================================================================== */
    var cookieBanner = document.getElementById('cookieConsentBanner');
    var acceptBtn = document.getElementById('acceptCookies');
    var rejectBtn = document.getElementById('rejectCookies');

    var consentKey = 'lgpd_consent';

    if (cookieBanner) {
        // Verifica se o usuário já escolheu anteriormente
        var savedConsent = localStorage.getItem(consentKey);

        if (!savedConsent) {
            cookieBanner.style.display = 'block';
        } else {
            cookieBanner.style.display = 'none';
        }

        // Evento Botão Aceitar
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function () {
                localStorage.setItem(consentKey, 'accepted');
                cookieBanner.style.display = 'none';
            });
        }

        // Evento Botão Recusar
        if (rejectBtn) {
            rejectBtn.addEventListener('click', function () {
                localStorage.setItem(consentKey, 'rejected');
                cookieBanner.style.display = 'none';
            });
        }
    }
});
