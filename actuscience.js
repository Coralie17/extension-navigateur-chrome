// create a link to reach data from RSS feed of CNRS journal.
const RSS_URL = `https://lejournal.cnrs.fr/rss`;

fetch(RSS_URL)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        console.log(data);

// edit the html element that we insert into the html of google chrome home page.

        const items = data.querySelectorAll("item");
        let html = ``;
        items.forEach(element => {
            html += `
                <article>
                    <img src="${element.querySelector("enclosure").innerHTML}/image/large.png" alt="">
                    <h2>
                        <a href="${element.querySelector("link").innerHTML}" target="_blank" rel="noopener">
                        ${element.querySelector("title").innerHTML}
                        </a>
                    </h2>
                </article>
            `;
        });

// code that can be insert in the html home page

         let addElement = () => {
             let newDiv = document.createElement("div");
             let newContent = document.createTextNode(html);
             newDiv.appendChild(newContent);
             let currentDiv = document.getElementById("tophf");
            currentDiv.insertBefore(newDiv, currentDiv);
         }

        document.body.onload = addElement;

            // document.body.insertAdjacentHTML("afterend", html);
     });



