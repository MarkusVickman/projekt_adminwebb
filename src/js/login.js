//JS-fil med funktion för att samla in inloggnings/registreringsdata från formulär och skicka vidare till rätt api

let alertMessage = document.getElementById("alert1");
let alertMessage2 = document.getElementById("alert2");
let form1 = document.getElementById("form1");
let form2 = document.getElementById("form2");

//Funktion för att logga in på sidan och spara en JWT-token i sessionstorage för authentizering
function apiLogin(login) {
    fetch('https://project-dt207g.azurewebsites.net/account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Fel lösenord eller användarnamn");
            }
            return response.json();
        })
        .then(data => {
          //  if (data.verified === true){
                sessionStorage.setItem('token', data.token);
                window.location.href = "admin.html";
            //} else {
              //  alertMessage.innerHTML = data.message;
            //}

        })
        .catch(error => {
            alertMessage.innerHTML = 'Fel vid inloggning: ' + error.message;
        });
};

//Funktion för att registrera en användare i databasen som sedan går att logga in till.
function apiRegister(login) {
    fetch('https://project-dt207g.azurewebsites.net/account/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Testa ett annat användarnamn.');
            }
            return response.json();
        })
        .then(data => {
            alertMessage2.innerHTML = "Användare registrerad. Innan du får tillgång till webbplatsen måste din inloggning godkännas av din närmaste chef.";
        })
        .catch(error => {
            alertMessage2.innerHTML = ('Fel vid Registrering:', error.message);
        });
};

document.addEventListener("DOMContentLoaded", (event) => {
    // Lägg till händelselyssnare på formuläret
    form1.addEventListener("submit", (e) => {
        e.preventDefault();
        // Hämta användarnamn i lowerCase och lösenord från formuläret
        let userName = document.getElementById("user_name").value.toLowerCase();
        let password = document.getElementById("password").value;

            //Letar fel i formuläret med errorCheck funktionen. Utan fel så skapas ett object som skickas till funktionen för POST-anrop
            if (errorCheck(userName, password, "login")) {
                alertMessage.innerHTML = "";
                const login = { username: userName, password: password };
                apiLogin(login);
                //Resettar formuläret om det är korrekt ifyllt
                document.getElementById("user_name").value = "";
                document.getElementById("password").value = "";
            }
        });

    form2.addEventListener("submit", (e) => {
        e.preventDefault();
        // Hämta användarnamn i lowerCase och lösenord från formuläret
        let userName2 = document.getElementById("user_name2").value.toLowerCase();
        let password2 = document.getElementById("password2").value;

            //Letar fel i formuläret med errorCheck funktionen. Utan fel så skapas ett object som skickas till funktionen för POST-anrop
            if (errorCheck(userName2, password2, "register")) {
                alertMessage2.innerHTML = "";
                const login = { username: userName2, password: password2 };
                apiRegister(login);
                //Resettar formuläret om det är korrekt ifyllt
                document.getElementById("user_name2").value = "";
                document.getElementById("password2").value = "";
        }
    })
});

//Checkar efter fel i formuläret och skriver ut felmeddelande i så fall annars returnerar true
function errorCheck(userName, password, check) {
    let inputErrors = [];
    //Flera if satser för att välja vilka felmeddelanden som ska tar med
    if (userName === "") {
        inputErrors.push("användarnamn");
    }
    if (password.length < 6) {
        inputErrors.push(" lösenordet måste vara minst 6 tecken långt ");
    }

    //Om fel inte finns skapas en nytt inlägg i databasen och startsidan laddas
    if (inputErrors.length === 0) {
        return true;
    }
    //Om fel finns skrivs alla dessa ut på sidan
    else if (check === "login"){
        alertMessage.innerHTML = "Fyll i " + inputErrors;
        return false;
    }
    else if (check === "register"){
        alertMessage2.innerHTML = "Fyll i " + inputErrors;
        return false;
    }
}
