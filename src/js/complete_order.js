
const orderArticle = document.getElementById("order-article");


document.addEventListener("DOMContentLoaded", (event) => {
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
    alert = "Menyraden är uppdaterad.";

    GetOrder();
}

function GetOrder() {
    order();
};