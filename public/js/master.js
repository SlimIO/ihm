let activePage = null;

function navEventOpen() {
    const elementChildIcon = this.childNodes[1];
    const navElement = document.getElementsByTagName("nav")[0];

    const isNavigationOpen = navElement.classList.contains("open");
    elementChildIcon.classList.add(isNavigationOpen ? "icon-right-open" : "icon-left-open");
    elementChildIcon.classList.remove(isNavigationOpen ? "icon-left-open" : "icon-right-open");
    navElement.classList.toggle("open");
}

function menuEventClick(event) {
    const currPage = this.getAttribute("data-menu");
    if (currPage === activePage) {
        return;
    }
    loadPage(currPage);
}

function loadPage(name) {
    activePage = name;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("open-nav-btn").addEventListener("click", navEventOpen);
    {
        const activeMenu = document.querySelector(".menu.active");
        loadPage(activeMenu.getAttribute("data-menu"));

        const listOfMenus = document.querySelectorAll(".menu:not(.disable)");
        for (const menu of listOfMenus) {
            menu.addEventListener("click", menuEventClick);
        }
    }
});
