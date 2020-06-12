import Modules from "./modules.js";

class Metrics extends Modules {
    constructor() {
        super("metrics");
        this.create().then(() => this.init()).catch(console.error);
    }

    async init() {
        console.log("metrics page loaded");
    }
}

customElements.define("metrics-board", Metrics);
