document.addEventListener("DOMContentLoaded", function () {

    if (!localStorage.getItem("cookieConsent")) {

        const banner = document.createElement("div");

        banner.innerHTML = `
            <p>
                Utilizamos cookies necessários para o funcionamento do site
                e, futuramente, cookies de publicidade.
                <a href="/portal-significados/cookies/">Saiba mais</a>
            </p>

            <div>
                <button id="acceptCookies">Aceitar</button>
                <button id="rejectCookies">Recusar</button>
            </div>
        `;

        banner.id = "cookie-banner";

        document.body.appendChild(banner);

        document
            .getElementById("acceptCookies")
            .addEventListener("click", function () {
                localStorage.setItem("cookieConsent", "accepted");
                banner.remove();
            });

        document
            .getElementById("rejectCookies")
            .addEventListener("click", function () {
                localStorage.setItem("cookieConsent", "rejected");
                banner.remove();
            });
    }

});
