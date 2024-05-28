# Projektwebbplats i kursen Dt207G - Backend-baserad webbutveckling
Projektet består av flera delar, en mongoDb databas, en node.js/express api-server och en webbplats med en restaurangsida och en adminsida. Koden innehåller många kommentarer som kan svara om fler frågor finns om webbplatsen det går också att läsa readme och ta del av repot till min api-server [klicka här](https://github.com/MarkusVickman/dt207g-project/blob/main/README.md).

## Webbplatsen
På den här restaurangwebbplatsen kan du se restaurangens meny och lägga ordrar till restaurangens adminwebbplats. Ordrarna skickas med fetch api-POST.
För att testa demowebbplatsen [grillhörnan](https://grillhornan.netlify.app/).

### Sidan består av följande:
* En Meny som hämtas med fetch api-GET. Menyn skrivs ut till en vanlig meny och en för hämtmeny som också innehåller knappar för att lägga till varor med hjälp av knappens id.
* När varor läggs till från menyn läggs de till i en kundkorgsdiv och en kassadiv.
* Vid utcheckning i kassat skrivs felmeddelande ut om det saknas namn eller email.
* Den order som görs skickas med fetch api-POST till api-servern och går att se på adminwebb.
* När en order är klar skrivs ett meddelande ut i kassan att orden är på gång. Sedan rensas kundkorg och kassan. 

## Admin webbplatsen
Inloggning på adminwebb är användarnamn: admin och lösenord: password. Det går att skapa ett nytt konto men det måste först verifieras av admin men får då inte rättigheter till att se andras konton.

### Sidan består av följande:
* Användarnamn, lösenord och datum för när kontot skapades lagras i en mongoDb-databas med hjälp av fetch api-POST. Lösenordet krypteras över https på vägen till servern och i servern hashas lösenordet så att det inte går att ses av någon.
* Ordrar laddas in med fetch api-GET.
  * Dessa ordrar går att ta bort med fetch api-DELETE eller markera som klara med fetch api-PUT. Klarmarkerade ordrar visas i en engen div.
* Menyn hämtas med fetch api-GET och skrivs ut på sidan tillsammans med formulär och knappar för att ändra i menyn.
  * För att lägga till i menyn hämtas data från formuläret och skickas med fetch api-POST och för att ta bort hämtas id från respektive ta bort-knapp och skickas med som parameter till apit.
  * Menyfälten som ska gå att ändra är skrivna med "contentEditible = true" och information hämtas från dessa fält och bifogas när uppdatera-knappen används.
* Användarhantering kommer endast admin åt och kan då bekräfta tillgång till adminwebb för nya registrerade konton med ett fetch api-PUT som skickar med "verified": "true".
  * Det går även att ta bort användare där in för specifik användare hämtas från ta bort-knappen som då skickas med i ett fetch api-DELETE anrop för att ta bort användare.
 
### Uppbyggnad
* Webbplatsen skapades i ett node.js-projekt och använde parcel som atomatiserad utvecklingsmiljö.
* Skriven i html, css och javaScript

### Replikera
För att jobba vidare på webbplatsen eller testköra koden lokalt behövs node.js vara installerat på datorn. Sedan ska kommandot "npm install" köras i rotkatalogen för webbplatsen. För att testköra används kortkommandot "npm run start" eller "npm run build" för att skapa en produktionsfärdig webbplats.

## Markus Vickman
Jag läser till en högskoleexamen i datateknik med inriktning webbutveckling på mittuniversitet.

### Student ID: mavi2302
