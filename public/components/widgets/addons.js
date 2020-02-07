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
        console.log(clone);

        console.log("load addons...");
        const addons = await fetch("/addons").then((raw) => raw.json());
    
        const tbody = clone.querySelector("table > tbody");
        const fragment = document.createDocumentFragment();
        for (const addon of addons) {
            
            const start = formatDate(addon.lastStart);

            const cloneLine = clone.getElementById("table-line").content.cloneNode(true);
            cloneLine.querySelector(".state").appendChild(createFastElement("i", { classList: ["icon-ok"] }));
            cloneLine.querySelector(".name").textContent = addon.name;
            cloneLine.querySelector(".version").textContent = addon.version;
            cloneLine.querySelector(".addon-version").textContent = addon.containerVersion;
            cloneLine.querySelector(".last-start").textContent = start;
    
            fragment.appendChild(cloneLine);
        }
        tbody.appendChild(fragment);
        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

customElements.define("widget-addons", WidgetAddon);
