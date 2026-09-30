document.addEventListener("DOMContentLoaded", function () {

    if (!localStorage.getItem("cookieConsent")) {

        const banner = document.createElement("div");

        banner.innerHTML = `
            <p>
                Utilizamos cookies para melhorar sua experiência no site.
                <a href="/portal-significados/cookies/">Saiba mais</a>
            </p>
            <button id="acceptCookies">Aceitar</button>
        `;

        banner.id = "cookie-banner";

        document.body.appendChild(banner);

        document
            .getElementById("acceptCookies")
            .addEventListener("click", function () {
                localStorage.setItem("cookieConsent", "accepted");
                banner.remove();
            });
    }

});
