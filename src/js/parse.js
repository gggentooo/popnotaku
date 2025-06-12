/*
parse.js
gggentooo, 250612

various data parsing functions
*/

async function parseHistory(src) {
    const response = await fetch(src);
    const raw = await response.json();

    const target = document.getElementById("main-popn-history");

    for (var i = 0; i < raw.length; i++) {
        const d = raw[i];
        const content = `<li>
                <p class="title-ko">` + d["title-ko"] + `</p>
                <p class="title-ja">` + d["title"] + `</p>
                <p class="release">` + d["release"] + `</p>
            </li>`;
        target.innerHTML += (content);
    }
}