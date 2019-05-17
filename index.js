// Required Node.js dependencies
const { join } = require("path");

// Required Third-Party dependencies
const Addon = require("@slimio/addon");
const alert = require("@slimio/alert");
const metrics = require("@slimio/metrics");
const { yellow, red } = require("kleur");

// Constants
const PORT = process.env.PORT || 8000;
const server = require("./src/httpServer");

// Globlas
let intervalId;

// Create addon
const ihm = new Addon("ihm");
const { Entity } = metrics(ihm);

// Create Alarms & entity
const { Alarm } = alert(ihm);
const entityTest = new Entity("entityTest", {
    description: "Hello world!"
});
ihm.on("awake", () => {
    intervalId = setInterval(() => {
        new Alarm("hello world!", {
            correlateKey: "test_alarm",
            entity: entityTest
        });
        new Alarm("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat nobis fugit", {
            correlateKey: "test_alarm_three",
            entity: entityTest
        });
    }, 10000);
    setTimeout(() => {
        new Alarm("hello world!", {
            correlateKey: "test_alarm_five",
            entity: entityTest
        });

        new Alarm("hello world!", {
            correlateKey: "test_alarm_six",
            entity: entityTest
        });
    }, 7000);
});

// Catch start event!
ihm.on("start", async() => {
    server.listen(PORT, () => {
        console.log(`Connect to : ${yellow(`http://localhost:${PORT}`)}`);
    });
    ihm.ready();
});

ihm.on("stop", async() => {
    server.server.close();
    clearInterval(intervalId);
    console.log(`${red("Server Ihm close")}`);
});

// Export addon for SlimIO Core.
module.exports = ihm;
