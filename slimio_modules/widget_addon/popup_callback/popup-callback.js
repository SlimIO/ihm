"use strict";

export default class WidgetAddonsPopupCallbacks extends HTMLElement {
    constructor(name, callbacks) {
        super();
        this.addonName = name;

        this.currentCallback;
        this.callbacksDescriptor;
        this.addonName;

        this.callbackTitleElem;
        this.callbackFormElem;

        this.create(name, callbacks).catch(console.error);
    }

    async create(callbacks) {
        const popup = document.querySelector("pop-up");

        const tmpl = document.getElementById("widget-addon-popup-callback");
        const clone = tmpl.content.cloneNode(true);

        const popupTitle = clone.querySelector("p[slot=\"title\"");
        popupTitle.textContent = `Addon Callback Manager : ${this.addonName.charAt(0).toUpperCase() + name.slice(1)}`;

        this.callbacksDescriptor = JSON.parse(await fetch("/config/events").then((raw) => raw.text()));
        console.log(this.callbacksDescriptor);

        const fragment = document.createDocumentFragment();
        const asideList = clone.querySelector("aside > ul");
        for (const callback of Object.keys(callbacks)) {
            const li = document.createElement("li");
            li.textContent = callback;
            fragment.appendChild(li);
        }
        asideList.appendChild(fragment);

        this.callbackTitleElem = clone.querySelector("#callback-info > .callback-name > p");
        this.callbackFormElem = clone.querySelector("#callback-info > form");
        
        asideList.addEventListener("click", this.callbackListClicked.bind(this));

        const submitButton = clone.querySelector("#callback-info > .buttons > .send");
        submitButton.addEventListener("click", this.submitClicked.bind(this));

        popup.appendChild(clone);
    }

    callbackListClicked(event) {
        const { target: { nodeName, textContent } } = event;
        if (nodeName !== "LI") {
            return;
        }
        if (this.currentCallback === textContent) {
            return;
        }

        const callbackDescriptor = this.callbacksDescriptor[textContent];
        console.log(callbackDescriptor);
        if (callbackDescriptor !== undefined) {
            this.currentCallback = textContent;
            this.callbackTitleElem.textContent = textContent;

            const ul = WidgetAddonsPopupCallbacks.createForm(callbackDescriptor);
            this.removeAllChildren(this.callbackFormElem);
            this.callbackFormElem.appendChild(ul);
        }
    }

    async submitClicked(event) {
        const data = {};
        console.log(this.callbackFormElem.elements);
        for (const elem of this.callbackFormElem.elements) {
            const { type, value, valueAsNumber, name, placeholder } = elem;

            const nameSplit = name.split(".");
            nameSplit.reduce((prev, curr) => {
                if(!Reflect.has(prev, curr)) {
                    if (curr === nameSplit[nameSplit.length - 1]) {
                        const placeholderValue = placeholder === "" ? undefined : placeholder;
                        if (type === "number") {
                            return prev[curr] = value === "" ? placeholderValue : valueAsNumber;
                        }
                        return prev[curr] = value === "" ? placeholderValue : value;
                    }
                    return prev[curr] = {};
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
        const res = await response.json();
        console.log(res);
    }

    static createForm(obj = Object.create(null), parent) {
        const fragment = document.createDocumentFragment();
        const ul = document.createElement("ul");
        const entries = obj.arguments !== undefined ? obj.arguments : obj;
        // console.log(entries);
        for (const [key, value] of Object.entries(entries)) {
            const { type, default: defValue = "" } = value;
            // console.log(`key: ${key}`);
            // console.log(`type: ${type}`);
            let elem;
            const name = parent === undefined ? key : `${parent}.${key}`;
            switch (type) {
                case "object": 
                    const li = document.createElement("li");
                    li.classList.add("column");
                    const p = document.createElement("p");
                    p.textContent = `${key}:`;
                    li.appendChild(p);
    
                    const ul = WidgetAddonsPopupCallbacks.createForm(value.properties, name);
                    li.appendChild(ul);
                    elem = li;
                    break;
                default:
                    elem = WidgetAddonsPopupCallbacks.createInput(key, type, defValue, name);
                    break;
            }
            ul.appendChild(elem);
        }
        fragment.appendChild(ul);
        return fragment;
    }

    static createInput(key, type, defValue, name) {
        const li = document.createElement("li");
        const label = document.createElement("label");
        label.textContent = `${key}: ${type}`;
        li.appendChild(label);

        const input = document.createElement("input");
        input.name = name;
        if (type === "boolean") {
            input.type = "checkbox";
            input.checked = defValue !== undefined ? defValue : false;
        }
        else {
            input.type = type === "string" ? "text" : "number";
            input.placeholder = defValue;
        }

        li.appendChild(input);

        return li;
    }
    
    removeAllChildren(element) {
        while (element.firstChild) {
            this.callbackFormElem.removeChild(element.firstChild);
        }
    }
}

customElements.define("widget-addon-popup-callback", WidgetAddonsPopupCallbacks);
