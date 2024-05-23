const alert = document.getElementById("alert");

//Get fetch-anrop för att hämta array med cv.
export async function menu1Get() {
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
        alert.innerHTML = "Beklagar menyn kunde inte laddas.";
        console.error(error);
    }
}


//fil för att skriva ut från servern/databasen till webplatsens
//div där cv-data ska skrivas ut
const starterArticle = document.getElementById("starter");
const mainArticle = document.getElementById("main-menu");
const dessertArticle = document.getElementById("dessert");

const starterOrder = document.getElementById("order-starter");
const mainOrder = document.getElementById("order-main");
const dessertOrder = document.getElementById("order-dessert");


//När sidan laddas 
window.onload = menuLoad();

let menuArray = [];



//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen
export async function menuLoad() {
    // Anropa funktionen för att hämta data och väntar på svar
    menuArray = await menu1Get();
    menuExport();

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

    //Om arrayen inte är tom byggs innehållet upp utifrån arrayen som loopas igenom. 
    if (menuArray.length > 0) {

        for (let i = 0; i < menuArray.length; i++) {
            let newDiv = document.createElement("div");
            newDiv.classList.add(`menu-row`);

            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(menuArray[i].foodName + ", ");
            p1.style.textdecoration = "underlined";
            p1.appendChild(p1Text);
            p1.classList.add("column");

            let p = document.createElement("p");
            let pText = document.createTextNode(menuArray[i].price + " kr");
            p.appendChild(pText);
            p.classList.add("column");

            let p2 = document.createElement("p");
            let p2Text = document.createTextNode(menuArray[i].description + ", ");
            p2.appendChild(p2Text);
            p2.classList.add("description");

            newDiv.appendChild(p1);
            newDiv.appendChild(p);
            newDiv.appendChild(p2);

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
        orderMenu();
    }
};



//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen
export async function orderMenu() {
    //Rensar html
    starterOrder.innerHTML = "";
    mainOrder.innerHTML = "";
    dessertOrder.innerHTML = "";

    let hStarter = document.createElement("h3");
    let hStarterText = document.createTextNode("Förrätter");
    hStarter.appendChild(hStarterText);
    starterOrder.appendChild(hStarter);

    let hMain = document.createElement("h3");
    let hMainText = document.createTextNode("Huvudrätt");
    hMain.appendChild(hMainText);
    mainOrder.appendChild(hMain);

    let hDessert = document.createElement("h3");
    let hDessertText = document.createTextNode("Efterrätt");
    hDessert.appendChild(hDessertText);
    dessertOrder.appendChild(hDessert);

    //Om arrayen inte är tom byggs innehållet upp utifrån arrayen som loopas igenom. 
    if (menuArray.length > 0) {

        for (let i = 0; i < menuArray.length; i++) {
            let newDiv = document.createElement("div");
            newDiv.classList.add(`menu-row`);

            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(menuArray[i].foodName + ", ");
            p1.style.textdecoration = "underlined";
            p1.appendChild(p1Text);
            p1.classList.add("column");

            let p = document.createElement("p");
            let pText = document.createTextNode(menuArray[i].price + " kr");
            p.appendChild(pText);
            p.classList.add("column");

            let p2 = document.createElement("p");
            let p2Text = document.createTextNode(menuArray[i].description + ", ");
            p2.appendChild(p2Text);
            p2.classList.add("description");

            let button = document.createElement("button");
            let buttonText = document.createTextNode("Lägg till");
            button.appendChild(buttonText);
            button.id = menuArray[i].foodName;
            button.title = menuArray[i].price;
            button.classList.add("order-item");


            newDiv.appendChild(p1);
            newDiv.appendChild(p);
            newDiv.appendChild(button);
            newDiv.appendChild(p2);


            if (menuArray[i].menyType === "starter") {
                starterOrder.appendChild(newDiv);
            }
            else if (menuArray[i].menyType == "main") {
                mainOrder.appendChild(newDiv);
            }
            else if (menuArray[i].menyType == "dessert") {
                dessertOrder.appendChild(newDiv);
            }
        }
    }
};



export function menuExport() {
    return menuArray;
}