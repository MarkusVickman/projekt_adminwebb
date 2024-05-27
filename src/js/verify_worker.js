
const userDiv = document.getElementById("write-user");


document.addEventListener("DOMContentLoaded", (event) => {
    // Lägg till händelselyssnare på formuläret
    userDiv.addEventListener("click", (e) => {
       if (e.target.id.slice(0, 6) === "verify"){
        
            // Hämta CV-data från formuläret
            const indexId = e.target.id.substring(6);

            verifyPut({indexId: indexId});
        }
    });
});


//import { worker } from './get_workers';

//Post fetch-anrop som tar in ett objekt som parameter
export async function verifyPut(indexId) {

    let response = await fetch('https://project-dt207g.azurewebsites.net/protected/user/verify', {
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

    GetWorker();
}

function GetWorker() {
    worker();
};