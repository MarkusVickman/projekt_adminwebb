
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
        // alert.innerHTML = "";
        return result;
    } catch (error) {
        //alert.innerHTML = "Inläggen kunde inte laddas in.";
        console.error(error);
    }
}

//fil för att skriva ut från servern/databasen till webplatsens



//När sidan laddas 
window.onload = menu();

//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen
export async function menu() {
    // Anropa funktionen för att hämta data och väntar på svar
    let menuArray = await menuGet();

    //div där cv-data ska skrivas ut
    const starterArticle = document.getElementById("starter");
    const mainArticle = document.getElementById("main-menu");
    const dessertArticle = document.getElementById("dessert");

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

            let div1 = document.createElement("div");
            let div2 = document.createElement("div");

            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(menuArray[i].foodName);
            p1.style.textDecoration = "underline";
            p1.appendChild(p1Text);
            p1.contentEditable = true;
            p1.id = "foodName" + menuArray[i]._id;
            p1.classList.add("column", "column-edit");

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

            let buttonEdit = document.createElement("button");
            let buttonEditText = document.createTextNode("Uppdatera");
            buttonEdit.appendChild(buttonEditText);
            buttonEdit.id = ("update" + menuArray[i]._id);
            buttonEdit.classList.add("update-item");

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


            /*       newDiv.appendChild(p1);
                   newDiv.appendChild(p2);
                   newDiv.appendChild(p);
                   newDiv.appendChild(kr);
                   newDiv.appendChild(p3);
                   newDiv.appendChild(buttonEdit);
                   newDiv.appendChild(button);*/

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
