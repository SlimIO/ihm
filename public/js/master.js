async function dashboard() {
    const addons = await fetch("/addons").then((raw) => raw.json());
    console.log(addons);

    const addonsTable = document.querySelector("#addons_table > tbody");
    for (const addon of addons) {
        const row = addonsTable.insertRow();
        const start = new Date(addon.lastStart).toISOString();
        const stop = addon.lastStop === null ? "N/A" : new Date(addon.lastStop).toISOString();

        row.insertCell(0);
        row.insertCell(1).appendChild(document.createTextNode(addon.name));
        const tdVer = row.insertCell(2);
        tdVer.classList.add("center");
        tdVer.appendChild(document.createTextNode(addon.version));

        const tdContainer = row.insertCell(3);
        tdContainer.classList.add("center");
        tdContainer.appendChild(document.createTextNode(addon.containerVersion));

        row.insertCell(4).appendChild(document.createTextNode(start));
        row.insertCell(5).appendChild(document.createTextNode(stop));
    }

    // Chart test
    const ctx = document.getElementById("test").getContext("2d");
    new Chart(ctx, {
        // The type of chart we want to create
        type: "pie",

        // The data for our dataset
        data: {
            labels: ["User", "Nice", "Sys", "IRQ", "Idle"],
            datasets: [{
                data: [15, 20, 30, 2, 48],
                backgroundColor: ["#06F", "#81C784", "#FFCA28", "#E53935", "#CFD8DC"]
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function alarmconsole() {
    console.log("alarmconsole js code!");
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
        // The type of chart we want to create
        type: "line",

        // The data for our dataset
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: [0, 10, 5, 2, 20, 30, 45]
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function metrics() {
    console.log("metrics js code!");
}

let activePage = null;
const pageExecutor = { dashboard, alarmconsole, metrics };

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
    if (Reflect.has(pageExecutor, name)) {
        try {
            await pageExecutor[name]();
        }
        catch (err) {
            console.error(err);
        }
    }

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
