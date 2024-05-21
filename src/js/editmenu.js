
//Läser in variabel med ett element där meddelanden ska visas
const alert = document.getElementById("alert");
const alert2 = document.getElementById("alert2");

//Get fetch-anrop för att hämta array med cv.
export async function menuGet() {
    try {
        const response = await fetch('https://project-dt207g.azurewebsites.net/menu', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        })
        const result = await response.json();
        //returnerar json-data till funktionen writeCvToHtml()
        alert.innerHTML = "";
        return result;
    } catch (error) {
        alert.innerHTML = "Inläggen kunde inte laddas in.";
        console.error(error);
    }
}

//Post fetch-anrop som tar in ett objekt som parameter
/*export async function menuPost(cv) {
      let response = await fetch('https://project-dt207g.azurewebsites.net/protected/menu/add', {
            method: 'POST',
            headers: {
                  'authorization': 'Bearer ' + sessionStorage.getItem("token"),
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify(cv)
      });
      let data = await response.json();
      //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat
      alert2.innerHTML = "Ditt inlägg är nu lagrat i databasen.";
      writeCvToHtml();
}*/

//Put fetch-anrop som tar in ett objekt som parameter
/*export async function menuPut(cv) {
    let response = await fetch('https://project-dt207g.azurewebsites.net/protected/menu/edit', {
          method: 'POST',
          headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("token"),
                'Content-Type': 'application/json'
          },
          body: JSON.stringify(cv)
    });
    let data = await response.json();
    //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat
    alert2.innerHTML = "Ditt inlägg är nu lagrat i databasen.";
    writeCvToHtml();
}*/





//variabler för meddelanden och eventlistener 
const menuDiv = document.getElementById("menu-div");

document.addEventListener("DOMContentLoaded", (e) => {
    //Eventlistener som lyssnar efter klick på ta bort knapparna för cv, initierar funktionen removeCV och skickar med id/index som argument
    menuDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            let id = e.target.id;
            removeMenu(id);
        }
    });
});

//Funktionen skickar med id/index till delete fetch-funktionen och väntar på svar. När svar nås skrivs ett meddelande ut på skärmen
async function removeMenu(id) {
    let data = await menuDelete(id);
    menu();
    alert2.innerHTML = `Ett CV-inlägg är borttaget från databasen.`;
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
      //Väntar på data och först när den finns görs en retur till funktionen removeCV(id) där den väntar på svar
      let data = await response.json();
      return data;
}




//fil för att skriva ut från servern/databasen till webplatsens
//div där cv-data ska skrivas ut
const starterArticle = document.getElementById("starter");
const mainArticle = document.getElementById("main-menu");
const dessertArticle = document.getElementById("dessert");


//När sidan laddas 
window.onload = menu();

//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen
export async function menu() {
    // Anropa funktionen för att hämta data och väntar på svar
    let menuArray = await menuGet();

    //Rensar html
    starterArticle.innerHTML = "";
    mainArticle.innerHTML = "";
    dessertArticle.innerHTML = "";

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

    console.log(menuArray);

    //Om arrayen inte är tom byggs innehållet upp utifrån arrayen som loopas igenom. 
    if (menuArray.length > 0) {

        for (let i = 0; i < menuArray.length; i++) {
            let newDiv = document.createElement("div");
            newDiv.classList.add(`menu-row`);

            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(menuArray[i].foodName + ", ");
            p1.style.textdecoration = "underlined";
            p1.appendChild(p1Text);
            p1.contentEditable = true;

            let p = document.createElement("p");
            let pText = document.createTextNode(menuArray[i].price + " kr");
            p.appendChild(pText);
            p.contentEditable = true;

            let p2 = document.createElement("p");
            let p2Text = document.createTextNode(menuArray[i].description + ", ");
            p2.appendChild(p2Text);
            p2.contentEditable = true;

            let p3 = document.createElement("p");
            let p3Text = document.createTextNode("Senast ändrad " + menuArray[i].created.slice(0, 10) + " av " + menuArray[i].username);
            p3.appendChild(p3Text);
            p3.contentEditable = true;

            let button = document.createElement("button");
            let buttonText = document.createTextNode("Ta bort");
            button.appendChild(buttonText);
            button.id = menuArray[i]._id;
            button.classList.add("remove-item");

            newDiv.appendChild(p1);
            newDiv.appendChild(p);
            newDiv.appendChild(p2);
            newDiv.appendChild(p3);
            newDiv.appendChild(button);

            if (menuArray[i].menyType === "starter") {
                starterArticle.appendChild(newDiv);
            }
            else if (menuArray[i].menyType == "main") {
                mainArticle.appendChild(newDiv);
            }
            else if (menuArray[i].menyType == "dessert") {
                dessertArticle.appendChild(newDiv);
            }
            //mainArticle.appendChild(newDiv);
        }
    }
};
