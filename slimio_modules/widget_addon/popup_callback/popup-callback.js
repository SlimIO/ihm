import { createDOMElement } from "../../../js/utils.js";

export default class WidgetAddonsPopupCallbacks extends HTMLElement {
    constructor(name, callbacks) {
        super();
        this.addonName = name;
        this.callbacksToAvoid = new Set(["start", "stop", "sleep", "event"]);

        this.popup = document.querySelector("pop-up");
        this.create(callbacks).catch(console.error);
    }

    async create(callbacks) {
        const tmpl = document.getElementById("widget-addon-popup-callback");
        const clone = tmpl.content.cloneNode(true);

        const popupTitle = clone.querySelector("p[slot=\"title\"");
        popupTitle.textContent = `Addon Callback Manager : ${this.addonName.charAt(0).toUpperCase() + this.addonName.slice(1)}`;

        this.callbacksDescriptor = JSON.parse(await fetch("/config/events").then((raw) => raw.text()));
        console.log(this.callbacksDescriptor);

        const fragment = document.createDocumentFragment();
        const asideList = clone.querySelector("aside > ul");
        for (const callback of Object.keys(callbacks)) {
            if (this.callbacksToAvoid.has(callback)) {
                continue;
            }
            fragment.appendChild(createDOMElement("li", { text: callback }));
        }
        asideList.appendChild(fragment);

        this.callbackTitleElem = clone.querySelector("#callback-info > .callback-name > p");
        this.callbackFormElem = clone.querySelector("#callback-info > form");

        asideList.addEventListener("click", this.callbackListClicked.bind(this));

        // const submitButton = clone.querySelector("#callback-info > .buttons > .send");
        this.callbackFormElem.addEventListener("submit", this.submitClicked.bind(this));
        this.codeElem = clone.querySelector("#callback-info > .callback-response > pre > code");

        this.popup.appendChild(clone);
    }

    callbackListClicked(event) {
        const { target: { nodeName, textContent } } = event;
        if (nodeName !== "LI") {
            return;
        }
        if (this.currentCallback === textContent) {
            return;
        }

        this.codeElem.textContent = "";
        const callbackDescriptor = this.callbacksDescriptor[textContent];
        console.log(callbackDescriptor);
        // if (typeof callbackDescriptor !== "undefined") {
            this.currentCallback = textContent;
            this.callbackTitleElem.textContent = textContent;

            const ul = WidgetAddonsPopupCallbacks.createForm(callbackDescriptor);
            this.removeAllChildren(this.callbackFormElem);
            this.callbackFormElem.appendChild(ul);
        // }
    }

    async submitClicked(event) {
        event.preventDefault();
        const data = {};
        console.log(this.callbackFormElem.elements);
        for (const elem of this.callbackFormElem.elements) {
            const { type, value, valueAsNumber, name, placeholder } = elem;

            const nameSplit = name.split(".");
            nameSplit.reduce((prev, curr) => {
                if (!Reflect.has(prev, curr)) {
                    if (curr === nameSplit[nameSplit.length - 1]) {
                        const placeholderValue = placeholder === "" ? undefined : placeholder;
                        if (type === "number") {
                            return (prev[curr] = value === "" ? placeholderValue : valueAsNumber);
                        }

                        return (prev[curr] = value === "" ? placeholderValue : value);
                    }

                    prev[curr] = {};
                }

                return prev[curr];
            }, data);

        }

        console.log(data);

        const response = await fetch(`/sendOne/${this.addonName}/${this.currentCallback}`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok === true) {
            const res = await response.json();
            console.log(res);

            this.codeElem.textContent = JSON.stringify(res, null, 4);
        }
        else {
            const res = await response.text();
            console.log(res);

            this.codeElem.textContent = res;
        }
    }

    static createForm(obj = Object.create(null), parent) {
        const ul = document.createElement("ul");
        console.log("obj.required");
        console.log(obj.required);
        const required = typeof obj.required === "undefined" ? [] : obj.required;
        console.log(required);
        const entries = obj.arguments === undefined ? obj : obj.arguments;

        // console.log(entries);
        for (const [key, value] of Object.entries(entries)) {
            const { type, default: defValue = "" } = value;
            // console.log(`key: ${key}`);
            // console.log(`type: ${type}`);
            let elem;
            const name = parent === undefined ? key : `${parent}.${key}`;
            switch (type) {
                case "object": {
                    const pElement = createDOMElement("p", { text: `${key}:` });
                    elem = createDOMElement("li", { classList: ["column"], childs: [pElement] });

                    const ul = WidgetAddonsPopupCallbacks.createForm(value.properties, name);
                    elem.appendChild(ul);
                    break;
                }
                default:
                    console.log("required");
                    console.log(required);
                    elem = WidgetAddonsPopupCallbacks.createInput(key, type, name, {
                        defValue,
                        required: required.includes(key)
                    });
                    break;
            }
            ul.appendChild(elem);
        }

        return ul;
    }

    static createInput(key, type, name, options = Object.create(null)) {
        const { defValue, required = false } = options;

        const labelElement = createDOMElement("label", {
            text: `${key}${required === true ? "*" : ""}: ${type}`
        });
        const input = document.createElement("input");

        input.name = name;
        input.required = required;
        if (type === "boolean") {
            input.type = "checkbox";
            input.checked = defValue === undefined ? false : defValue;
        }
        else {
            input.type = type === "string" ? "text" : "number";
            input.placeholder = defValue;
        }

        return createDOMElement("li", { childs: [labelElement, input] });
    }

    removeAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

customElements.define("widget-addon-popup-callback", WidgetAddonsPopupCallbacks);
