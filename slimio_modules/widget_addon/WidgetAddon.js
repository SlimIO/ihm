import WidgetAddonsPopupCallbacks from "./popup_callback/popup-callback.js";
import { createDOMElement, formatDate } from "./utils.js";

class WidgetAddon extends HTMLElement {
    constructor() {
        super();
        this.create().catch(console.error);
    }

    async create() {
        const tmpl = document.getElementById("widget_addons");
        const clone = tmpl.content.cloneNode(true);

        const addons = await fetch("/addons").then((raw) => raw.json());

        const tbody = clone.querySelector("table > tbody");
        const fragment = document.createDocumentFragment();
        for (const addon of addons) {
            const {
                lastStart,
                name,
                version,
                containerVersion,
                callbacks
            } = addon;
            const start = formatDate(lastStart);

            const cloneLine = clone.getElementById("table-line").content.cloneNode(true);
            cloneLine.querySelector(".state").appendChild(createDOMElement("i", { classList: ["icon-ok"] }));
            cloneLine.querySelector(".name").textContent = name;
            cloneLine.querySelector(".version").textContent = version;
            cloneLine.querySelector(".addon-version").textContent = containerVersion;
            cloneLine.querySelector(".last-start").textContent = start;

            const iconCog = cloneLine.querySelector(".icon-cog");
            const optPanel = iconCog.querySelector(".options");
            iconCog.addEventListener("mouseover", () => {
                optPanel.style.display = "flex";
                optPanel.addEventListener("click", () => {
                    optPanel.style.display = "none";
                });

                const bounding = iconCog.getBoundingClientRect();
                optPanel.style.top = `${bounding.top}px`;
            });
            iconCog.addEventListener("mouseout", () => {
                optPanel.style.display = "none";
            });

            const popup = document.querySelector("pop-up");

            const callbacksElem = cloneLine.querySelector(".callbacks");
            callbacksElem.addEventListener("click", () => {
                new WidgetAddonsPopupCallbacks(name, callbacks);

                popup.dispatchEvent(new CustomEvent("open"));
            });

            fragment.appendChild(cloneLine);
        }
        tbody.appendChild(fragment);
        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

customElements.define("widget-addons", WidgetAddon);
