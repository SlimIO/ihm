// Require Node.js dependencies
const { join } = require("path");
const { readFile } = require("fs").promises;

// Require Third-Party dependencies
const Addon = require("@slimio/addon");
const polka = require("polka");
const send = require("@polka/send-type");
const sirv = require("sirv");
const { json } = require("body-parser");

// Constants
const VIEWS_DIR = join(__dirname, "..", "views");

// Read index
async function readHtml() {
    const views = await readFile(join(VIEWS_DIR, "index.html"), { encoding: "utf8" });

    return views;
}

// Create POLKA server
function exportServer(ihm) {
    server = polka()
        .use(sirv(join(__dirname, "..", "public")))
        .use(json({ type: "application/json" }))
        .post("/remove", async(req, res) => {
            await ihm.sendOne(`events.remove_${req.body.type}`, [`2#${req.body.cid}`]);

            send(res, 200);
        })
        .get("/", async(req, res) => {
            send(res, 200, await readHtml(), { "Content-Type": "text/html" });
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
            const ret = await Promise.all(_p);
            // Send
            send(res, 200, ret);
        })
        .get("/alarm", async(req, res) => {
            /** @type {Object[]} */
            const alarms = await ihm.sendOne("events.get_alarms");

            send(res, 200, alarms);
        })
        .get("/entities", async(req, res) => {
            const entities = await ihm.sendOne("events.search_entities");

            send(res, 200, entities);
        })
        .get("/test", async(req, res) => {
            const ret = await ihm.sendOne("events.remove_alarm");
            console.log(ret);
        });

    return server;
}

module.exports = exportServer;

