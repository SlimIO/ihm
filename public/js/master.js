"use strict";
/* eslint-disable jsdoc/require-jsdoc */

// TODO: Remove executors... (they are not good for flexibility).
// Keep it simple

// CONSTANT
const SEVERITIES = new Map([
    [1, "Critical"],
    [2, "Major"],
    [3, "Minor"]
]);
const TWO_HOUR_MS = 2 * 60 * 60 * 1000;

async function dashboard() {
    const editModeBtn = document.getElementById("edit_mode_btn");
    editModeBtn.addEventListener("click", () => {
        const widgetAdd = document.querySelector(".widget-add");
        widgetAdd.style.display = "flex";
    });
}

async function alarmconsole() {
    const alarms = await fetch("/alarms").then((raw) => raw.json());

    const sevCount = { 1: 0, 2: 0, 3: 0 };
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
        elAlarm.setAttribute("severity", SEVERITIES.get(alarm.severity));

        const messageElement = createFastElement("span", {
            attributes: { slot: "message" }, text: alarm.message
        });

        const entityElement = createFastElement("span", {
            attributes: { slot: "entity" }, text: alarm.entity_name
        });

        const ckElement = createFastElement("span", {
            attributes: { slot: "ck" }, text: alarm.correlate_key
        });

        const occurElement = createFastElement("span", {
            attributes: { slot: "occurence" }, text: alarm.occurence
        });

        const startElement = createFastElement("span", {
            attributes: { slot: "start_date" }, text: formatDate(alarm.createdAt)
        });
        const updateTs = new Date(alarm.updatedAt).getTime();
        const elapsed = (Date.now() - TWO_HOUR_MS - updateTs) / 1000;

        const sinceElement = createFastElement("span", {
            attributes: { slot: "since" }, text: `${elapsed.toFixed(1)} sec`
        });

        elAlarm.appendChild(entityElement);
        elAlarm.appendChild(messageElement);
        elAlarm.appendChild(ckElement);
        elAlarm.appendChild(occurElement);
        elAlarm.appendChild(startElement);
        elAlarm.appendChild(sinceElement);

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
