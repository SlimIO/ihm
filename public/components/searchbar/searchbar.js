
class SearchBar extends HTMLElement {
    constructor() {
        super();

        const tmpl = document.getElementById("searchbar");
        const clone = tmpl.content.cloneNode(true);

        // Attach shadow root
        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

customElements.define("search-bar", SearchBar);
