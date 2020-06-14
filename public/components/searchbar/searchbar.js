import { createDOMElement } from "../../js/utils.js";

// CONSTANTS
const kFiltersName = new Set(["alarm", "entity", "mic"]);

class SearchBar extends HTMLElement {
    constructor() {
        super();
        const tmpl = document.getElementById("searchbar");
        const clone = tmpl.content.cloneNode(true);

        this.inputUpdateValue = false;
        this.queries = [];
        this.activeFilters = new Set();

        // elements
        this.input = clone.querySelector("input.search-bar");
        this.resultsContainer = clone.querySelector(".search-results");
        this.filterSearchGroup = clone.querySelector(".search-results > #helper");
        this.filtersContainer = clone.querySelector(".input-filters");
        this.allResultsElements = clone.querySelectorAll("#items ul li")

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

        let currentActiveFilterName = null;
        let confirmBackspace = false;
        this.input.addEventListener("keyup", (event) => {
            if ((this.input.value === null || this.input.value === "")) {
                this.showFilterGroup();

                // hide all results if there is no active queries!
                if (this.activeFilters.size === 0) {
                    this.allResultsElements.forEach((element) => element.classList.add("hidden"));
                }

                else if (event.key === "Backspace") {
                    if (confirmBackspace) {
                        this.removeLatestFilter();
                        currentActiveFilterName = null;
                    }
                    else {
                        confirmBackspace = true;
                    }
                }

                return;
            }

            confirmBackspace = false;
            if  (currentActiveFilterName === null) {
                this.showFilterByInputText();
            }

            if (event.key === ":" || this.inputUpdateValue) {
                if (this.inputUpdateValue) {
                    setTimeout(() => (this.inputUpdateValue = false), 1);
                }

                // here .split is important because we may have to re-proceed complete search string like 'filter: text'.
                const [filterName] = this.input.value.split(":");
                if (kFiltersName.has(filterName)) {
                    currentActiveFilterName = filterName;
                    this.showFilterGroup(currentActiveFilterName);
                }
            }

            if (currentActiveFilterName === null) {
                return;
            }
            const text = this.input.value.slice(currentActiveFilterName.length + 1).trim();

            this.showFilterByInputText(text);
            if (text.length === 0) {
                return;
            }
            console.log(text);

            if (event.key === "Enter") {
                this.createNewFilter(currentActiveFilterName, text);
                this.showFilterGroup();
                currentActiveFilterName = null;
                this.input.value = "";
            }
        });

        this.attachShadow({ mode: "open" }).appendChild(clone);
    }

    showFilterGroup(filterName = null) {
        if (filterName !== null && !kFiltersName.has(filterName)) {
            this.filterSearchGroup.classList.add("hidden");

            return;
        }

        this.filterSearchGroup.querySelectorAll("ul li").forEach((element) => element.classList.remove("hidden"));
        this.filterSearchGroup.classList.remove("hidden");
    }

    showFilterByInputText(text = this.input.value.trim()) {
        const elements = this.filterSearchGroup.querySelectorAll("ul li");

        for (const pkgElement of elements) {
            const dataValue = pkgElement.getAttribute("data-value");
            if (text === "") {
                pkgElement.classList.remove("hidden");
            }
            else {
                pkgElement.classList[dataValue.match(text) ? "remove" : "add"]("hidden");
            }
        }
    }

    createNewFilter(filterName, searchStr = null) {
        const text = searchStr === null ? `${filterName}:` : `${filterName}: ${searchStr}`;
        const pElement = createDOMElement("p", { text });

        this.activeFilters.add(filterName);
        this.queries.push([`${filterName}:${searchStr}`, pElement])
        this.filtersContainer.appendChild(pElement);
    }

    updateCurrentFilter(text = "", erase = false) {
        const pElement = this.filtersContainer.lastChild;
        if (erase) {
            pElement.textContent = text;
        }
        else {
            pElement.textContent = pElement.textContent + text;
        }
    }

    removeLatestFilter() {
        const [fullQuery, pElement] = this.queries.pop();
        const [filterName] = fullQuery.split(":");

        this.activeFilters.delete(filterName);
        this.filtersContainer.removeChild(pElement);
        this.input.value = fullQuery;
        this.inputUpdateValue = true;
        this.input.focus();
        this.input.dispatchEvent(new Event("keyup"));
    }

    close() {
        this.resultsContainer.classList.add("hidden");
        this.input.value = "";
        this.input.blur();
    }
}

customElements.define("search-bar", SearchBar);
