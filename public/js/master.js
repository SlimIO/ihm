let activePage = null;

function menuEventClick() {
    const currPage = this.getAttribute("data-menu");
    if (currPage === activePage) {
        return;
    }
    const activeMenu = document.querySelector(`.menu > li[data-menu='${activePage}']`);
    activeMenu.classList.remove("active");
    this.classList.add("active");

    loadPage(currPage).catch(console.error);
}

async function loadPage(name) {
    const mainElement = document.getElementById("view");

    const HTMLContent = await fetch(`/module/${name}`).then((raw) => raw.text());
    mainElement.innerHTML = HTMLContent;

    activePage = name;
}

document.addEventListener("DOMContentLoaded", () => {
    {
        const activeMenu = document.querySelector(".menu > li.active");
        loadPage(activeMenu.getAttribute("data-menu")).catch(console.error);

        const listOfMenus = document.querySelectorAll(".menu > li:not(.disabled)");
        for (const menu of listOfMenus) {
            menu.addEventListener("click", menuEventClick);
        }
    }
});
