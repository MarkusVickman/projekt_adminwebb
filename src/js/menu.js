/*Fil till index.html för att hämta och skriva ut menyn*/

//Variabel för meddelande
const alert = document.getElementById("alert");

//Get fetch-anrop för att hämta array av menyn.
export async function menu1Get() {
    try {
        const response = await fetch('https://project-dt207g.azurewebsites.net/menu', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
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

//div där meny-data ska skrivas ut
const starterArticle = document.getElementById("starter");
const mainArticle = document.getElementById("main-menu");
const dessertArticle = document.getElementById("dessert");

//div där meny-data ska skrivas ut till hämtmenyn
const starterOrder = document.getElementById("order-starter");
const mainOrder = document.getElementById("order-main");
const dessertOrder = document.getElementById("order-dessert");

//När sidan laddas 
window.onload = menuLoad();

//lagrar in menyArrat som används av 2 olika funktioner
let menuArray = [];


//Initieras vid start och skriver ut hela menyn till 2 element en för vanliga menyn
export async function menuLoad() {
    // Anropa funktionen för att hämta data och väntar på svar
    menuArray = await menu1Get();
    menuExport();

    //Rensar html
    starterArticle.innerHTML = "";
    mainArticle.innerHTML = "";
    dessertArticle.innerHTML = "";

    //kategorier för starter, main och dessert
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

        //bygger upp menyrader med info om maträtt, pris och beskrivning
        for (let i = 0; i < menuArray.length; i++) {
            let newDiv = document.createElement("div");
            newDiv.classList.add(`menu-row`);

            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(menuArray[i].foodName + ", ");
            p1.style.textDecoration = "underline";
            p1.style.fontWeight = "bold";
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

            //Beroende på kategori tilldelas olika element olika menyrader
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
        //initierar funktion för att skapa hämtmenyn men extra funktioner
        orderMenu();
    }
};



//Initieras vid start av funktionen menuLoad()
export async function orderMenu() {
    //Rensar html
    starterOrder.innerHTML = "";
    mainOrder.innerHTML = "";
    dessertOrder.innerHTML = "";

    //kategorier för starter, main och dessert
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

        //bygger upp menyrader med info om maträtt, pris, beskrivning och knappar för att lägga till mat till beställning
        for (let i = 0; i < menuArray.length; i++) {
            let newDiv = document.createElement("div");
            newDiv.classList.add(`menu-row`);

            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(menuArray[i].foodName + ", ");
            p1.style.textDecoration = "underline";
            p1.style.fontWeight = "bold";
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

            //knapp men information om maträtt och pris och unikt id
            let button = document.createElement("button");
            let buttonText = document.createTextNode("Lägg till");
            button.appendChild(buttonText);
            button.id = menuArray[i].foodName;
            button.title = menuArray[i].price;
            button.classList.add("order-item");

            newDiv.appendChild(p1);
            newDiv.appendChild(p);

            newDiv.appendChild(p2);
            newDiv.appendChild(button);

            //Beroende på kategori tilldelas olika element olika menyrader
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

//Funktion som returnerar hela menyn
export function menuExport() {
    return menuArray;
}


document.addEventListener("DOMContentLoaded", (event) => {
    //Variabler för divar och knappar
    const showOrderMenu = document.getElementById("show-order-menu");
    const showOrder = document.getElementById("show-menu");
    const menuDiv = document.getElementById("menu-div");
    const orderDiv = document.getElementById("order-div");

    // Vid klick på menyknapp visas vanliga menyn och ordermenyn döljs
    showOrder.addEventListener("click", (e) => {
        menuDiv.style.display = "block";
        orderDiv.style.display = "none";
    });

    //Vid klick på ordermenyknappen visas ordermenyn och vanliga menyn döljs
    showOrderMenu.addEventListener("click", (e) => {
        menuDiv.style.display = "none";
        orderDiv.style.display = "block";
    })
});
