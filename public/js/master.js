"use strict";
/* eslint-disable jsdoc/require-jsdoc */

// TODO: Remove executors... (they are not good for flexibility).
// Keep it simple

// CONSTANT
const SEVERITIES = new Map([
    [0, "Critical"],
    [1, "Major"],
    [2, "Minor"]
]);

async function dashboard() {
    const editModeBtn = document.getElementById("edit_mode_btn");
    editModeBtn.addEventListener("click", () => {
        const widgetAdd = document.querySelector(".widget-add");
        widgetAdd.style.display = "flex";
    });

    const dashboard = await fetch("/dashboard").then((raw) => raw.json());
    const widgetsContainer = document.getElementById("widgets_container");
    const fragment = document.createDocumentFragment();

    for (const widget of dashboard) {
        const widgetElement = document.createElement("dashboard-widget");

        if (Reflect.has(widget.settings, "size")) {
            const size = widget.settings.size;
            if (size === "low") {
                widgetElement.setAttribute("class", "size-low");
            }
        }
        widgetElement.setAttribute("name", widget.settings.name);
        widgetElement.setAttribute("type", widget.type);
        widgetElement.setAttribute("icon", widget.settings.icon);
        widgetElement.dispatchEvent(new Event("init"));

        fragment.appendChild(widgetElement);
    }
    widgetsContainer.appendChild(fragment);
}

async function alarmconsole() {
    const alarms = await fetch("/alarms").then((raw) => raw.json());

    const sevCount = { 0: 0, 1: 0, 2: 0 };
    for (const { severity } of alarms) {
        sevCount[severity]++;
    }

    createChart("severities", {
        type: "bar",
        data: {
            labels: ["Critical", "Major", "Minor"],
            datasets: [{
                data: [...Object.values(sevCount)],
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
            data: [alarms.length]
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

    const fragment = document.createDocumentFragment();
    for (const alarm of alarms) {
        const elAlarm = document.createElement("alarm-row");
        elAlarm.setAttribute("uuid", alarm.uuid);
        elAlarm.setAttribute("severity", SEVERITIES.get(alarm.severity).toLowerCase());
        elAlarm.initialize(alarm);

        fragment.appendChild(elAlarm);
    }
    document.querySelector(".alarms").appendChild(fragment);
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
