"use strict";
/* eslint-disable jsdoc/require-jsdoc */

let activePage = null;

function loadPage(name) {
    switch(name) {
        case "dashboard" : document.createElement("dash-board"); break;
        case "alarmconsole" : document.createElement("alarm-console"); break;
        case "alerting" : break;
        case "metrics" : break;
    }
}

//
// Main page Javascript handler
//
document.addEventListener("DOMContentLoaded", async() => {
    // Load current module
    const currPage = new URL(window.location).searchParams.get("page");

    if (currPage === null) {
        loadPage(currPage);
    }
    else {
        const menu = document.querySelector(`nav ul > li[data-menu='${currPage}']`);
        menu.classList.add("active");
        loadPage(currPage);
    }

    // Add Scoped menuEventClick (the goal is to GC the function at the end of the scope).
    function menuEventClick() {
        const currPage = this.getAttribute("data-menu");
        if (currPage === activePage) {
            return;
        }
        const activeMenu = document.querySelector(`nav ul > li[data-menu='${activePage}']`);
        activeMenu.classList.remove("active");
        this.classList.add("active");

        loadPage(currPage);
    }

    // Add navigation events
    const listOfMenus = document.querySelectorAll("nav ul > li:not(.disabled)");
    for (const menu of listOfMenus) {
        menu.addEventListener("click", menuEventClick);
    }
});
