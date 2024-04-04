// Create a link to reach data from the RSS feeds of 'CNRS Le journal' and 'Pour la Science'
const RSS_URL = `https://lejournal.cnrs.fr/rss`;
const RSS_URL2 = `https://www.pourlascience.fr/rss.xml`;


let html = ``;


// --------------------------------------------------------------------

// *** Récupération et traitement du Flux RSS n°1 'CNRS Le journal' ***
// *** Affichage des données sur notre page d'accueil google.fr ***

fetch(RSS_URL)  // Requête HTTP GET à l'URL n°1 pour récupérer les données

    // 1. Récupérer la réponse HTTP et la convertir en texte
    .then(response => response.text())

    // 2. convertir ce texte en objet DOM XML à l'aide de DOMParser()
    // => permet de manipuler le contenu XML avec JS
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))

    // 3. Traitement des données XML récupérées - Générer du HTML dans notre page Web
    .then(data => {

        // Extraire les éléments <items> (correspondant aux articles) du XML
        const items = data.querySelectorAll("item");

        // Pour chaque article :
        items.forEach(element => {
            // On recherche l'élément <enclosure> à l'intérieur de celui-ci
            let enclosure = element.querySelector("enclosure");
            
            // On vérifie si l'élément 'enclosure' existe (= si une image est bien associée à l'article)
            if (enclosure != null) {
                // On récupère l'URL de l'image
                let picture = enclosure.getAttribute("url");

                // On génère du HTML pour chaque article avec l'image associée, en utilisant les données récupérées (URL de l'image, titre et lien vers l'article)
                html += `
                    <article id="news" style="background-image:url(${picture}); background-size:cover">
                        <h2>
                            <a href="${element.querySelector("link").innerHTML}" target="_blank" rel="noopener" style="font-size: medium; color: white; text-shadow: 2px 0 0 #000, 2px 2px 0 #000, 0 2px 0 #000, 2px 2px 0 #000, -2px 0 0 #000, -2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000">
                            ${element.querySelector("title").innerHTML}
                            </a>
                        </h2>
                    </article>
                `;
            }    
        });    
    });


// --------------------------------------------------------------------

// *** Récupération et traitement du Flux RSS n°2 'Pour la Science' ***
// *** Nous souhaitons cette fois-ci filtrer l'information et afficher uniquement les données des articles parus au cours des 7 derniers jours ***


// Function to get today's date in milliseconds / Récupérer la date du jour (millisecondes)
// Créer un nouvel objet de type date en utilisant le constructeur Date() avec le mot clé 'new', sans paramètre
// => donnera la date et l'heure actuelles
// La méthode .getTime() retournera le nombre de millisecondes écoulées depuis le 1er janvier 1970 00:00:00, jusqu'à la date et l'heure représentées par l'objet Date (timestamp)
const todayDate = () => {
    const d = new Date().getTime();
    return d;
}
    
    
// Function to get the date of seven days ago in milliseconds / Récupérer la date d'il y a 7 jours (millisecondes)
const dateOfSevenDaysAgo = () => {

    // Création d'un nouvel objet Date représentant la date et l'heure actuelles
    const date = new Date();
        
    const newDate = date.setDate(date.getDate()-7);
    // La méthode getDate() retourne le jour du mois de l'objet Date (de 1 à 31)
    // On soustrait 7 jours à la date actuelle
    // La méthode setDate() définit le jour du mois pour une date donnée 
    // => retourne le nombre de millisecondes écoulées depuis le 1er janvier 1970 00:00:00, jusqu'à la nouvelle date (7 jours auparavant)
       
    return newDate;
}
    
    
// Function to add HTML elements to the DOM / Insérer du HTML dans la page Web
let addElement = () => {

    // Création d'un nouvel élément div en utilisant la méthode createElement() de l'objet 'document'
    let newDiv = document.createElement("div");

    // Attribution d'un identifiant "Articles" à cet élément div
    newDiv.id = "Articles";
    
    // Définir le contenu HTML de cet élément div en utilisant la valeur de la variable html, en utilisant la propriété innerHTML
    newDiv.innerHTML = html;
    
    // Rechercher l'élément HTML existant avec les classes CSS "o3j99" et "qarstb" => méthode querySelector() de l'objet 'document'
    let currentDiv = document.querySelector(".o3j99.qarstb");
    
    // Ajout de l'élément div nouvellement créé comme 'enfant' de l'élément HTML trouvé précédemment => méthode appendChild()
    currentDiv.appendChild(newDiv);
}
    

fetch(RSS_URL2)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {

        // Extraction des éléments (articles) du XML
        const items = data.querySelectorAll("item");

        // Pour chaque article :
        items.forEach(element => {

            todayDate();
            dateOfSevenDaysAgo();
            
            // Récupérer la date de publication de l'article à partir de l'élément <pubDate>
            const d2 = element.querySelector("pubDate").textContent;

            // Convertir cette date en timestamp (millisecondes depuis 01/01/1970)
            const pubDateNews = new Date(d2).getTime();

            let enclosure = element.querySelector("enclosure");

            // Vérifier si la date de publication de l'article se situe dans les 7 derniers jours,
            // et si l'élément <enclosure> existe bien (=> image associée)
            if (pubDateNews >= dateOfSevenDaysAgo() && pubDateNews <= todayDate() && enclosure != null) {
                // Récupération de l'URL de l'image de 'enclosure'
                let picture = `https:${enclosure.getAttribute("url")}`;
                // Génération du HTML pour chaque article
                html += `
                    <article style="background-image:url('${picture}'); background-size:cover">
                        <h2>
                            <a href="${element.querySelector("link").innerHTML}" target="_blank" rel="noopener" style="font-size: medium; color: white; text-shadow: 2px 0 0 #000, 2px 2px 0 #000, 0 2px 0 #000, 2px 2px 0 #000, -2px 0 0 #000, -2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000">
                            ${element.querySelector("title").textContent}
                            </a>
                        </h2>
                    </article>
                `;    
            }
        });

        // Ajouter le HTML généré au DOM
        // => lorsque le HTML original de la page est chargé, appeler notre fonction addElement()
        document.onload = addElement();
    });

// console.log(html)
