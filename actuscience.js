const RSS_URL = `https://lejournal.cnrs.fr/rss`;

fetch(RSS_URL)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        console.log(data);

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
        document.body.insertAdjacentHTML("afterbegin", html);
    });



