"use strict";
/* eslint-disable jsdoc/require-jsdoc */

// TODO: Remove executors... (they are not good for flexibility).
// Keep it simple

async function dashboard() {
    const editModeBtn = document.getElementById("edit_mode_btn");
    editModeBtn.addEventListener("click", () => {
        const widgetAdd = document.querySelector(".widget-add");
        widgetAdd.style.display = "flex";
    });

    // const addons = await fetch("/addons").then((raw) => raw.json());
    // // console.log(addons);

    // const addonsTable = document.querySelector("#addons_table > tbody");
    // for (const addon of addons) {
    //     const row = addonsTable.insertRow();

    //     const start = formatDate(addon.lastStart);
    //     const stop = addon.lastStop === null ? "N/A" : formatDate(addon.lastStop);

    //     const stateTd = row.insertCell(0);
    //     const stateBull = createFastElement("div", { classList: ["state"] });
    //     stateBull.appendChild(createFastElement("i", { classList: ["icon-ok"] }));
    //     stateTd.appendChild(stateBull);

    //     row.insertCell(1).appendChild(document.createTextNode(addon.name));
    //     const tdVer = row.insertCell(2);
    //     tdVer.classList.add("center");
    //     tdVer.appendChild(document.createTextNode(addon.version));

    //     const tdContainer = row.insertCell(3);
    //     tdContainer.classList.add("center");
    //     tdContainer.appendChild(document.createTextNode(addon.containerVersion));

    //     row.insertCell(4).appendChild(document.createTextNode(start));
    //     row.insertCell(5).appendChild(document.createTextNode(stop));

    //     const gearTd = row.insertCell(6);
    //     gearTd.appendChild(createFastElement("i", { classList: ["icon-cog"] }));
    // }
}

async function alarmconsole() {
    createChart("severities", {
        type: "bar",
        data: {
            labels: ["Critical", "Major", "Minor"],
            datasets: [{
                data: [2, 10, 24],
                backgroundColor: ["#E53935", "#FFC107", "#03A9F4"]
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Alarm Severities"
            }
        }
    });

    const ctxOvertime = document.getElementById("overtime").getContext("2d");
    new Chart(ctxOvertime, {
        // The type of chart we want to create
        type: "line",

        // The data for our dataset
        datasets: {
            data: []
        },

        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Alarm Count"
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

let activePage = null;
const pageExecutor = { dashboard, alarmconsole };

async function loadPage(name) {
    const mainElement = document.getElementById("view");

    const HTMLContent = await fetch(`/module/${name}`).then((raw) => raw.text());
    mainElement.innerHTML = HTMLContent;
    if (Reflect.has(pageExecutor, name)) {
        try {
            await pageExecutor[name]();
        }
        catch (err) {
            console.error(err);
        }
    }

    // Setup new URL location
    const currUrl = new URL(window.location);
    currUrl.searchParams.delete("page");
    currUrl.searchParams.set("page", name);
    window.history.pushState("page", "Title", currUrl.href);
    activePage = name;
}

//
// Main page Javascript handler
//
document.addEventListener("DOMContentLoaded", async() => {
    // Load current module
    try {
        const currPage = new URL(window.location).searchParams.get("page");

        if (currPage === null) {
            await loadPage("dashboard");
        }
        else {
            const menu = document.querySelector(`nav ul > li[data-menu='${currPage}']`);
            menu.classList.add("active");
            await loadPage(currPage);
        }
    }
    catch (err) {
        console.error(err);
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

        loadPage(currPage).catch(console.error);
    }

    // Add navigation events
    const listOfMenus = document.querySelectorAll("nav ul > li:not(.disabled)");
    for (const menu of listOfMenus) {
        menu.addEventListener("click", menuEventClick);
    }
});
