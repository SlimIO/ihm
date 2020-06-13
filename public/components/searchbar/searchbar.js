
class SearchBar extends HTMLElement {
    constructor() {
        super();
        const tmpl = document.getElementById("searchbar");
        const clone = tmpl.content.cloneNode(true);

        // elements
        this.input = clone.querySelector("input.search-bar");
        this.resultsContainer = clone.querySelector(".search-results");
        this.filterSearchGroup = clone.querySelector(".search-results > #helper");

        // When we click in the Searchbar, then we want to open the results container
        this.addEventListener("click", () => {
            if (this.resultsContainer.classList.contains("hidden")) {
                this.filterSearchGroup.classList.remove("hidden");
                this.resultsContainer.classList.remove("hidden");
            }
        });

        // When we click outside of searchbar then we want to close the results container
        document.addEventListener("click", (event) => {
            if (!this.contains(event.target) && !this.resultsContainer.classList.contains("hidden")) {
                this.close();
            }
        });

        this.input.addEventListener("keyup", (event) => {

        });

        this.attachShadow({ mode: "open" }).appendChild(clone);
    }

    close() {
        this.results_container.classList.add("hidden");
        this.input.value = "";
        this.input.blur();
    }
}

customElements.define("search-bar", SearchBar);
