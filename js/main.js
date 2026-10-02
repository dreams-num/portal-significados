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

    document.addEventListener('DOMContentLoaded', () => {
    const tocContainer = document.querySelector('#toc ul') || document.querySelector('#toc');
    const headings = document.querySelectorAll('.post-content h2');

    if (tocContainer && headings.length > 0) {
        const list = document.createElement('ul');
        
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `secao-${index + 1}`;
            }
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            
            li.appendChild(a);
            list.appendChild(li);
        });

        tocContainer.appendChild(list);
    }
});

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

// Lógica da Calculadora de Destino
var calcBtn = document.getElementById('calcBtn');
if (calcBtn) {
    calcBtn.addEventListener('click', function() {
        var val = document.getElementById('userInput').value;
        var resultDiv = document.getElementById('result');
        if (val.trim() === "") {
            resultDiv.textContent = "Por favor, insira um valor válido.";
            return;
        }
        resultDiv.textContent = "Resultado calculado para: " + val;
    });
}
