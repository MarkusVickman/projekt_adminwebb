
//variabler för meddelanden och eventlistener 
const orderDiv = document.getElementById("order-div");
const cartItems = document.getElementById("cart-items");
const cart = document.getElementById("cart");
const cartClose = document.getElementById("cart-close");
const writeOutCart = document.getElementById("write-out-cart");
const cartFooter = document.getElementById("cart-footer");
const alertCheckout = document.getElementById("alert-checkout");


let order = [];

document.addEventListener("DOMContentLoaded", (e) => {
    //Eventlistener som lyssnar efter klick på ta bort knapparna för cv, initierar funktionen removeCV och skickar med id/index som argument
    orderDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("order-item")) {
            let id = e.target.id;
            let price = e.target.title;
            order.push({ foodName: id, price: price });
            document.getElementById(e.target.id).style.backgroundColor = "lightblue";

            cart.style.display = "block";
            writeCart(order);
        }
    });

    writeOutCart.addEventListener("click", (e) => {
        if (e.target.classList.contains("cart-remove")) {
            let id = e.target.id;
            order.splice(id, 1);
            writeCart(order);
        }
    })

    cart.addEventListener("click", (e) => {
        cartItems.style.display = "block";
    })
    cartClose.addEventListener("click", (e) => {
        cartItems.style.display = "none";
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // Hämta användarnamn i lowerCase och lösenord från formuläret
        let userName = document.getElementById("user_name").value.toLowerCase();
        let email = document.getElementById("email").value;

        //Letar fel i formuläret med errorCheck funktionen. Utan fel så skapas ett object som skickas till funktionen för POST-anrop
        if (errorCheck(userName, email)) {

            const orderCheckout = { foods: order, userName: userName, email: email };
            orderPost(orderCheckout);

        }
    });
});

//Checkar efter fel i formuläret och skriver ut felmeddelande i så fall annars returnerar true
function errorCheck(userName, email) {
    let inputErrors = [];
    //Flera if satser för att välja vilka felmeddelanden som ska tar med
    if (userName === "") {
        inputErrors.push("namn ");
    }
    if (email === "") {
        inputErrors.push(" epost.");
    }

    //Om fel inte finns skapas en nytt inlägg i databasen och startsidan laddas
    if (inputErrors.length === 0) {
        return true;
    }
    //Om fel finns skrivs alla dessa ut på sidan
    else {
        alertCheckout.innerHTML = "Fyll i " + inputErrors;
        return false;
    }
}


function writeCart(order) {
    writeOutCart.innerHTML = "";
    cartFooter.innerHTML = "";
    let totalAmount = 0;
        for (let i = 0; i < order.length; i++) {

            totalAmount = totalAmount + parseInt(order[i].price);

            let newDiv = document.createElement("div");
            newDiv.classList.add(`cart-row`);

            let p1 = document.createElement("p");
            let p1Text = document.createTextNode(order[i].foodName + ", ");
            p1.appendChild(p1Text);
            p1.classList.add("column");

            let p = document.createElement("p");
            let pText = document.createTextNode(order[i].price + " kr");
            p.appendChild(pText);
            p.classList.add("column");

            let button = document.createElement("button");
            let buttonText = document.createTextNode("Ta bort");
            button.appendChild(buttonText);
            button.id = i;
            button.classList.add("cart-remove");


            newDiv.appendChild(p1);
            newDiv.appendChild(p);
            newDiv.appendChild(button);
            writeOutCart.appendChild(newDiv);
        }

        let p1 = document.createElement("p");
        let p1Text = document.createTextNode(totalAmount + " kr.");
        p1.appendChild(p1Text);
        p1.classList.add("totalAmount");
        cartFooter.appendChild(p1);
    
}

//Funktionen skickar med id/index till delete fetch-funktionen och väntar på svar. När svar nås skrivs ett meddelande ut på skärmen
/*async function (id) {
    let data = await menuDelete(id);
    menu();
    alert2.innerHTML = `En menyrad är borttaget från databasen.`;
}
*/




//Post fetch-anrop som tar in ett objekt som parameter
export async function orderPost(orderCheckout) {
    let response = await fetch('https://project-dt207g.azurewebsites.net/checkout', {
        method: 'POST',
        headers: {
            'authorization': 'Bearer ' + sessionStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderCheckout)
    });
    let data = await response.json();
    //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat
    //cart.style.display = "block";
    //Resettar formuläret om det är korrekt ifyllt
    document.getElementById("user_name").value = "";
    document.getElementById("email").value = "";
    alertCheckout.innerHTML = 'Tack för din beställning. Maten är klar om 30 minuter.';
    order = [];
};
