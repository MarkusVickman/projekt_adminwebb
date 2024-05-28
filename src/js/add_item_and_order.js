/*Fil till index.html för att hantera beställningar och lägga till mat i kundkorgen.*/

//En notisvariabel till snackbaren
const snackBarEl = document.getElementById("snackbar");

//En notis variabel som visar meddelande i botten av skärmen vid initiering av funktionen
function snackBar() {

    // Lägger till klassen "show" till DIV
    snackBarEl.className = "show";

    // Efter 5 sekunder, tar bort klassen "show" från Diven
    setTimeout(function () { snackBarEl.className = snackBarEl.className.replace("show", ""), snackBarEl.innerHTML = "" }, 4000);
}

//variabler för meddelanden och eventlistener 
const orderDiv = document.getElementById("order-div");
const cartItems = document.getElementById("cart-items");
const cart = document.getElementById("cart");
const cartHeader = document.getElementById("cart-header");
const writeOutCart = document.getElementById("write-out-cart");
const cartFooter = document.getElementById("cart-footer");
const alertCheckout = document.getElementById("alert-checkout");
const writeSmallCart = document.getElementById("write-small-cart");

//Variabel för att lagra orderobjekt i varukorgen.
let order = [];


document.addEventListener("DOMContentLoaded", (e) => {
    //Eventlistener som lyssnar efter klick för att lägga till object till kunkorgen, visar kundkoren, initierar funktionen writeCart och skickar notis till snackbar
    orderDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("order-item")) {
            let id = e.target.id;
            let price = e.target.title;
            order.push({ foodName: id, price: price });
            cart.style.display = "block";
            writeCart(order);
            snackBarEl.innerHTML = `En vara är tillagd i varukorgen.`;
            snackBar();
        }
    });

    //Vid klick på klassen/knappen cart-remove tas den posten bort från kundvagnsarrayen
    writeOutCart.addEventListener("click", (e) => {
        if (e.target.classList.contains("cart-remove")) {
            let id = e.target.id;
            order.splice(id, 1);
            writeCart(order);
            //Om kundkorgen är tom så döljs den igen
            if (order.length === 0) {
                cart.style.display = "none";
            }
        }
    })

    //Vid klick på den lilla kundkorgen visas den stora/ kassan
    cart.addEventListener("click", (e) => {
        cartItems.style.display = "block";
    })
    //Vid klick på header/stänga knappen döljs kassan och meddelande rensas och lilla kundkorgen döljs om kundkorgen är tom
    cartHeader.addEventListener("click", (e) => {
        cartItems.style.display = "none";
        if (order.length === 0) {
            alertCheckout.innerHTML = "";
        }
    })

    //Beställning läggs i kassa då checkas att allt är med om allt är ifyllt rensas fälten och ett objekt skapas med beställningsarrayen och namn + email. funktionen orderPost initieras
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // Hämta användarnamn i lowerCase och email från formuläret
        let userName = document.getElementById("user_name").value.toLowerCase();
        let email = document.getElementById("email").value;

        //Letar fel i formuläret med errorCheck funktionen. Utan fel så skapas ett object som skickas till funktionen för POST-anrop
        if (errorCheck(userName, email)) {
            alertCheckout.innerHTML = "";
            writeSmallCart.innerHTML = "";
            cart.style.display = "none";
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


//variabel för totalsumma i varukorgen
let totalAmount = 0;

//Funktion för att skriva lilla varukorgen och stora varukorgen
function writeCart(order) {
    writeOutCart.innerHTML = "";
    cartFooter.innerHTML = "";
    writeSmallCart.innerHTML = "";

    //Nollställer
    totalAmount = 0;
    //loopar igenom hela orderarrayen och bygger upp kassan/kundkorgen. Här plussas totalAmount på och en ta bort knapp skapas med index
    for (let i = 0; i < order.length; i++) {

        totalAmount = totalAmount + parseInt(order[i].price);

        let newDiv = document.createElement("div");
        newDiv.classList.add(`cart-row`);

        let p1 = document.createElement("p");
        let p1Text = document.createTextNode(order[i].foodName + ", ");
        p1.appendChild(p1Text);
        p1.style.textDecoration = "underline";
        p1.classList.add("column");

        let p = document.createElement("p");
        let pText = document.createTextNode(order[i].price + " kr");
        p.appendChild(pText);
        p.style.fontWeight = "bold";
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

    //antal och summa läggs till till kundkorgen/kassan
    let p1 = document.createElement("p");
    let p1Text = document.createTextNode("Summa: " + totalAmount + " kr.");
    p1.appendChild(p1Text);
    p1.classList.add("totalAmount");
    p1.style.fontWeight = "bold";
    writeOutCart.appendChild(p1);

    //Skapar lilla kundkorgen som visas i toppen av sidan när det finns varor i kundkorgen
    let pSmallCart = document.createElement("p");
    let pSmallCartText = document.createTextNode("Antal: " + order.length);
    pSmallCart.appendChild(pSmallCartText);
    pSmallCart.style.fontWeight = "bold";
    pSmallCart.classList.add("column");

    let pSmallCart2 = document.createElement("p");
    let pSmallCartText2 = document.createTextNode("Summa: " + totalAmount + "kr");
    pSmallCart2.appendChild(pSmallCartText2);
    pSmallCart2.style.fontWeight = "bold";
    pSmallCart2.classList.add("column");

    writeSmallCart.appendChild(pSmallCart);
    writeSmallCart.appendChild(pSmallCart2);
}


//Post fetch-anrop som tar in ett objekt som parameter
export async function orderPost(orderCheckout) {
    let response = await fetch('https://project-dt207g.azurewebsites.net/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderCheckout)
    });
    let data = await response.json();

    //Resettar formuläret om det är korrekt ifyllt
    document.getElementById("user_name").value = "";
    document.getElementById("email").value = "";

    //När det är klart skrivs ett meddelande ut på skärmen att beställningen är mottagen och lite info om den.
    let pSmallCart1 = document.createElement("p");
    let pSmallCartText1 = document.createTextNode('Tack för din beställning. Maten är redo att hämtas om 30 minuter.');
    pSmallCart1.appendChild(pSmallCartText1);
    pSmallCart1.style.fontWeight = "bold";

    let pSmallCart = document.createElement("p");
    let pSmallCartText = document.createTextNode("Antal: " + order.length);
    pSmallCart.appendChild(pSmallCartText);
    pSmallCart.style.fontWeight = "bold";
    pSmallCart.classList.add("column");

    let pSmallCart2 = document.createElement("p");
    let pSmallCartText2 = document.createTextNode("Summa: " + totalAmount + "kr");
    pSmallCart2.appendChild(pSmallCartText2);
    pSmallCart2.style.fontWeight = "bold";
    pSmallCart2.classList.add("column");

    alertCheckout.appendChild(pSmallCart1);
    alertCheckout.appendChild(pSmallCart);
    alertCheckout.appendChild(pSmallCart2);

    //Resettar kundkorg
    writeOutCart.innerHTML = ""
    order = [];
};