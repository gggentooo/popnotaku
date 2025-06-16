/*
title.js
gggentooo, 250616

functions used in the title page
*/

async function loadTitles(a) {
    const response = await fetch(a);
    const raw = await response.json();

    const target = document.getElementById("list-arcade");

    for (var i = 0; i < raw.length; i++) {
        const d = raw[i];
        const content = `<li data-number='` + d["number"] + `' onclick='location.href="./?t=` + d["number"] + `"'>
                <p class="number">` + d["number"] + `</p>
                <p class="title-ko">` + d["title-ko"] + `</p>
                <p class="title-ja">` + d["title"] + `</p>
            </li>`;
        target.innerHTML += (content);
    }

    if (tnum != null) {
        loadTitleContent(tnum);
    }
}

async function loadTitleContent(num) {
    const response = await fetch("../../src/data/title/" + num + ".json");
    const raw = await response.json();

    const buttons = document.getElementById("list-arcade").children;
    console.log(buttons.length);
    for (var i = 0; i < buttons.length; i++) {
        const b = buttons[i];
        if (b.dataset.number === String(num)) {
            b.classList.add("selected");
        } else {
            b.classList.remove("selected");
        }
    }

    const t_h2 = `<h2>` + raw["title"] + `</h2>`;

    const target = document.getElementById("title-frame");
    target.innerHTML += t_h2;
}