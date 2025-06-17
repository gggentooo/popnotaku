/*
load.js
gggentooo, 250616

functions used in the title page
*/

async function loadTitles(a) {
    const response = await fetch(a);
    const raw = await response.json();

    const target = document.getElementById("list-arcade");

    for (var i = 0; i < raw.length; i++) {
        const d = raw[i];
        const content = `<li data-number='` + d["number"] + `' onclick='loadTitleContent(` + d["number"] + `)'>
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
    if ('URLSearchParams' in window) {
        const url = new URL(window.location);
        url.searchParams.set("t", num);
        history.pushState(null, '', url);
    }

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
    target.innerHTML = "";

    const t_top = `
        <h2>` + raw["title"] + `</h2>
        <div class="info">
            <span class="title-ko">` + raw["title-ko"] + `</span>
            <span class="release">` + raw["release"] + `</span>
        </div>`;
    target.innerHTML += t_top;

    const subsection_songs = document.createElement("section");
    subsection_songs.innerHTML += `<h3 id="m_c">수록곡<button class="fold" onclick="foldSection('m_c')">단락 접기/펼치기</button></h3>
        <small>상하 스크롤 가능 | 타일 클릭 시 악곡 상세 페이지로 이동됩니다.</small>`;
    var songlist = `<ul class="song-list">`;
    for (var i = 0; i < songs_raw.length; i++) {
        entry = songs_raw[i];
        if (entry["debut"] === num.toString()) {
            element = `
                <li onclick="location.href='../song/?s=` + entry["id"] + `'" data-title='` + entry["fw-title"] + `' data-genre='` + entry["fw-genre"] + `' data-artist='` + entry["artist"] + `' data-chara='` + entry["chara"] + `'>
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

    target.appendChild(subsection_songs);
    target.innerHTML += `<small>본 문구가 보이는 경우 해당 작품의 상세 정보 백업이 완료되지 않은 상태입니다.</small>`;
}

async function loadSongPage(num) {
    const response_allsongsjson = await fetch("../../src/data/song/all.json");
    const songs_raw = await response_allsongsjson.json();
    var idxdata = {};

    for (var i = 0; i < songs_raw.length; i++) {
        const entry = songs_raw[i];
        if (entry["id"] === num) {
            idxdata = entry;
        }
    }

    const target = document.getElementById("song-content");
    target.innerHTML = "";

    const return_button = `<button onclick="location.href='../title/?t=` + idxdata["debut"] + `'">⇐작품 페이지로 돌아가기</button>`
    target.innerHTML += return_button;

    const basic_info = `
        <p class="genre">` + idxdata["genre"] + `</p>
        <h1>` + idxdata["title"] + `</h1>
        <h2>기본 정보</h2>
        <div class="baseinfo-wrap">
            <div class="baseinfo-lr"><span>추가작</span><span>` + idxdata["debut"] + `</span></div>
            <div class="baseinfo-lr"><span>아티스트</span><span>` + idxdata["artist"] + `</span></div>
            <div class="baseinfo-lr"><span>담당 캐릭터</span><span>` + idxdata["chara"] + `</span></div>
            <a href="https://remywiki.com/` + idxdata["remy"] + `" target="_blank">RemyWiki 바로가기</a>
        </div>
    `;

    target.innerHTML += basic_info;

    target.innerHTML += `<small>본 문구가 보이는 경우 해당 악곡의 상세 정보 백업이 이루어지지 않은 상태입니다.</small>`;
}