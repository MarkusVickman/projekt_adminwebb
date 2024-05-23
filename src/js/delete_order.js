
import { order } from './get_order';




//variabler för meddelanden och eventlistener 
const orderDiv = document.getElementById("orders");

document.addEventListener("DOMContentLoaded", (e) => {
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
    order();
    //alert2.innerHTML = `En användare är borttaget från databasen.`;
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
