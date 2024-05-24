//Fil för att ta in formulärdata, checka efter fel och skicka med ett argument till api-post funktionen

//Deklarerar variabler för formulär och där meddelande ska skrivar ut
//const form = document.getElementById("form");
//const addAlert1 = document.getElementById("addAlert1");
//const addAlert2 = document.getElementById("addAlert2");
const menuDiv = document.getElementById("menu-div");


document.addEventListener("DOMContentLoaded", (event) => {
    // Lägg till händelselyssnare på formuläret
    menuDiv.addEventListener("click", (e) => {
       if (e.target.id.slice(0, 6) === "update"){

            // Hämta CV-data från formuläret
            const indexId = e.target.id.substring(6);
            const foodName = document.getElementById("foodName" + indexId);
            const description = document.getElementById("description" + indexId);
            const priceEl = document.getElementById("price" + indexId);
            const date = new Date();

            //let price = priceEl.textContent.slice(0, -3);

            //Letar fel i formuläret med errorCheck funktionen. Utan fel så skapas ett object som skickas till funktionen för POST-anrop
            if (errorCheck(foodName.textContent, description.textContent, priceEl)) {
                //addAlert1.innerHTML = "";
                const menu = { indexId: indexId, foodName: foodName.textContent, description: description.textContent, price: priceEl.textContent, date: date  };
                menuPut(menu);
            }
        }
    });
});

//Checkar efter fel i formuläret och skriver ut felmeddelande i så fall annars returnerar true
function errorCheck(foodName, description, price) {
    let inputErrors = [];
    //Flera if satser för att välja vilka felmeddelanden som ska tar med
    if (foodName === "") {
        inputErrors.push("Maträtt ");
    }
    if (description === "") {
        inputErrors.push("beskrivning ");
    }
    if (price === "") {
        inputErrors.push("pris ");
    }

    //Om fel inte finns skapas en nytt inlägg i databasen och startsidan laddas
    if (inputErrors.length === 0) {
        return true;
    }
    //Om fel finns skrivs alla dessa ut på sidan
    else {
        alert("Fyll i " + inputErrors);
        //addAlert1.innerHTML = "Fyll i " + inputErrors;
        //addAlert2.innerHTML = "";
        return false;
    }
}


import { menu } from './get_menu';

//Post fetch-anrop som tar in ett objekt som parameter
export async function menuPut(menu) {
    let response = await fetch('https://project-dt207g.azurewebsites.net/protected/menu/edit', {
        method: 'PUT',
        headers: {
            'authorization': 'Bearer ' + sessionStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(menu)
    });
    let data = await response.json();
    //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat
    alert = "Menyraden är uppdaterad.";

    callMenu();
}

function callMenu() {
    menu();
};