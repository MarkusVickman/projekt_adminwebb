/*Fil till admin.html för att hämta och hantera menyn.*/

//En notisvariabel till snackbaren
const snackBarEl = document.getElementById("snackbar");

//En notis variabel som visar meddelande i botten av skärmen vid initiering av funktionen
function snackBar() {
  
    // Lägger till klassen "show" till DIV
    snackBarEl.className = "show";
  
    // Efter 5 sekunder, tar bort klassen "show" från Diven
    setTimeout(function(){ snackBarEl.className = snackBarEl.className.replace("show", ""), snackBarEl.innerHTML = "" }, 4000);
  } 



//Get fetch-anrop för att hämta menyarrayen. Verifierar användare med jwt-token från sessionstorage.
export async function menuGet() {
    try {
        const response = await fetch('https://project-dt207g.azurewebsites.net/menu', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        })
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}


//När sidan laddas 
window.onload = menu();

//Funktionen skriver ut menyn till skärmen.
export async function menu() {
    // Anropa funktionen för att hämta data och väntar på svar
    let menuArray = await menuGet();

    //div där meny-data ska skrivas ut
    const starterArticle = document.getElementById("starter");
    const mainArticle = document.getElementById("main-menu");
    const dessertArticle = document.getElementById("dessert");

    //Rensar html
    starterArticle.innerHTML = "";
    mainArticle.innerHTML = "";
    dessertArticle.innerHTML = "";

    //Kategorier för de olika rättyperna
    let hStarter = document.createElement("h3");
    let hStarterText = document.createTextNode("Förrätter");
    hStarter.appendChild(hStarterText);
    starterArticle.appendChild(hStarter);

    let hMain = document.createElement("h3");
    let hMainText = document.createTextNode("Huvudrätt");
    hMain.appendChild(hMainText);
    mainArticle.appendChild(hMain);

    let hDessert = document.createElement("h3");
    let hDessertText = document.createTextNode("Efterrätt");
    hDessert.appendChild(hDessertText);
    dessertArticle.appendChild(hDessert);

    //Om arrayen inte är tom byggs innehållet upp utifrån arrayen som loopas igenom. 
    if (menuArray.length > 0) {

        for (let i = 0; i < menuArray.length; i++) {
            let newDiv = document.createElement("div");
            newDiv.classList.add(`menu-row`);

            let div1 = document.createElement("div");
            let div2 = document.createElement("div");

            //De fälls som ska gå att ändra får contentEditible = true och ett unikt id
            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(menuArray[i].foodName);
            p1.style.textDecoration = "underline";
            p1.appendChild(p1Text);
            p1.contentEditable = true;
            p1.id = "foodName" + menuArray[i]._id;
            p1.classList.add("column", "column-edit");

            //De fälls som ska gå att ändra får contentEditible = true och ett unikt id
            let p = document.createElement("p");
            let pText = document.createTextNode(menuArray[i].price);
            p.appendChild(pText);
            p.contentEditable = true;
            p.id = "price" + menuArray[i]._id;
            p.classList.add("price", "column-edit");

            let kr = document.createElement("p");
            let krText = document.createTextNode(" kr");
            kr.appendChild(krText);
            kr.classList.add("kr");

            //De fälls som ska gå att ändra får contentEditible = true och ett unikt id
            let p2 = document.createElement("p");
            let p2Text = document.createTextNode(menuArray[i].description);
            p2.appendChild(p2Text);
            p2.contentEditable = true;
            p2.id = "description" + menuArray[i]._id;
            p2.classList.add("column-edit");

            let p3 = document.createElement("p");
            let p3Text = document.createTextNode("Senast ändrad " + menuArray[i].created.slice(0, 10) + " av " + menuArray[i].username);
            p3.appendChild(p3Text);
            p3.classList.add("column");
            
            //Knappar läggs till för att kunna uppdatera data och ta bort data. Unika id
            let buttonEdit = document.createElement("button");
            let buttonEditText = document.createTextNode("Uppdatera");
            buttonEdit.appendChild(buttonEditText);
            buttonEdit.id = ("update" + menuArray[i]._id);
            buttonEdit.classList.add("update-item");

            //Knappar läggs till för att kunna uppdatera data och ta bort data. Unika id
            let button = document.createElement("button");
            let buttonText = document.createTextNode("Ta bort");
            button.appendChild(buttonText);
            button.id = menuArray[i]._id;
            button.classList.add("remove-item");

            div1.appendChild(p1);
            div1.appendChild(p);
            div1.appendChild(kr);

            div2.appendChild(p3);
            div2.appendChild(buttonEdit);
            div2.appendChild(button);

            newDiv.appendChild(div1);
            newDiv.appendChild(p2)
            newDiv.appendChild(div2);

            //Beroende på menytyp läggs data till i olika element
            if (menuArray[i].menyType === "starter") {
                starterArticle.appendChild(newDiv);
            }
            else if (menuArray[i].menyType == "main") {
                mainArticle.appendChild(newDiv);
            }
            else if (menuArray[i].menyType == "dessert") {
                dessertArticle.appendChild(newDiv);
            }
        }
    }
};









