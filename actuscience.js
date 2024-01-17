// create a link to reach data from RSS feed of CNRS journal.
const RSS_URL = `https://lejournal.cnrs.fr/rss`;
const RSS_URL2 = `https://www.pourlascience.fr/rss.xml`

let html = ``;


// -----------------------------------------------------------------------------------------------------------------------------------------------------
// we want to sort science news and recover date time and display on our html files the news of the 7 last days.

const todayDate = () => {
    const d = new Date().getTime();
    return d;
}

const dateOfSevenDaysAgo = () => {
    const date = new Date();
    const newDate = date.setDate(date.getDate()-7);
    return newDate;
}

let addElement = () => {
    let newDiv = document.createElement("div");
    newDiv.id = "Articles"
    newDiv.innerHTML = html;
    let currentDiv = document.querySelector(".o3j99.qarstb");
    currentDiv.appendChild(newDiv);
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------

 fetch(RSS_URL)
     .then(response => response.text())
     .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
     .then(data => {
        console.log(data);

// edit the html element that we insert into the html of google chrome home page.

         const items = data.querySelectorAll("item");
         items.forEach(element => {
             let enclosure = element.querySelector("enclosure")
            
            if (enclosure != null){
            let picture = enclosure.getAttribute("url")
             html += `
                 <article id="news" style="background-image:url(${picture}); background-size:cover">
                
                     <h2>
                         <a href="${element.querySelector("link").innerHTML}" target="_blank" rel="noopener">
                         ${element.querySelector("title").innerHTML}
                         </a>
                     </h2>
                 </article>
             `;
            }
            
         });
        
      });


// -----------------------------------------------------------------------------------------------------------------------------------------------------

fetch(RSS_URL2)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {

        const items = data.querySelectorAll("item");
        items.forEach(element => {
            todayDate();
            dateOfSevenDaysAgo()
            const d2 = element.querySelector("pubDate").textContent;
            const pubDateNews = new Date(d2).getTime();
            let enclosure = element.querySelector("enclosure")

            if (pubDateNews >= dateOfSevenDaysAgo() && pubDateNews <= todayDate() && enclosure != null){
                console.log("j'aime les chocapic")
                let picture = `https:${enclosure.getAttribute("url")}`
                html += `
                    <article style="background-image:url('${picture}'); background-size:cover">
                        <h2>
                            <a href="${element.querySelector("link").innerHTML}" target="_blank" rel="noopener">
                            ${element.querySelector("title").textContent}
                            </a>
                        </h2>
                    </article>
                `;    
            }
        });

        document.onload = addElement();
   
});
console.log(html)







//  let image = document.createElement("img");
//  image.src = chrome.runtime.getURL("images/cielEtoile.jpg");
//  let articleImage = document.getElementById("Articles");
//  articleImage.appendChild(image)