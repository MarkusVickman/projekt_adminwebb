//Används för att verifiera att användaren är den som den utger sig för och att det är rätt token.

verifyToken();

//Om ingen token finns blir användaren inte insläppt på admin-sidan. om token finns verifieras den mot servern
async function verifyToken() {
    if (!sessionStorage.getItem("token")) {
        window.location.href = "login.html";
    }

    if (sessionStorage.getItem("token")) {
        await fetch('https://dt207g-moment4.azurewebsites.net/api/protected', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login to access this page.');
                }
                return response.json();
            })
            .catch(error => {
                window.location.href = "login.html";
            });
    }

};

//logga ut-knapp
let logout = document.getElementById("logout-btn");

//Eventlistener för logga ut-knapp. SessionStorage token tas bort vid utloggning
document.addEventListener("DOMContentLoaded", (e) => {

    logout.addEventListener("click", (e) => {
        window.location.href = "login.html";
        sessionStorage.removeItem("token");
    });
});
