function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}
const content = {
    ru: {
        title: "Junior разработчик • Python / C++ / Web",
        cta: "Смотреть проекты"
    },
    en: {
        title: "Junior Developer • Python / C++ / Web",
        cta: "View projects"
    }
};

function setLang(lang) {
    document.getElementById("title").textContent = content[lang].title;
    document.getElementById("cta").textContent = content[lang].cta;
}