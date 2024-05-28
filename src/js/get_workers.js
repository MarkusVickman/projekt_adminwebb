/*Fil till admin.html för att hantera personal.*/

//En notisvariabel till snackbaren
const snackBarEl = document.getElementById("snackbar");

//En notis variabel som visar meddelande i botten av skärmen vid initiering av funktionen
function snackBar() {
  
    // Lägger till klassen "show" till DIV
    snackBarEl.className = "show";
  
    // Efter 5 sekunder, tar bort klassen "show" från Diven
    setTimeout(function(){ snackBarEl.className = snackBarEl.className.replace("show", ""), snackBarEl.innerHTML = "" }, 4000);
  } 



//Get fetch-anrop för att hämta array med anställdas konton. kräver jwt-token
export async function workerGet() {
    try {
        const response = await fetch('https://project-dt207g.azurewebsites.net/protected/user', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        })
        const result = await response.json();
        return result;
    } catch (error) {
        return false;
    }
}


//När sidan laddas 
window.onload = worker();

//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen
export async function worker() {

    //div där konto-data ska skrivas ut
    const verifiedArticle = document.getElementById("verified");
    const notVerifiedArticle = document.getElementById("not-verified");

    // Anropa funktionen för att hämta data och väntar på svar
    let workerArray = await workerGet();

    //Ifall inloggad användare inte är admin så döljs divar med admin info som inte heller skrivs ut
    if (workerArray.result === "notadmin") {
        const adminWorker = document.getElementById("adminWorker");
        const adminLink = document.getElementById("admin-link");
        adminWorker.style.display = "none";
        adminLink.style.display = "none";
    } 
    //Om adminkonto används listas konton efter verifierade eller icke. 
    else {
        //Rensar html
        verifiedArticle.innerHTML = "";
        notVerifiedArticle.innerHTML = "";

        let hVerified = document.createElement("h3");
        let hVerifiedText = document.createTextNode("Verifierade användare");
        hVerified.appendChild(hVerifiedText);
        verifiedArticle.appendChild(hVerified);

        let hNotVerified = document.createElement("h3");
        let hNotVerifiedText = document.createTextNode("Användare som behöver verifieras");
        hNotVerified.appendChild(hNotVerifiedText);
        notVerifiedArticle.appendChild(hNotVerified);

        //Om arrayen inte är tom byggs innehållet upp utifrån arrayen som loopas igenom. 
        if (workerArray.length > 0) {

            for (let i = 0; i < workerArray.length; i++) {
                let newDiv = document.createElement("div");
                newDiv.classList.add(`worker-row`);

                let p1 = document.createElement("p");
                let p1Text = document.createTextNode(workerArray[i].username + ", ");
                p1.style.textdecoration = "underlined";
                p1.appendChild(p1Text);
                p1.classList.add("column");

                let p2 = document.createElement("p");
                let p2Text = document.createTextNode("Skapad " + workerArray[i].created.slice(0, 10));
                p2.appendChild(p2Text);
                p2.classList.add("column");

                //Knappar skapas för att verifiera användare
                let buttonVerify = document.createElement("button");
                let buttonVerifyText = document.createTextNode("Verifiera");
                buttonVerify.appendChild(buttonVerifyText);
                buttonVerify.id = ("verify" + workerArray[i]._id);
                buttonVerify.classList.add("verify");

                newDiv.appendChild(p1);
                newDiv.appendChild(p2);
                //för icke admin konton ges också en knapp för att ta bort användare.
                if (workerArray[i].username !== "admin") {
                    let button = document.createElement("button");
                    let buttonText = document.createTextNode("Ta bort");
                    button.appendChild(buttonText);
                    button.id = workerArray[i]._id;
                    button.classList.add("remove-worker");
                    newDiv.appendChild(button);
                }

                //Utifrån verifierad eller ej visas informationen i olika divar.
                if (workerArray[i].verified === true) {
                    verifiedArticle.appendChild(newDiv);
                }
                else if (workerArray[i].verified === false) {
                    newDiv.appendChild(buttonVerify);
                    notVerifiedArticle.appendChild(newDiv);
                }
            }
        }
    }
};







//Kod för att ta bort arbetare
document.addEventListener("DOMContentLoaded", (e) => {
    const workerDiv = document.getElementById("write-user");
    //Eventlistener som lyssnar efter klick på ta bort knapparna för användare, initierar funktionen removeWorker och skickar med id/index som argument
    workerDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-worker")) {
            let id = e.target.id;
            removeWorker(id);
        }
    });
});

//Funktionen skickar med id/index till delete fetch-funktionen och väntar på svar. När svar nås skrivs ett meddelande ut på skärmen. konto listan laddas också om.
async function removeWorker(id) {
    let data = await workerDelete(id);
    worker();
    snackBarEl.innerHTML = `En användare är borttaget från databasen.`;
    snackBar();
}

//Delete fetch-anrop som tar in ett id/index som skickas med till servern för att tas bort från databasen. jwt-token krävs
async function workerDelete(id) {
    let response = await fetch(`https://project-dt207g.azurewebsites.net/protected/user/delete/${id}`, {
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








//Kod för att verifiera användare
document.addEventListener("DOMContentLoaded", (event) => {
    const userDiv = document.getElementById("write-user");
    // om target id börjar på verify hämtas id från samma sträng minus "verify"
    userDiv.addEventListener("click", (e) => {
        if (e.target.id.slice(0, 6) === "verify") {

            // Hämta CV-data från formuläret
            const indexId = e.target.id.substring(6);
            //initierar Put med id
            verifyPut({ indexId: indexId });
        }
    });
});


//Post fetch-anrop som tar in ett objekt som parameter. authorizeras med jwt-token
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
    //När det är klart skrivs ett meddelande ut på skärmen att inlägget är sparat. Användardiven laddas om
    snackBarEl.innerHTML = `Användaren är verifierad för åtkomst.`;
    snackBar();
    GetWorker();
}

function GetWorker() {
    worker();
};