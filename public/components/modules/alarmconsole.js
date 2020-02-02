"use strict";

// CONSTANT
const SEVERITIES = new Map([
    [0, "Critical"],
    [1, "Major"],
    [2, "Minor"]
]);

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

        const fragment = document.createDocumentFragment();
        for (const alarm of alarms) {
            const elAlarm = document.createElement("alarm-row");
            elAlarm.setAttribute("uuid", alarm.uuid);
            elAlarm.setAttribute("severity", SEVERITIES.get(alarm.severity).toLowerCase());
            elAlarm.initialize(alarm);

            fragment.appendChild(elAlarm);
        }
        document.querySelector(".alarms").appendChild(fragment);
    }
}

customElements.define("alarm-console", AlarmConsole);
