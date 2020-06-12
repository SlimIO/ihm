import Modules from "./modules.js";

class Alerting extends Modules {
    constructor() {
        super("alerting");
        this.create().then(() => this.init()).catch(console.error);
    }

    async init() {
        console.log("Alerting page loaded");
    }
}

customElements.define("alerting-view", Alerting);
