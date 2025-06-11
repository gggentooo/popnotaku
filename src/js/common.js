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
            <a href="https://popnotaku.lnaba.reisen/">홈으로</a>
        </nav>
        `;

    document.getElementsByTagName('footer')[0].innerHTML = `
        <small>Pop'n Music © Konami Digital Entertainment Co., Ltd</small>
        <small>본 사이트는 팬메이드로, 원작자 및 공식 유통자와 연관되어 있지 않습니다. <a href="mailto:d@lnaba.reisen">사이트 운영: D</a></small>
        `;
});

function langOpenClose(target_lang) {
    var target_elems = document.getElementsByClassName(target_lang);
    for (var i = 0; i < target_elems.length; i++) {
        target_elems[i].classList.toggle("hide");
    }
}
