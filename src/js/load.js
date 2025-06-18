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
    target.innerHTML = `<small id="loading">로딩 중...</small>`;

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
            // const response_individualjson = await fetch(`../../src/data/song/detail/` + entry["id"] + `_` + entry["slug"] + `.json`);
            // const song_raw = await response_individualjson.json();
            var class_name = "";
            // if (song_raw[0]["finished-backup"] === true) { class_name = "has-data"; }

            var element = `
                <li class="` + class_name + `" onclick="location.href='../song/?s=` + entry["id"] + `'" data-title='` + entry["fw-title"] + `' data-genre='` + entry["fw-genre"] + `' data-artist='` + entry["artist"] + `' data-chara='` + entry["chara"] + `'>
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

    target.innerHTML += `<em>! 본 문구가 보이는 경우 해당 작품의 상세 정보 백업이 완료되지 않은 상태입니다.</em>`;

    const loading = document.getElementById("loading");
    loading.classList.add("hide");
}

async function loadSongPage(num) {
    const response_allsongsjson = await fetch("../../src/data/song/all.json");
    const songs_raw = await response_allsongsjson.json();
    var idxdata = {};
    var do_not_load = false;
    var failed_songsearch = true;

    for (var i = 0; i < songs_raw.length; i++) {
        const entry = songs_raw[i];
        if (entry["id"] === num) {
            idxdata = entry;
            failed_songsearch = false;
            break;
        }
    }

    const target = document.getElementById("song-content");
    target.innerHTML = ``;

    if (failed_songsearch) {
        target.innerHTML += `<em>404: 요청하신 ID의 곡 정보를 찾지 못했습니다.</em>`;
        return;
    }

    const return_button = `<button onclick="location.href='../title/?t=` + idxdata["debut"] + `'">⇐작품 페이지로 돌아가기</button>`
    target.innerHTML += return_button;

    var basic_info = `
        <p class="genre">` + idxdata["genre"] + `</p>
        <h1>` + idxdata["title"] + `</h1>
        <section>
            <h2 id="base-info">기본 정보<button class="fold" onclick="foldSection('base-info')">단락 접기/펼치기</button></h2>
            <div class="baseinfo-wrap">
                <div class="baseinfo-lr"><span>추가작</span><span>` + idxdata["debut"] + `</span></div>
                <div class="baseinfo-lr"><span>아티스트</span><span>` + idxdata["artist"] + `</span></div>
                <div class="baseinfo-lr"><span>담당 캐릭터</span><span>` + idxdata["chara"] + `</span></div>
                <a href="https://remywiki.com/` + idxdata["remy"] + `" target="_blank">RemyWiki 바로가기</a>
            </div>
    `;

    const response_individualjson = await fetch(`../../src/data/song/detail/` + idxdata["id"] + `_` + idxdata["slug"] + `.json`);
    const content_raw = await response_individualjson.json();

    if (content_raw[0]["finished-backup"] === false) {
        target.innerHTML += `<em>! 본 문구가 보이는 경우 해당 악곡의 상세 정보 백업이 이루어지지 않은 상태입니다.</em>`;
        do_not_load = true;
    }
    if (content_raw[0]["finished-translate"] === false) {
        target.innerHTML += `<em>! 본 문구가 보이는 경우 해당 악곡의 상세 정보의 번역이 완료되지 않은 상태입니다.</em>`;
    }

    var source_links = `<ul class="source-links">`
    if (content_raw[0]["source-translation"] != "") {
        source_links += `<li>번역 출처: ` + content_raw[0]["source-translation"] + `</li>`;
    }
    if (content_raw[0]["source-original"][0]["link"] != "") {
        for (var i = 0; i < content_raw[0]["source-original"].length; i++) {
            source_links += `<li class="source-link">원문 출처: <a href="` + content_raw[0]["source-original"][i]["link"] + `" target="_blank">` + content_raw[0]["source-original"][i]["description"] + `</a></li>`;
        }
    }
    source_links += `</ul>`;

    var nav_links = `<ul class="nav-links">`
    for (var i = 1; i < content_raw.length; i++) {
        const section_raw = content_raw[i];
        const cont_arr = section_raw["section-content"];
        if (cont_arr.length === 0 || cont_arr[0]["entry-content"] === "") {
            continue;
        } else {
            nav_links += `<li><a href="` + section_raw["section-id"] + `">` + section_raw["section-display-name"] + `</a></li>`;
        }
    }
    nav_links += `</ul>`;

    basic_info += source_links;
    basic_info += nav_links;
    basic_info += `</section>`;
    target.innerHTML += basic_info;

    if (do_not_load) { return; }

    for (var i = 1; i < content_raw.length; i++) {
        const section_raw = content_raw[i];
        const cont_arr = section_raw["section-content"];
        if (cont_arr.length === 0 || cont_arr[0]["entry-content"] === "") {
            continue;
        }
        var section_content = `
            <section>
                <h2 id="` + section_raw["section-id"] + `">` + section_raw["section-display-name"] + `<button class="fold" onclick="foldSection('` + section_raw["section-id"] + `')">단락 접기/펼치기</button></h2>
        `;

        for (var j = 0; j < cont_arr.length; j++) {
            const cont_entry = cont_arr[j];
            const content_author = cont_entry["entry-author"];
            const content_ja = cont_entry["entry-content"];
            const content_ko = cont_entry["entry-content-ko"];

            if (section_raw["type"] === "section-staff") {
                section_content += `<section class="staff-comment-content"><h3 class="signature">` + content_author + `</h3><p class="ko">` + content_ko + `</p><p class="ja">` + content_ja + `</p></section>`;
            } else {
                section_content += `<p class="ko">` + content_ko + `</p><p class="ja">` + content_ja + `</p>`;
                if (content_author != "") { section_content += `<span class="signature">` + content_author + `</span>`; }
            }
        }

        section_content += `</section>`;
        target.innerHTML += section_content;
    }
}