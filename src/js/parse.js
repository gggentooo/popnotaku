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

async function parseLounge(src) {
    const response = await fetch(src);
    const raw = await response.json();

    const target_index = document.getElementById("lounge-index");
    const target_list = document.getElementById("lounge-list");

    for (var i = 0; i < raw.length; i++) {
        const d = raw[i];
        const content = `<li><a href="#` + d["idx"] + `">` + d["title-ko"] + `</a></li>`;
        target_index.innerHTML += content;

        const arr = d["content"];
        var ul_content = ``;
        for (var j = 0; j < arr.length; j++) {
            const e = arr[j];
            var icons = ``;
            for (var k = 0; k < e["char"].length; k++) {
                icons += `<i class="icon ` + e["char"][k] + `" title="` + e["char"][k] + `" aria-label="` + e["char"][k] + `"></i>`
            }
            const li_content = `<li>
                    ` + icons + `
                    <p class="ko">` + e["content-ko"] + `</p>
                    <p class="ja">` + e["content-ja"] + `</p>
                </li>`;

            ul_content += li_content;
        }

        const section_content = `<section>
            <h3 id="`+ d["idx"] + `">제 ` + d["idx"] + `회<button class="fold" onclick="foldSection('` + d["idx"] + `')">단락 접기/펼치기</button></h3>
            <h4 class="title ko">`+ d["title-ko"] + `</h4>
            <h4 class="title ja">`+ d["title-ja"] + `</h4>
            <ul class="dialogue">`+ ul_content + `</ul>
        </section>`;

        target_list.innerHTML += section_content;
    }
}