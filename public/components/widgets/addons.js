"use strict";

class WidgetAddon extends HTMLElement {
    constructor() {
        super();
        this.create().catch(console.error);
    }

    async create() {
        console.log("widget addon start");
        const tmpl = document.getElementById("widget_addons");
        const clone = tmpl.content.cloneNode(true);

        console.log("load addons...");
        const addons = await fetch("/addons").then((raw) => raw.json());
    
        const tbody = clone.querySelector("table > tbody");
        for (const addon of addons) {
            const row = tbody.insertRow();
    
            const start = formatDate(addon.lastStart);
    
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
    
            const startRow = row.insertCell(4);
            startRow.classList.add("center");
            startRow.appendChild(document.createTextNode(start));
    
            const gearTd = row.insertCell(5);
            gearTd.appendChild(createFastElement("i", { classList: ["icon-cog"] }));
        }

        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

customElements.define("widget-addons", WidgetAddon);
