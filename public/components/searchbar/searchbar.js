/* eslint-disable jsdoc/require-jsdoc */

/**
 * @class SearchBar
 * @augments HTMLElement
 */
class SearchBar extends HTMLElement {
    /**
     * @class SearchBar
     */
    constructor() {
        super();

        const tmpl = document.getElementById("searchbar");
        const clone = tmpl.content.cloneNode(true);

        // Attach shadow root
        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

customElements.define("search-bar", SearchBar);
