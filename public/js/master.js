/* eslint-disable jsdoc/require-jsdoc */

window.activePage = null;

function loadPage(name) {
    switch (name) {
        case "dashboard":
            console.log("dashboard 1");
            document.createElement("dash-board");
            console.log("dashboard 2");
            break;
        case "alarmconsole":
            document.createElement("alarm-console");
            break;
        case "alerting": break;
        case "metrics": break;
    }
}

// document.addEventListener("DOMContentLoaded", () => {
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

            console.log("cliked !");
            loadPage(currentRequestedPage);
        }
    }

    // Add navigation events
    document.querySelectorAll("nav ul > li:not(.disabled)")
        .forEach((menu) => menu.addEventListener("click", menuEventClick));

    console.log("loaded !");
// });
