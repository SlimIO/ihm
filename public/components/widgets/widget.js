/* eslint-disable jsdoc/require-jsdoc */

/**
 * @class Widget
 * @augments HTMLElement
 */
class Widget extends HTMLElement {
    /**
     * @class Widget
     */
    constructor() {
        super();

        this.addEventListener("init", () => {
            this.init();
        });

        this.addEventListener("dragstart", (event) => {
            Widget.dragged = event.target;
        });

        this.addEventListener("dragover", (event) => event.preventDefault());

        this.addEventListener("dragenter", (event) => {
            if (event.target.tagName === "DASHBOARD-WIDGET" && Widget.dragged !== event.target) {
                event.target.classList.add("highlight");
            }
        });

        this.addEventListener("dragleave", (event) => {
            if (event.target.tagName === "DASHBOARD-WIDGET") {
                event.target.classList.remove("highlight");
            }
        });

        this.addEventListener("drop", (event) => {
            event.preventDefault();
            if (event.target.tagName === "DASHBOARD-WIDGET" && Widget.dragged !== event.target) {
                const container = Widget.dragged.parentNode;

                event.target.classList.remove("highlight");
                const currIndex = Array.prototype.indexOf.call(container.children, Widget.dragged);
                const nextIndex = Array.prototype.indexOf.call(container.children, event.target);

                container.removeChild(Widget.dragged);
                container.insertBefore(Widget.dragged, currIndex > nextIndex ? event.target : event.target.nextSibling);
            }
        });
    }

    init() {
        const tmpl = document.getElementById("widget");
        const clone = tmpl.content.cloneNode(true);

        // Hydrate template
        clone.querySelector(".widget-name").textContent = this.getAttribute("name") || "N/A";
        const icon = clone.querySelector(".widget-icon");
        icon.classList.add(this.getAttribute("icon") || "icon-chart-bar");

        const type = this.getAttribute("type") || "addons";

        const widgetAddon = document.createElement(`widget-${type}`);
        clone.querySelector(".content").appendChild(widgetAddon);

        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

Widget.dragged = null;

customElements.define("dashboard-widget", Widget);
