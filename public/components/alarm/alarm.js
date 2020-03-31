import { createDOMElement, formatDate } from "../../js/utils.js";

// CONSTANTS
const TWO_HOUR_MS = 2 * 60 * 60 * 1000;
const SEVERITIES = new Map([
    [0, "Critical"],
    [1, "Major"],
    [2, "Minor"]
]);

export default class Alarm extends HTMLElement {
    static create(slot, text) {
        return createDOMElement("span", { attributes: { slot }, text });
    }

    static proceedAll(alarms) {
        const fragment = document.createDocumentFragment();
        for (const alarm of alarms) {
            fragment.appendChild(new Alarm(alarm));
        }

        return fragment;
    }

    /**
     * @class Widget
     * @param {any} alarm
     * @augments HTMLElement
     */
    constructor(alarm) {
        super();
        const tmpl = document.getElementById("template_alarm");
        const clone = tmpl.content.cloneNode(true);

        const updateTs = new Date(alarm.updatedAt).getTime();
        const elapsed = (Date.now() - TWO_HOUR_MS - updateTs) / 1000;
        const severity = SEVERITIES.get(alarm.severity).toLowerCase();

        clone.querySelector(".alarm").classList.add(severity);
        this.attachShadow({ mode: "open" }).appendChild(clone);

        this.setAttribute("uuid", alarm.uuid);
        this.appendChild(Alarm.create("message", alarm.message));
        this.appendChild(Alarm.create("entity", alarm.entity_name));
        this.appendChild(Alarm.create("ck", alarm.correlate_key));
        this.appendChild(Alarm.create("occurence", alarm.occurence));
        this.appendChild(Alarm.create("start_date", formatDate(alarm.createdAt)));
        this.appendChild(Alarm.create("since", `${elapsed.toFixed(1)} sec`));
    }
}

customElements.define("alarm-row", Alarm);
