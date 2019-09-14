"use strict";

/**
 * @function load
 */
async function load() {
    const addons = await fetch("/addons").then((raw) => raw.json());

    const addonsTable = document.querySelector("[name='Addons']");
    const tbody = addonsTable.shadowRoot.querySelector("table > tbody");
    for (const addon of addons) {
        const row = tbody.insertRow();

        const start = formatDate(addon.lastStart);
        const stop = addon.lastStop === null ? "N/A" : formatDate(addon.lastStop);

        const stateTd = row.insertCell(0);
        const stateBull = createFastElement("div", { classList: ["state"] });
        stateBull.appendChild(createFastElement("i", { classList: ["icon-ok"] }));
        stateTd.appendChild(stateBull);

        row.insertCell(1).appendChild(document.createTextNode(addon.name));
        const tdVer = row.insertCell(2);
        tdVer.classList.add("center");
        tdVer.appendChild(document.createTextNode(addon.version));

        const tdContainer = row.insertCell(3);
        tdContainer.classList.add("center");
        tdContainer.appendChild(document.createTextNode(addon.containerVersion));

        row.insertCell(4).appendChild(document.createTextNode(start));
        row.insertCell(5).appendChild(document.createTextNode(stop));

        const gearTd = row.insertCell(6);
        gearTd.appendChild(createFastElement("i", { classList: ["icon-cog"] }));
    }
}
load().catch(console.error);
