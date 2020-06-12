class WidgetAlarms extends HTMLElement {
    constructor() {
        super();
        this.create().catch(console.error);
    }

    async create() {
        const tmpl = document.getElementById("widget_alarms");
        const clone = tmpl.content.cloneNode(true);
        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

customElements.define("widget-alarms", WidgetAlarms);
