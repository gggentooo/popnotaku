/*
common.js
gggentooo, 250416

functions used in all pages
*/

function toggleDark() {
    let isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark');
    }

    document.getElementsByTagName('header')[0].innerHTML = `
        <span class="pagetitle" onclick="location.href='https://popnotaku.lnaba.reisen/'">popnotaku</span>
        <button class="darkmode" onclick="toggleDark()">다크 모드 켜기/끄기</button>
        <nav>
            <a href="https://popnotaku.lnaba.reisen/">홈</a>
            <a href="https://popnotaku.lnaba.reisen/title/?t=1">작품 일람</a>
            <a href="https://popnotaku.lnaba.reisen/song/">곡 일람</a>
            <a href="https://popnotaku.lnaba.reisen/chara/">캐릭터</a>
        </nav>
        `;

    document.getElementsByTagName('footer')[0].innerHTML = `
        <small>Pop'n Music © Konami Digital Entertainment Co., Ltd</small>
        <small>본 사이트는 팬메이드로, 원작자 및 공식 유통자와 연관되어 있지 않습니다. <a href="mailto:d@lnaba.reisen">사이트 운영: D</a></small>
        <small><a href="https://github.com/gggentooo/popnotaku" target="_blank" title="깃허브: popnotaku 소스 리포지토리">사이트 소스</a></small>
        `;

    const absolute_buttons = document.createElement("div");
    absolute_buttons.classList.add("buttons-absolute");
    absolute_buttons.innerHTML = `<button onclick="scrollToTop();">페이지 상단으로</button>
        <button onclick="langOpenClose('ja')">원문 보기/숨기기</button>`;
    document.querySelector('body').append(absolute_buttons);
});

function langOpenClose(target_lang) {
    var target_elems = document.getElementsByClassName(target_lang);
    for (var i = 0; i < target_elems.length; i++) {
        target_elems[i].classList.toggle("hide");
    }
}

function foldSection(id) {
    const section = document.getElementById(id).parentElement;
    for (var i = 1; i < section.children.length; i++) {
        section.children[i].classList.toggle("hide");
    }
}

function scrollToTop() {
    window.scrollTo(0, 0);
}
