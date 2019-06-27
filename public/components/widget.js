/**
 * @class Widget
 * @extneds HTMLElement
 */
class Widget extends HTMLElement {
    /**
     * @constructor
     */
    constructor() {
        super();

        const tmpl = document.getElementById("widget_template");
        const clone = tmpl.content.cloneNode(true);

        // Hydrate template
        clone.querySelector(".widget-name").textContent = this.getAttribute("name") || "N/A";
        const icon = clone.querySelector(".widget-icon");
        icon.classList.add(this.getAttribute("icon") || "icon-chart-bar");

        // Attach shadow root
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(clone);
    }
}

customElements.define("dashboard-widget", Widget);
