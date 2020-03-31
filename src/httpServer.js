// Require Node.js dependencies
import { promises as fs, createReadStream } from "fs";
import { fileURLToPath } from "url";
import { join } from "path";
import { createRequire } from "module";
const { readFile } = fs;

// Require Third-Party dependencies
import polka from "polka";
import send from "@polka/send-type";
import sirv from "sirv";
import zup from "zup";
import combineAsyncIterators from "combine-async-iterators";

// Node.js CJS constants
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);

// Require Internal Dependencies
/** @type {IHM.i18n} */
const i18n = require("../i18n/english.json");
import bodyParser from "./bodyParser.js";
import {
    getAllHTMLComponents,

    PUBLIC_DIR,
    VIEWS_DIR,
    SLIMIO_MODULES_DIR,
    CONFIG_DIR,
    DASHBOARD_JSON
} from "./utils.js";

/**
 * @async
 * @function getActivityOverview
 * @param {Addon} ihm ihm addon
 * @returns {Promise<any>}
 */
async function getActivityOverview(ihm) {
    const [entity, desc, summary] = await Promise.all([
        ihm.sendOne("events.get_entity_by_id", [1]),
        ihm.sendOne("events.get_descriptors", [1]),
        ihm.sendOne("events.summary_stats")
    ]);

    const descriptors = desc.reduce((prev, curr) => {
        prev[curr.key] = curr.value;

        return prev;
    }, {});

    return {
        serverName: entity.name,
        descriptors,
        summary
    };
}

/**
 * @function exportServer
 * @description Export Polka HTTP Server to the ihm Addon
 * @param {!Addon} ihm ihm addon
 * @returns {any}
 */
export default function exportServer(ihm) {
    const httpServer = polka();

    // Serve static assets!
    httpServer.use(sirv(PUBLIC_DIR, { dev: true }));
    httpServer.use(sirv(SLIMIO_MODULES_DIR, { dev: true }));

    httpServer.get("/", async(req, res) => {
        try {
            console.time("get_home");
            const [views, data] = await Promise.all([
                readFile(join(VIEWS_DIR, "index.html"), "utf-8"),
                getActivityOverview(ihm)
            ]);

            const menu = {
                dashboard: {
                    title: i18n.keys.menu.dashboard,
                    icon: "icon-home"
                },
                alarmconsole: {
                    title: i18n.keys.menu.alarmconsole,
                    icon: "icon-bell-alt"
                },
                alerting: {
                    title: i18n.keys.menu.alerting,
                    icon: "icon-eye"
                },
                metrics: {
                    title: i18n.keys.menu.metrics,
                    icon: "icon-chart-line"
                }
            };

            let renderedHTML = zup(views)(Object.assign(data, { menu, i18n }));

            const HTMLFilesIterators = combineAsyncIterators(
                getAllHTMLComponents(),
                getAllHTMLComponents(SLIMIO_MODULES_DIR)
            );
            for await (const path of HTMLFilesIterators) {
                const html = await readFile(path, "utf8");

                renderedHTML += zup(html)({ i18n });
            }

            send(res, 200, renderedHTML, { "Content-Type": "text/html" });
            console.timeEnd("get_home");
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    httpServer.get("/module/:name", async(req, res) => {
        try {
            const moduleName = req.params.name;

            const buf = await readFile(join(VIEWS_DIR, "modules", `${moduleName}.html`));
            send(res, 200, buf.toString(), { "Content-Type": "text/html" });
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    httpServer.get("/alarms", async(req, res) => {
        console.time("getAlarms");
        const alarms = await ihm.sendOne("events.get_alarms");

        // TODO: do this asynchronously
        for (const alarm of alarms) {
            const entity = await ihm.sendOne("events.get_entity_by_id", [alarm.entity_id]);
            alarm.entity_name = entity.name;
        }

        send(res, 200, alarms);
        console.timeEnd("getAlarms");
    });

    httpServer.get("/addons", async(req, res) => {
        try {
            /** @type {string[]} */
            const addons = await ihm.sendOne("gate.list_addons");
            const infos = await Promise.all(
                addons.map((name) => ihm.sendOne(`${name}.status`))
            );

            send(res, 200, infos);
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    httpServer.get("/dashboard", async(req, res) => {
        try {
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            createReadStream(DASHBOARD_JSON).pipe(res);
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    httpServer.get("/config/:name", async(req, res) => {
        try {
            const addonName = req.params.name;

            const callbackDescriptorPath = join(CONFIG_DIR, `${addonName}CallbackDescriptor.json`);
            const callbackDescriptor = require(callbackDescriptorPath);

            send(res, 200, callbackDescriptor, { "Content-Type": "application/json" });
        }
        catch (err) {
            console.log(err);
            send(res, 500, err.message);
        }
    });

    httpServer.post("/sendOne/:addonName/:callback", async(req, res) => {
        try {
            const { addonName, callback } = req.params;
            const data = await bodyParser(req);

            const response = await ihm.sendOne(`${addonName}.${callback}`, Object.values(data));
            console.log(response);
            send(res, 200, response);
        }
        catch (err) {
            console.log(err);
            send(res, 500, err.message);
        }
    });

    return httpServer;
}
