import { createChart } from "../../js/utils.js";
import Modules from "./modules.js";
import Alarm from "../alarm/alarm.js";

class AlarmConsole extends Modules {
    constructor() {
        super("alarmconsole");
        this.create().then(() => this.init()).catch(console.error);
    }

    async init() {
        const alarms = await fetch("/alarms").then((raw) => raw.json());

        const sevCount = { 0: 0, 1: 0, 2: 0 };
        for (const { severity } of alarms) {
            sevCount[severity]++;
        }

        createChart("severities", {
            type: "bar",
            data: {
                labels: ["Critical", "Major", "Minor"],
                datasets: [{
                    data: [...Object.values(sevCount)],
                    backgroundColor: ["#E53935", "#FFC107", "#03A9F4"]
                }]
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Alarm Severities"
                }
            }
        });

        const ctxOvertime = document.getElementById("overtime").getContext("2d");
        new Chart(ctxOvertime, {
            // The type of chart we want to create
            type: "line",

            // The data for our dataset
            datasets: {
                data: [alarms.length]
            },

            // Configuration options go here
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Alarm Count"
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });

        document.querySelector(".alarms").appendChild(Alarm.proceedAll(alarms));
    }
}

customElements.define("alarm-console", AlarmConsole);
