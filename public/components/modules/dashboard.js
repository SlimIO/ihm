"use strict";

class Dashboard extends Modules {
    constructor() {
        super("dashboard");
        this.create().then(() => this.init()).catch(console.error);
    }

    async init() {
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
}


customElements.define("dash-board", Dashboard);