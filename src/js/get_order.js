
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
//div där cv-data ska skrivas ut
const orderArticle = document.getElementById("order-article");
const completedOrderArticle = document.getElementById("completed-order");

//När sidan laddas 
window.onload = order();

//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen
export async function order() {
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
            let newDiv = document.createElement("div");
            newDiv.classList.add(`worker-row`);

            for (let j = 0; j < orderArray[i].foods.length; j++) {
                let p = document.createElement("p");
                let pText = document.createTextNode(orderArray[i].foods[j].foodName + ", ");
                p.style.textdecoration = "underlined";
                p.appendChild(pText);
                p.classList.add("column");

                let p1 = document.createElement("p");
                let p1Text = document.createTextNode(orderArray[i].foods[j].price + ", ");
                p1.style.textdecoration = "underlined";
                p1.appendChild(p1Text);
                p1.classList.add("column");

                newDiv.appendChild(p);
                newDiv.appendChild(p1);
            }

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

            newDiv.appendChild(p1);
            newDiv.appendChild(p3);
            newDiv.appendChild(p2);

            newDiv.appendChild(button);

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
