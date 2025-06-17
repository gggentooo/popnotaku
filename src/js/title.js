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
    const response_titlejson = await fetch("../../src/data/title/" + num + ".json");
    const raw = await response_titlejson.json();

    const response_allsongsjson = await fetch("../../src/data/song/all.json");
    const songs_raw = await response_allsongsjson.json();

    const buttons = document.getElementById("list-arcade").children;
    for (var i = 0; i < buttons.length; i++) {
        const b = buttons[i];
        if (b.dataset.number === String(num)) {
            b.classList.add("selected");
        } else {
            b.classList.remove("selected");
        }
    }

    const target = document.getElementById("title-frame");

    const t_top = `
        <h2>` + raw["title"] + `</h2>
        <div class="info">
            <span class="title-ko">` + raw["title-ko"] + `</span>
            <span class="release">` + raw["release"] + `</span>
        </div>`;
    target.innerHTML += t_top;

    const subsection_songs = document.createElement("section");
    subsection_songs.innerHTML += `<h3 id="m_c">수록곡<button class="fold" onclick="foldSection('m_c')">단락 접기/펼치기</button></h3>`;
    var songlist = `<ul class="song-list">`;
    for (var i = 0; i < songs_raw.length; i++) {
        entry = songs_raw[i];
        if (entry["debut"] === num.toString()) {
            element = `
                <li onclick="location.href='./?t=` + num + `&s=` + entry["id"] + `'" data-title='` + entry["fw-title"] + `' data-genre='` + entry["fw-genre"] + `' data-artist='` + entry["artist"] + `' data-chara='` + entry["chara"] + `'>
                    <span class="genre">` + entry["genre"] + `</span>    
                    <span class="r-title">` + entry["r-title"] + `</span>
                    <span class="title">` + entry["title"] + `</span>
                    <span class="artist">` + entry["artist"] + `</span>
                </li>
            `;
            songlist += element;
        }
    }
    songlist += `</ul>`;
    subsection_songs.innerHTML += songlist;

    // const raw_songs = raw["songs"];
    // for (var i = 0; i < raw_songs.length; i++) {
    //     const raw_category = raw_songs[i];
    //     const song_h2 = `<h3 id="` + raw_category["category"] + `">` + raw_category["category-display"] + `</h3>`;
    //     const raw_list = raw_category["list"];
    //     var songlist = `<ul>`;
    //     for (var j = 0; j < raw_list.length; j++) {
    //         const songid = raw_list[j];
    //         songlist += `<li onclick="location.href='./?t=` + num + `&s=` + songid + `'">` + songid + `</li>`;
    //     }
    //     songlist += `</ul>`;
    //     subsection_songs.innerHTML += song_h2;
    //     subsection_songs.innerHTML += songlist;
    // }

    target.appendChild(subsection_songs);
}