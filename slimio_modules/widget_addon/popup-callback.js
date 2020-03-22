"use strict";

export default class WidgetAddonsPopupCallbacks extends HTMLElement {
    constructor(callbacks) {
        super();
        const popup = document.querySelector("pop-up");

        const tmpl = document.getElementById("widget-addon-popup-callback");
        const clone = tmpl.content.cloneNode(true);

        const fragment = document.createDocumentFragment();
        const asideList = clone.querySelector("aside > ul");
        for (const callback of Object.keys(callbacks)) {
            const li = document.createElement("li");
            li.textContent = callback;
            fragment.appendChild(li);
        }
        asideList.appendChild(fragment);

        popup.appendChild(clone);
    }
}

customElements.define("widget-addon-popup-callback", WidgetAddonsPopupCallbacks);
