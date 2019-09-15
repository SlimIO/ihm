"use strict";

const TWO_HOUR_MS = 2 * 60 * 60 * 1000;

class Alarm extends HTMLElement {
    static create(slot, text) {
        return createFastElement("span", { attributes: { slot }, text });
    }

    /**
     * @class Widget
     * @augments HTMLElement
     */
    constructor() {
        super();
        const tmpl = document.getElementById("template_alarm");
        const clone = tmpl.content.cloneNode(true);
        this.attachShadow({ mode: "open" }).appendChild(clone);
    }

    initialize(alarm) {
        const severity = this.getAttribute("severity");
        this.shadowRoot.querySelector(".alarm").classList.add(severity);

        const updateTs = new Date(alarm.updatedAt).getTime();
        const elapsed = (Date.now() - TWO_HOUR_MS - updateTs) / 1000;

        this.appendChild(Alarm.create("message", alarm.message));
        this.appendChild(Alarm.create("entity", alarm.entity_name));
        this.appendChild(Alarm.create("ck", alarm.correlate_key));
        this.appendChild(Alarm.create("occurence", alarm.occurence));
        this.appendChild(Alarm.create("start_date", formatDate(alarm.createdAt)));
        this.appendChild(Alarm.create("since", `${elapsed.toFixed(1)} sec`));
    }
}

customElements.define("alarm-row", Alarm);
