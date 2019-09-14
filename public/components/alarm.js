"use strict";

class Alarm extends HTMLElement {
    /**
     * @class Widget
     * @augments HTMLElement
     */
    constructor() {
        super();

        const tmpl = document.getElementById("template_alarm");
        const clone = tmpl.content.cloneNode(true);

        console.log(this.getAttribute("severity"));
        const severity = this.getAttribute("severity") || "critical";
        const alarmChild = clone.querySelector(".alarm");
        alarmChild.classList.add(severity.toLowerCase());

        // Attach shadow root
        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

customElements.define("alarm-row", Alarm);
