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
        <a href="mailto:d@lnaba.reisen">사이트 운영: D</a>
        `;
});

function langOpenClose(target_lang) {
    var target_elems = document.getElementsByClassName(target_lang);
    for (var i = 0; i < target_elems.length; i++) {
        target_elems[i].classList.toggle("hide");
    }
}
