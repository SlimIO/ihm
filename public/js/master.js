/* eslint-disable jsdoc/require-jsdoc */

window.activePage = null;

function loadPage(name) {
    switch (name) {
        case "dashboard":
            document.createElement("dash-board");
            break;
        case "alarmconsole":
            document.createElement("alarm-console");
            break;
        case "alerting": break;
        case "metrics": break;
    }
}

const currPage = new URL(window.location).searchParams.get("page");

if (currPage === null) {
    loadPage("dashboard");
}
else {
    const menu = document.querySelector(`nav ul > li[data-menu='${currPage}']`);
    menu.classList.add("active");
    loadPage(currPage);
}

// Add Scoped menuEventClick (the goal is to GC the function at the end of the scope).
function menuEventClick() {
    const currentRequestedPage = this.getAttribute("data-menu");
    if (currentRequestedPage !== activePage) {
        document.querySelector(`nav ul > li[data-menu='${activePage}']`).classList.remove("active");
        this.classList.add("active");
        loadPage(currentRequestedPage);
    }
}

// Add navigation events
document.querySelectorAll("nav ul > li:not(.disabled)")
    .forEach((menu) => menu.addEventListener("click", menuEventClick));

