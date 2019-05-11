// Required Node.js dependencies
const { join } = require("path");
const { readFile } = require("fs").promises;

// Required Third-Party dependencies
const Addon = require("@slimio/addon");
const alert = require("@slimio/alert");
const metrics = require("@slimio/metrics");
const polka = require("polka");
const send = require("@polka/send-type");
const sirv = require("sirv");
const { yellow, red } = require("kleur");

// Require Internal dependencies
const { addonBuilder, alarmBuilder, entityBuilder } = require("./src/utils");

// Constants
const PORT = process.env.PORT || 8000;
const VIEWS_DIR = join(__dirname, "views");

// Globlas
let server;
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
    }, 1000);
    setTimeout(() => {
        new Alarm("hello world!", {
            correlateKey: "test_alarm_five",
            entity: entityTest
        });
    }, 7000);
});

// Catch start event!
ihm.on("start", async() => {
    // Read index
    const views = await readFile(join(VIEWS_DIR, "index.html"), { encoding: "utf8" });
    server = polka();

    // Create POLKA server
    server
        .use("css", sirv(join(__dirname, "public", "css")))
        .use("font", sirv(join(__dirname, "public", "font")))
        .use("img", sirv(join(__dirname, "public", "img")))
        .use("js", sirv(join(__dirname, "public", "js")))
        .get("/", (req, res) => {
            send(res, 200, views, { "Content-Type": "text/html" });
        })
        .get("/addons", async(req, res) => {
            // eslint-disable-next-line func-names
            // Add list addon to addonsList
            /** @type {string[]} */
            const addonsList = await ihm.sendOne("gate.list_addons");
            // Loop on all addons
            const _p = [];
            for (const addon of addonsList) {
                if (addon === "ihm") {
                    continue;
                }
                _p.push(ihm.sendOne(`${addon}.get_info`));
            }
            const div = await Promise.all(_p);
            const ret = addonBuilder(div);
            // Send
            send(res, 200, ret);
        })
        .get("/alarms", async(req, res) => {
            /** @type {Object[]} */
            const alarms = alarmBuilder(await ihm.sendOne("events.get_alarms"));

            send(res, 200, alarms);
        })
        .get("/entities", async(req, res) => {
            const entities = entityBuilder(await ihm.sendOne("events.search_entities"));

            send(res, 200, entities);
        })
        .get("/test", async(req, res) => {
            const ret = await ihm.sendOne("events.remove_alarm");
            console.log(ret);
        })
        .listen(PORT, () => {
            console.log(`Connect to : ${yellow(`http://localhost:${PORT}`)}`);
        });
    // Tell the core that your addon is ready!
    ihm.ready();
});

ihm.on("stop", async() => {
    server.server.close();
    clearInterval(intervalId);
    console.log(`${red("Server Ihm close")}`);
});

// Export addon for SlimIO Core.
module.exports = ihm;
