"use strict";

class Modules extends HTMLElement {
    constructor(module) {
        super();
        this.module = module;
    }

    async create() {
        const mainElement = document.getElementById("view");
        const HTMLContent = await fetch(`/module/${this.module}`).then((raw) => raw.text());mainElement.innerHTML = HTMLContent;
        mainElement.innerHTML = HTMLContent;

        // Setup new URL location
        const currUrl = new URL(window.location);
        currUrl.searchParams.delete("page");
        currUrl.searchParams.set("page", this.module);
        window.history.pushState("page", "Title", currUrl.href);
        activePage = this.module;
    }
}
