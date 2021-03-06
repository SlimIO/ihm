// Require Node.js dependencies
import { promises as fs, createReadStream } from "fs";
import { fileURLToPath } from "url";
import { join } from "path";
import { createRequire } from "module";
import { pipeline } from "stream";
const { readFile, writeFile } = fs;

// Require Third-Party dependencies
import polka from "polka";
import send from "@polka/send-type";
import sirv from "sirv";
import zup from "zup";
import flatstr from "flatstr";
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
    getActivityOverview,

    DIST_DIR,
    VIEWS_DIR,
    SLIMIO_MODULES_DIR,
    CONFIG_DIR,
    DASHBOARD_JSON
} from "./utils.js";

// CONSTANTS
const kDefaultMenuTemplate = {
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
const kAvailableModules = new Set(["alarmconsole", "alerting", "dashboard", "metrics"]);
let homePageNeedUpdate = true;

/**
 * @function exportServer
 * @description Export Polka HTTP Server to the ihm Addon
 * @param {!Addon} ihm ihm addon
 * @returns {polka.Polka}
 */
export default function exportServer(ihm) {
    const httpServer = polka();

    // Serve static assets!
    httpServer.use(sirv(DIST_DIR, { dev: true }));
    httpServer.use(sirv(SLIMIO_MODULES_DIR, { dev: true }));

    httpServer.get("/", async(req, res) => {
        try {
            console.time("get_home");
            const [homePageTemplate, activityData] = await Promise.all([
                readFile(join(VIEWS_DIR, "index.html"), "utf-8"),
                getActivityOverview(ihm)
            ]);

            let renderedHTML = zup(homePageTemplate)(Object.assign(activityData, { menu: kDefaultMenuTemplate, i18n }));
            if (homePageNeedUpdate) {
                let templateHTML = "";

                const HTMLFilesIterators = combineAsyncIterators(
                    getAllHTMLComponents(),
                    getAllHTMLComponents(SLIMIO_MODULES_DIR)
                );
                for await (const path of HTMLFilesIterators) {
                    const html = await readFile(path, "utf8");

                    templateHTML += zup(html)({ i18n });
                }
                renderedHTML += templateHTML;
                homePageNeedUpdate = false;

                await writeFile(join(VIEWS_DIR, "template.html"), templateHTML);
            }
            else {
                const templateHTML = await readFile(join(VIEWS_DIR, "template.html"), "utf-8");
                renderedHTML += templateHTML;
            }
            flatstr(renderedHTML);

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
            if (!kAvailableModules.has(moduleName)) {
                return send(res, 404, `Unable to found any module with the name '${moduleName}'`);
            }

            const buf = await readFile(join(VIEWS_DIR, "modules", `${moduleName}.html`));
            send(res, 200, buf.toString(), { "Content-Type": "text/html" });
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    httpServer.get("/alarms", async(req, res) => {
        try {
            const alarms = await ihm.sendOne("events.get_alarms");

            // TODO: do this asynchronously
            for (const alarm of alarms) {
                const entity = await ihm.sendOne("events.get_entity_by_id", [alarm.entity_id]);
                alarm.entity_name = entity.name;
            }

            send(res, 200, alarms);
        }
        catch (err) {
            send(res, 500, err.message);
        }
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
            res.writeHead(200, { "Content-Type": "application/json" });
            pipeline(createReadStream(DASHBOARD_JSON), res, (error) => {
                if (error) {
                    console.error(error);
                }
            });
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    httpServer.get("/config/:name", async(req, res) => {
        try {
            const addonName = req.params.name;
            /** @type {Set<string>} */
            const addons = new Set(await ihm.sendOne("gate.list_addons"));
            if (!addons.has(addonName)) {
                return send(res, 404, `Unable to found any addon with name '${addonName}'`);
            }

            const callbackDescriptorPath = join(CONFIG_DIR, `${addonName}CallbackDescriptor.json`);
            const callbackDescriptor = await readFile(callbackDescriptorPath, "utf-8");

            return send(res, 200, JSON.parse(callbackDescriptor), { "Content-Type": "application/json" });
        }
        catch (err) {
            return send(res, 500, err.message);
        }
    });

    httpServer.post("/sendOne/:addonName/:callback", async(req, res) => {
        try {
            const { addonName, callback } = req.params;
            const data = await bodyParser(req);

            const response = await ihm.sendOne(`${addonName}.${callback}`, Object.values(data));
            send(res, 200, response);
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    return httpServer;
}
