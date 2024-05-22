//Fil för att ta in formulärdata, checka efter fel och skicka med ett argument till api-post funktionen

//Deklarerar variabler för formulär och där meddelande ska skrivar ut
const form = document.getElementById("form");
const addAlert1 = document.getElementById("addAlert1");
const addAlert2 = document.getElementById("addAlert2");



document.addEventListener("DOMContentLoaded", (event) => {
    // Lägg till händelselyssnare på formuläret
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // Hämta CV-data från formuläret
        let menyType = document.getElementById("menyType").value;
        let foodName = document.getElementById("foodName").value;
        let description = document.getElementById("description").value;
        let price = document.getElementById("price").value;

        //Letar fel i formuläret med errorCheck funktionen. Utan fel så skapas ett object som skickas till funktionen för POST-anrop
        if (errorCheck(menyType, foodName, description, price)) {
            addAlert1.innerHTML = "";
            const menu = { menyType: menyType, foodName: foodName, description: description, price: price };
            menuPost(menu);
            //Resetar formuläret om det är korrekt ifyllt
            document.getElementById("menyType").value = "";
            document.getElementById("foodName").value = "";
            document.getElementById("description").value = "";
            document.getElementById("price").value = "";
        }
    });
});

//Checkar efter fel i formuläret och skriver ut felmeddelande i så fall annars returnerar true
function errorCheck(menyType, foodName, description, price) {
    let inputErrors = [];
    //Flera if satser för att välja vilka felmeddelanden som ska tar med
    if (menyType === "") {
        inputErrors.push("Typ av rätt ");
    }
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
        addAlert1.innerHTML = "Fyll i " + inputErrors;
        addAlert2.innerHTML = "";
        return false;
    }
}


import { menu } from './get_menu';

//Post fetch-anrop som tar in ett objekt som parameter
export async function menuPost(menu) {
      let response = await fetch('https://project-dt207g.azurewebsites.net/protected/menu/add', {
            method: 'POST',
            headers: {
                  'authorization': 'Bearer ' + sessionStorage.getItem("token"),
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify(menu)
      });
      let data = await response.json();
      //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat
      alert2.innerHTML = "Menyraden är sparad.";

      callMenu();
}

function callMenu(){
    menu();
};