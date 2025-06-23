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

    target.appendChild(loadSongList(songs_raw, num));

    target.innerHTML += `<em class="alert backup">! 본 문구가 보이는 경우 해당 작품의 상세 정보 백업이 완료되지 않은 상태입니다.</em>`;

    const loading = document.getElementById("loading");
    loading.classList.add("hide");
}

function loadSongList(songs_raw, titlenum) {
    const subsection_songs = document.createElement("section");
    subsection_songs.innerHTML += `<h3 id="m_c">곡 목록<button class="fold" onclick="foldSection('m_c')">단락 접기/펼치기</button></h3>
        <small>상하 스크롤로 더 많은 항목을 열람할 수 있습니다.<br>타일 클릭 시 악곡 상세 페이지로 이동됩니다.<br>아래 버튼을 이용해 정렬 방식을 바꿀 수 있습니다.<br>곡 상세 정보의 백업이 완료되지 않은 경우에는 타일이 옅은 색으로 표시되며, 모든 백업 및 번역이 완료된 곡은 타일의 테두리가 겹선으로 표시됩니다.</small>
        <div class="sort-button-wrap">
            <button onclick="sortSongs('id');">ID</button>
            <button onclick="sortSongs('title');">제목</button>
            <button onclick="sortSongs('genre');">장르</button>
            <button onclick="sortSongs('artist');">아티스트</button>
            <button onclick="sortSongs('chara');">캐릭터</button>
        </div>
        `;
    var songlist = `<ul class="song-list" id="song-list">`;
    for (var i = 0; i < songs_raw.length; i++) {
        entry = songs_raw[i];
        if (titlenum === null || entry["debut"] === titlenum.toString()) {
            var class_name = "";
            if (entry["finished-backup"] === true) { class_name = "has-data"; }
            if (entry["finished-translate"] === true) { class_name += " translated"; }

            var element = `
                <li class="` + class_name + `" onclick="location.href='../song/?s=` + entry["id"] + `'" data-id='` + entry["id"] + `' data-original='` + entry["is-original"] + `' data-title='` + entry["fw-title"] + `' data-genre='` + entry["fw-genre"] + `' data-artist='` + entry["artist"] + `' data-chara='` + entry["chara"] + `'>
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

    return subsection_songs;
}

function sortSongs(what) {
    var categoryItems = document.querySelectorAll("[data-" + what + "]");
    var categoryItemsArray = Array.from(categoryItems);

    let sorted = categoryItemsArray.sort(sorter);

    function sorter(a, b) {
        return a.dataset[what].localeCompare(b.dataset[what]);
    }

    sorted.forEach(e => document.querySelector("#song-list").appendChild(e))
}

function sortChara(what) {
    var categoryItems = document.querySelectorAll("[data-" + what + "]");
    var categoryItemsArray = Array.from(categoryItems);

    let sorted = categoryItemsArray.sort(sorterName);
    sorted = categoryItemsArray.sort(sorter);

    function sorter(a, b) {
        return a.dataset[what].localeCompare(b.dataset[what], undefined, { numeric: true, sensitivity: 'base' });
    }
    function sorterName(a, b) {
        return a.dataset["name"].localeCompare(b.dataset["name"]);
    }

    sorted.forEach(e => document.querySelector("#chara-list").appendChild(e))
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
        target.innerHTML += `<em><a href="../title/?t=1">작품 일람 페이지</a>에서 작품별 수록곡을 모아 열람할 수 있습니다.</em>`;
        target.appendChild(loadSongList(songs_raw, null));
        return;
    }

    const return_button = `<button onclick="location.href='../title/?t=` + idxdata["debut"] + `'">⇐작품 페이지로 돌아가기</button>`
    target.innerHTML += return_button;

    var basic_info = `
        <p class="genre">` + idxdata["genre"] + `</p>
        <h1>` + idxdata["title"] + `</h1>
        <section>
            <h2 id="base-info">기본 정보</h2>
            <div class="baseinfo-wrap">
                <div class="baseinfo-lr"><span>추가작</span><span><a href="../title/?t=` + idxdata["debut"] + `">` + idxdata["debut"] + `</a></span></div>
                <div class="baseinfo-lr"><span>아티스트</span><span>` + idxdata["artist"] + `</span></div>
                <div class="baseinfo-lr"><span>담당 캐릭터</span><span><a href="../chara/?c=` + idxdata["chara"] + `">` + idxdata["chara"] + `</a></span></div>
                <a href="https://remywiki.com/` + idxdata["remy"] + `" target="_blank">RemyWiki 바로가기</a>
            </div>
    `;

    const response_individualjson = await fetch(`../../src/data/song/detail/` + idxdata["id"] + `_` + idxdata["slug"] + `.json`);
    const content_raw = await response_individualjson.json();

    if (idxdata["finished-backup"] === false) {
        target.innerHTML += `<em class="alert backup">! 본 문구가 보이는 경우 해당 악곡의 상세 정보 백업이 이루어지지 않은 상태입니다.</em>`;
        do_not_load = true;
    }
    if (idxdata["finished-translate"] === false) {
        target.innerHTML += `<em class="alert translate">! 본 문구가 보이는 경우 해당 악곡의 상세 정보의 번역이 완료되지 않은 상태입니다.</em>`;
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
            nav_links += `<li><a href="#` + section_raw["section-id"] + `">` + section_raw["section-display-name"] + `</a></li>`;
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

async function loadChara(querystr) {
    const response = await fetch("../../src/data/chara/all.json");
    const charlist_raw = await response.json();
    var chardata_raw = {};
    var failed_charasearch = true;
    var do_not_load = false;

    for (var i = 0; i < charlist_raw.length; i++) {
        const entry = charlist_raw[i];
        if (entry["name-dat"] === querystr) {
            chardata_raw = entry;
            failed_charasearch = false;
            break;
        }
    }

    const target = document.getElementById("chara-content");
    target.innerHTML = ``;

    if (failed_charasearch) {
        target.appendChild(loadCharaList(charlist_raw));
        sortChara("debut");
        return;
    }

    const return_button = `<button onclick="location.href='../chara/'">⇐전체 캐릭터 일람으로 돌아가기</button>`
    target.innerHTML += return_button;

    if (chardata_raw["finished-backup"] === false) {
        target.innerHTML += `<em class="alert backup">! 본 문구가 보이는 경우 해당 캐릭터의 상세 정보 백업이 이루어지지 않은 상태입니다.</em>`;
        do_not_load = true;
    }
    if (chardata_raw["finished-translate"] === false) {
        target.innerHTML += `<em class="alert translate">! 본 문구가 보이는 경우 해당 캐릭터의 상세 정보의 번역이 완료되지 않은 상태입니다.</em>`;
    }

    var song_list = `<ul class="song-list" id="song-list">`;
    const response_songs = await fetch("../../src/data/song/all.json");
    const songlist_raw = await response_songs.json();
    for (var i = 0; i < songlist_raw.length; i++) {
        const song_entry = songlist_raw[i];
        for (var j = 0; j < chardata_raw["songs"].length; j++) {
            if (song_entry["id"] === chardata_raw["songs"][j]) {
                song_list += `<li data-original='` + song_entry["is-original"] + `' data-genre="` + song_entry["fw-genre"] + `" onclick="location.href='../song/?s=` + song_entry["id"] + `'"><span class="genre">` + song_entry["genre"] + `</span><a href="../song/?s=` + song_entry["id"] + `">` + song_entry["title"] + `</a></li>`;
            }
        }
    }
    song_list += `</ul>`;

    var basic_info = `
        <p class="name-dat">` + chardata_raw["name-dat"] + `</p>
        <h1>` + chardata_raw["name-ja"] + `</h1>
        <span class="name-ko">` + chardata_raw["name-ko"] + `</span>
        <section>
            <h2 id="base-info">기본 정보</h2>
            <div class="baseinfo-wrap">
                <div class="baseinfo-lr"><span>데뷔 작품</span><span><a href="../title/?t=` + chardata_raw["debut"] + `">` + chardata_raw["debut"] + `</a></span></div>
                <div class="baseinfo-lr"><span>캐릭터 디자인</span><span>` + chardata_raw["designer"] + `</span></div>
                <div class="baseinfo-lr"><span>사과 색깔</span><span class="apple apple-` + chardata_raw["apple-color"] + `"></span></div>
                <div class="baseinfo-lr"><span>생일</span><span>` + chardata_raw["birthday"]["month"] + `월 ` + chardata_raw["birthday"]["day"] + `일</span></div>
                <div class="baseinfo-lr"><span>등장 악곡</span><span>` + song_list + `</span></div>
    `;

    if (chardata_raw["see-also"].length > 0) {
        basic_info += `<div class="baseinfo-lr"><span>연관 캐릭터</span><ul class="see-also">`
        const see_also = chardata_raw["see-also"];
        for (var i = 0; i < see_also.length; i++) {
            const other_chara = see_also[i];
            basic_info += `<li><a href="../chara/?c=` + other_chara + `">` + other_chara + `</a></li>`;
        }
        basic_info += `</ul></div>`;
    }

    basic_info += `</div>`;

    if (chardata_raw["source-translation"] != "") {
        basic_info += `<small>번역 출처: ` + chardata_raw["source-translation"] + `</small>`;
    }
    basic_info += `</section>`;

    target.innerHTML += basic_info;
    sortSongs("genre");

    if (do_not_load) { return; }

    var profile = `
        <section class="profile">
            <h2 id="profile">프로필<button class="fold" onclick="foldSection('profile')">단락 접기/펼치기</button></h2>
            <div class="baseinfo-wrap">
                <div class="baseinfo-lr"><span>설명</span><div><span class="ko">` + chardata_raw["profile-ko"]["description"] + `</span><br><span class="ja">` + chardata_raw["profile"]["description"] + `</span></div></div>
                <div class="baseinfo-lr"><span>출신지</span><div><span class="ko">` + chardata_raw["profile-ko"]["from"] + `</span><br><span class="ja">` + chardata_raw["profile"]["from"] + `</span></div></div>
                <div class="baseinfo-lr"><span>취미</span><div><span class="ko">` + chardata_raw["profile-ko"]["hobby"] + `</span><br><span class="ja">` + chardata_raw["profile"]["hobby"] + `</span></div></div>
                <div class="baseinfo-lr"><span>좋아하는 것</span><div><span class="ko">` + chardata_raw["profile-ko"]["likes"] + `</span><br><span class="ja">` + chardata_raw["profile"]["likes"] + `</span></div></div>
                <div class="baseinfo-lr"><span>싫어하는 것</span><div><span class="ko">` + chardata_raw["profile-ko"]["dislikes"] + `</span><br><span class="ja">` + chardata_raw["profile"]["dislikes"] + `</span></div></div>
            </div>
        </section>
    `;
    target.innerHTML += profile;

    var quotes = `
        <section class="quotes">
            <h2 id="quotes">대사<button class="fold" onclick="foldSection('quotes')">단락 접기/펼치기</button></h2>
    `;
    const quotes_raw = chardata_raw["quotes"];
    for (var i = 0; i < quotes_raw.length; i++) {
        const quotedata = quotes_raw[i];
        quotes += `
            <div class="quote">
                <span class="source">` + quotedata["from"] + `</span>
                <p>` + quotedata["content-ko"] + `</p>
                <p class="ja">` + quotedata["content"] + `</p>
            </div>
        `;
    }
    quotes += `</section>`;
    target.innerHTML += quotes;
}

function loadCharaList(charlist_raw) {
    const subsection_charalist = document.createElement("section");
    subsection_charalist.innerHTML += `<h3 id="m_c">캐릭터 목록<button class="fold" onclick="foldSection('m_c')">단락 접기/펼치기</button></h3>
        <small>상하 스크롤로 더 많은 항목을 열람할 수 있습니다.<br>타일 클릭 시 캐릭터 상세 페이지로 이동됩니다.<br>아래 버튼을 이용해 정렬 방식을 바꿀 수 있습니다.</small>
        <div class="sort-button-wrap">
            <button onclick="sortChara('name');">이름</button>
            <button onclick="sortChara('debut');">데뷔 작품</button>
            <button onclick="sortChara('apple');">사과 색깔</button>
        </div>
        `;
    var charalist = `<ul class="chara-list" id="chara-list">`;
    for (var i = 0; i < charlist_raw.length; i++) {
        entry = charlist_raw[i];
        var element = `
                <li class="apple-` + entry["apple-color"] + `" onclick="location.href='../chara/?c=` + entry["name-dat"] + `'" data-name='` + entry["name-dat"] + `' data-debut='` + entry["debut"] + `'data-apple='` + entry["apple-color"] + `'>
                    <span class="debut">` + entry["debut"] + `</span>    
                    <span class="name-dat">` + entry["name-dat"] + `</span>
                </li>
            `;
        charalist += element;
    }
    charalist += `</ul>`;
    subsection_charalist.innerHTML += charalist;

    return subsection_charalist;
}