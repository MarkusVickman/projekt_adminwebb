/*Fil till admin.html för att hantera beställningar och lägga till mat i kundkorgen.*/

//En notisvariabel till snackbaren
const snackBarEl = document.getElementById("snackbar");

//En notis variabel som visar meddelande i botten av skärmen vid initiering av funktionen
function snackBar() {

    // Lägger till klassen "show" till DIV
    snackBarEl.className = "show";

    // Efter 5 sekunder, tar bort klassen "show" från Diven
    setTimeout(function () { snackBarEl.className = snackBarEl.className.replace("show", ""); }, 4000);
}





//Get fetch-anrop för att hämta array med ordrar. verifierar med jwt-token
export async function orderGet() {
    try {
        const response = await fetch('https://project-dt207g.azurewebsites.net/protected/order/', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        })
        const result = await response.json();

        //returnerar json-data till funktionen order()
        return result;
    } catch (error) {

        return false;
    }
}


//När sidan laddas 
window.onload = order();

//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen eller klarmarkerats
export async function order() {

    //div där order-data ska skrivas ut
    const orderArticle = document.getElementById("order-article");
    const completedOrderArticle = document.getElementById("completed-order");
    
    // Anropa funktionen för att hämta data och väntar på svar
    let orderArray = await orderGet();

    //Rensar html
    orderArticle.innerHTML = "";
    completedOrderArticle.innerHTML = "";

    //Skapar kategorier för att kunna särskilja nya från klara beställningar
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

            //Initierar variabel för att skriva ut summa
            let totalAmount = 0;

            let newDiv = document.createElement("div");
            newDiv.classList.add(`worker-row`);

            //Loopar igenom en array i objectarrayen för att kunna lista alla maträtter som beställts
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

                //Plussar på totalsumman
                totalAmount = totalAmount + parseInt(orderArray[i].foods[j].price);
            }

            //Här byggs DOM upp med totalsumma, namn, emal, när ordern är lagd
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

            //Knappar skapas för att klarmarkera eller ta bort ordrar. De har unika idn
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

            //Beroende på om ordrarna är markerade som klara eller ej tilldelas de till olika element.
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
    // Vid klick på id med första tecknena "complete" initieras en Put för att ändra order till completed = true
    orderArticle.addEventListener("click", (e) => {
        if (e.target.id.slice(0, 8) === "complete") {

            // Hämta CV-data från formuläret
            const indexId = e.target.id.substring(8);
            completePut({ indexId: indexId });
        }
    });
});


//Post fetch-anrop som tar in ett objekt som parameter med ett id, verifieras med jwt-token
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
    //När det är klart skrivs ett meddelande ut på skärmen att ändringen är sparat
    snackBarEl.innerHTML = `En order är klarmarkerad.`;
    snackBar();
    GetOrder();
}

function GetOrder() {
    order();
};








//Kod för att ta bort order
document.addEventListener("DOMContentLoaded", (e) => {
    const orderDiv = document.getElementById("orders");

    //Eventlistener som lyssnar efter klick på ta bort knapparna för order, initierar funktionen removeOrder och skickar med id/index som argument
    orderDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-order")) {
            let id = e.target.id;
            removeOrder(id);
        }
    });
});

//Funktionen skickar med id/index till delete fetch-funktionen och väntar på svar. När svar nås skrivs ett meddelande ut på skärmen och order() initieras för att ladda om ordrarna.
async function removeOrder(id) {
    let data = await orderDelete(id);

    snackBarEl.innerHTML = `En order är borttagen.`;
    snackBar();
    order();
}


//Delete fetch-anrop som tar in ett id/index som skickas med till servern för att tas bort från databasen. Verifieras med jwt-token
async function orderDelete(id) {
    let response = await fetch(`https://project-dt207g.azurewebsites.net/protected/order/delete/${id}`, {
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

