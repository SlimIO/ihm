class Popup extends HTMLElement {
    constructor() {
        super();

        this.isOpen = false;
        this.addEventListener("open", this.open);
        this.addEventListener("close", this.close);

        const tmpl = document.getElementById("pop-up");
        const clone = tmpl.content.cloneNode(true);

        const cancelElement = clone.querySelector(".icon-window-close");
        cancelElement.addEventListener("click", (event) => {
            event.preventDefault();
            this.close();
        });

        this.attachShadow({ mode: "open" }).appendChild(clone);
    }

    open(event) {
        if (this.isOpen) {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
        }

        this.dispatchEvent(new CustomEvent("opened"));

        this.style.display = "flex";
        this.isOpen = true;
    }

    close() {
        if (this.isOpen) {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
        }
        this.style.display = "none";
        this.isOpen = false;
    }
}

customElements.define("pop-up", Popup);
