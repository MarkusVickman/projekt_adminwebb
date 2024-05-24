
//Läser in variabel med ett element där meddelanden ska visas



//Get fetch-anrop för att hämta array med cv.
export async function workerGet() {
    try {
        const response = await fetch('https://project-dt207g.azurewebsites.net/protected/user', {
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
const verifiedArticle = document.getElementById("verified");
const notVerifiedArticle = document.getElementById("not-verified");



//När sidan laddas 
window.onload = worker();

//Initieras vid start och efter att ett inlägg tagits bort från webbplatsen
export async function worker() {
    // Anropa funktionen för att hämta data och väntar på svar
    let workerArray = await workerGet();

    if (workerArray.result === "notadmin") {
        const adminWorker = document.getElementById("adminWorker");
        const adminLink = document.getElementById("admin-link");
        adminWorker.style.display = "none";
        adminLink.style.display = "none";
    } else {
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

                let buttonVerify = document.createElement("button");
                let buttonVerifyText = document.createTextNode("Verifiera");
                buttonVerify.appendChild(buttonVerifyText);
                buttonVerify.id = ("verify" + workerArray[i]._id);
                buttonVerify.classList.add("verify");




                newDiv.appendChild(p1);
                newDiv.appendChild(p2);
                if (workerArray[i].username !== "admin") {
                    let button = document.createElement("button");
                    let buttonText = document.createTextNode("Ta bort");
                    button.appendChild(buttonText);
                    button.id = workerArray[i]._id;
                    button.classList.add("remove-worker");
                    newDiv.appendChild(button);
                }

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