//Kod för att ändra i menyn
document.addEventListener("DOMContentLoaded", (event) => {
    const menuDiv = document.getElementById("menu-div");
    // om target.id startar på update så uppdateras data från contentEditible fälten.
    menuDiv.addEventListener("click", (e) => {
       if (e.target.id.slice(0, 6) === "update"){

            // Hämta CV-data från formuläret
            const indexId = e.target.id.substring(6);
            const foodName = document.getElementById("foodName" + indexId);
            const description = document.getElementById("description" + indexId);
            const priceEl = document.getElementById("price" + indexId);
            const date = new Date();

            //Letar fel i formuläret med errorCheck funktionen. Utan fel så skapas ett object som skickas till funktionen för PUT-anrop
            if (errorCheck(foodName.textContent, description.textContent, priceEl)) {
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

    //Om fel inte finns returneras true vilket i sin tur ändrar ett inlägg i databasen
    if (inputErrors.length === 0) {
        return true;
    }
    //Om fel finns skrivs alla dessa ut på sidan
    else {
        alert.innerHTML = ("Fyll i " + inputErrors);
        return false;
    }
}


//Put fetch-anrop som tar in ett objekt som parameter, verifierar med jwt-token
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
    //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat och menyn laddas om
    snackBarEl.innerHTML = `Menyraden är uppdaterad.`;
    snackBar();
    callMenu();
}







//kod för att ta bort från menyn
//variabler för meddelanden och eventlistener 
const menuDiv = document.getElementById("menu-div");

document.addEventListener("DOMContentLoaded", (e) => {
    //Eventlistener som lyssnar efter klick på ta bort knapparna, initierar funktionen removeMenu och skickar med id/index som argument
    menuDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            let id = e.target.id;
            removeMenu(id);
        }
    });
});

//Funktionen skickar med id/index till delete fetch-funktionen och väntar på svar. När svar nås skrivs ett meddelande ut på skärmen och menyn laddas om
async function removeMenu(id) {
    let data = await menuDelete(id);
    menu();
    snackBarEl.innerHTML = `Menyraden är borttagen.`;
    snackBar();
}

//Delete fetch-anrop som tar in ett id/index som skickas med till servern för att tas bort från databasen 
async function menuDelete(id) {
    let response = await fetch(`https://project-dt207g.azurewebsites.net/protected/menu/delete/${id}`, {
          method: 'DELETE',
          headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("token"),
                'Content-Type': 'application/json'
          },
          body: JSON.stringify()
    });
    //Väntar på data och först när den finns görs en retur till funktionen där den väntar på svar
    let data = await response.json();
    return data;
}










//Kod för att lägga till ny i menyn
//Deklarerar variabler för formulär och där meddelande ska skrivar ut
const form = document.getElementById("form");
const addAlert1 = document.getElementById("addAlert1");
const addAlert2 = document.getElementById("addAlert2");


document.addEventListener("DOMContentLoaded", (event) => {
    // Lägg till händelselyssnare på formuläret för att spara in nya menyinlägg
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // Hämta meny-data från formuläret
        let menyType = document.getElementById("menyType").value;
        let foodName = document.getElementById("foodName").value;
        let description = document.getElementById("description").value;
        let price = document.getElementById("price").value;

        //Letar fel i formuläret med errorCheck funktionen. Utan fel så skapas ett object som skickas till funktionen för POST-anrop
        if (errorCheckNewMenu(menyType, foodName, description, price)) {
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
function errorCheckNewMenu(menyType, foodName, description, price) {
    let inputErrors = [];
    //Flera if satser för att välja vilka felmeddelanden som ska tar med
    if (menyType === "") {
        inputErrors.push("Typ av rätt");
    }
    if (foodName === "") {
        inputErrors.push(" Maträtt");
    }
    if (description === "") {
        inputErrors.push(" beskrivning");
    }
    if (price === "") {
        inputErrors.push(" pris");
    }

    //Om fel inte finns returneras true vilket i sin tur ändrar ett inlägg i databasen
    if (inputErrors.length === 0) {
        return true;
    }
    //Om fel finns skrivs alla dessa ut på sidan
    else {
        addAlert1.innerHTML = "Fyll i " + inputErrors + ".";
        addAlert2.innerHTML = "";
        return false;
    }
}


//Post fetch-anrop som tar in ett objekt som parameter. Verifierar med jwt-token
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
      //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat och menyn laddas om
      snackBarEl.innerHTML = `Menyraden är sparad.`;
      snackBar();
      callMenu();
}

function callMenu(){
    menu();
};