

const snackBarEl = document.getElementById("snackbar");

//Läser in variabel med ett element där meddelanden ska visas
function snackBar() {
  
    // Add the "show" class to DIV
    snackBarEl.className = "show";
  
    // After 5 seconds, remove the show class from DIV
    setTimeout(function(){ snackBarEl.className = snackBarEl.className.replace("show", ""); }, 4000);
  } 
//Läser in variabel med ett element där meddelanden ska visas








//Get fetch-anrop för att hämta array med cv.
export async function orderGet() {
    try {
        const response = await fetch('https://project-dt207g.azurewebsites.net/protected/order/', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        })
        const result = await response.json();
        //returnerar json-data till funktionen writeCvToHtml()

        return result;
    } catch (error) {

        return false;
    }
}


//fil för att skriva ut från servern/databasen till webplatsens


//När sidan laddas 
window.onload = order();

//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen
export async function order() {

    //div där cv-data ska skrivas ut
const orderArticle = document.getElementById("order-article");
const completedOrderArticle = document.getElementById("completed-order");
    // Anropa funktionen för att hämta data och väntar på svar
    let orderArray = await orderGet();

    //Rensar html
    orderArticle.innerHTML = "";
    completedOrderArticle.innerHTML = "";

    let hVerified = document.createElement("h3");
    let hVerifiedText = document.createTextNode("Levererade ordrar");
    hVerified.appendChild(hVerifiedText);
    completedOrderArticle.appendChild(hVerified);

    let hNotVerified = document.createElement("h3");
    let hNotVerifiedText = document.createTextNode("Nya ordrar");
    hNotVerified.appendChild(hNotVerifiedText);
    orderArticle.appendChild(hNotVerified);


    //Om arrayen inte är tom byggs innehållet upp utifrån arrayen som loopas igenom. 
    if (orderArray.length > 0) {

        for (let i = 0; i < orderArray.length; i++) {

            let totalAmount = 0;

            let newDiv = document.createElement("div");
            newDiv.classList.add(`worker-row`);

            for (let j = 0; j < orderArray[i].foods.length; j++) {

                let p = document.createElement("p");
                let pText = document.createTextNode(orderArray[i].foods[j].foodName + ", ");
                p.style.fontWeight = "bold";
                p.appendChild(pText);
                p.classList.add("column");

                let p1 = document.createElement("p");
                let p1Text = document.createTextNode(orderArray[i].foods[j].price + ", ");
                p1.style.textdecoration = "underlined";
                p1.appendChild(p1Text);
                p1.classList.add("column");

                let smallDiv = document.createElement("div");

                smallDiv.appendChild(p);
                smallDiv.appendChild(p1);
                newDiv.appendChild(smallDiv);

                totalAmount = totalAmount + parseInt(orderArray[i].foods[j].price);
            }



            let pAmount = document.createElement("p");
            let pAmountText = document.createTextNode("Summa: " + totalAmount + " kr.");
            pAmount.appendChild(pAmountText);
            pAmount.classList.add("totalAmount");
            pAmount.style.fontWeight = "bold";


            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(orderArray[i].userName + ", ");
            p1.style.textdecoration = "underlined";
            p1.appendChild(p1Text);
            p1.classList.add("column");

            let p3 = document.createElement("p");
            let p3Text = document.createTextNode(orderArray[i].email + ", ");
            p3.style.textdecoration = "underlined";
            p3.appendChild(p3Text);
            p3.classList.add("column");

            let p2 = document.createElement("p");
            let p2Text = document.createTextNode("Skapad " + orderArray[i].created.slice(0, 10));
            p2.appendChild(p2Text);
            p2.classList.add("column");

            let buttonVerify = document.createElement("button");
            let buttonVerifyText = document.createTextNode("Klarmarkera");
            buttonVerify.appendChild(buttonVerifyText);
            buttonVerify.id = ("complete" + orderArray[i]._id);
            buttonVerify.classList.add("complete");

            let button = document.createElement("button");
            let buttonText = document.createTextNode("Ta bort");
            button.appendChild(buttonText);
            button.id = orderArray[i]._id;
            button.classList.add("remove-order");

            let smallDiv = document.createElement("div");
            smallDiv.appendChild(p1);
            smallDiv.appendChild(p3);

            let smallDiv1 = document.createElement("div");
            smallDiv1.appendChild(p2);
            smallDiv1.appendChild(button);

            newDiv.appendChild(pAmount);
            newDiv.appendChild(smallDiv);
            newDiv.appendChild(smallDiv1);


            if (orderArray[i].completed === true) {
                completedOrderArticle.appendChild(newDiv);
            }
            else if (orderArray[i].completed === false) {
                newDiv.appendChild(buttonVerify);
                orderArticle.appendChild(newDiv);
            }
        }
    }
};








//Kod för att klarmarkera ordrar

document.addEventListener("DOMContentLoaded", (event) => {

    const orderArticle = document.getElementById("order-article");
    // Lägg till händelselyssnare på formuläret
    orderArticle.addEventListener("click", (e) => {
       if (e.target.id.slice(0, 8) === "complete"){
        
            // Hämta CV-data från formuläret
            const indexId = e.target.id.substring(8);

            completePut({indexId: indexId});
        }
    });
});


//import { order } from './get_order';

//Post fetch-anrop som tar in ett objekt som parameter
export async function completePut(indexId) {

    let response = await fetch('https://project-dt207g.azurewebsites.net/protected/order/completed', {
        method: 'PUT',
        headers: {
            'authorization': 'Bearer ' + sessionStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(indexId)
    });
    let data = await response.json();
    //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat
    snackBarEl.innerHTML = `En order är klarmarkerad.`;
    snackBar();

    GetOrder();
}

function GetOrder() {
    order();
};













//Kod för att ta bort order

//import { order } from './get_order';


//variabler för meddelanden och eventlistener 


document.addEventListener("DOMContentLoaded", (e) => {
    const orderDiv = document.getElementById("orders");
    
    //Eventlistener som lyssnar efter klick på ta bort knapparna för cv, initierar funktionen removeCV och skickar med id/index som argument
    orderDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-order")) {
            let id = e.target.id;
            removeOrder(id);
        }
    });
});

//Funktionen skickar med id/index till delete fetch-funktionen och väntar på svar. När svar nås skrivs ett meddelande ut på skärmen
async function removeOrder(id) {
    let data = await orderDelete(id);

    snackBarEl.innerHTML = `En order är borttagen.`;
    snackBar();
    order();
}


//Delete fetch-anrop som tar in ett id/index som skickas med till servern för att tas bort från databasen 
async function orderDelete(id) {
    let response = await fetch(`https://project-dt207g.azurewebsites.net/protected/order/delete/${id}`, {
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

