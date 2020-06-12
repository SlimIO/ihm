

class WidgetChart extends HTMLElement {
    constructor() {
        super();
        this.create().catch(console.error);
    }

    async create() {
        const tmpl = document.getElementById("widget_chart");
        const clone = tmpl.content.cloneNode(true);

        console.log("create cpu chart");
        console.log(window.createChart);
        window.createChart(clone.getElementById("test"), {
            type: "pie",
            data: {
                labels: ["User", "Nice", "Sys", "IRQ", "Idle"],
                datasets: [{
                    data: [15, 20, 30, 2, 48],
                    backgroundColor: ["#06F", "#81C784", "#FFCA28", "#E53935", "#CFD8DC"]
                }]
            }
        });
        this.attachShadow({ mode: "open" }).appendChild(clone);
    }
}

customElements.define("widget-chart", WidgetChart);
