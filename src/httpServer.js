// Require Node.js dependencies
const { join } = require("path");
const { readFile } = require("fs").promises;

// Require Third-Party dependencies
const polka = require("polka");
const send = require("@polka/send-type");
const sirv = require("sirv");
const zup = require("zup");

// CONSTANTS
const PUBLIC_DIR = join(__dirname, "..", "public");
const VIEWS_DIR = join(__dirname, "..", "views");

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
 * @func exportServer
 * @desc Export Polka HTTP Server to the ihm Addon
 * @param {!Addon} ihm ihm addon
 * @returns {any}
 */
function exportServer(ihm) {
    const httpServer = polka();
    httpServer.use(sirv(PUBLIC_DIR, { dev: true }));

    httpServer.get("/", async(req, res) => {
        try {
            const [views, data] = await Promise.all([
                readFile(join(VIEWS_DIR, "index.html"), "utf-8"),
                getActivityOverview(ihm)
            ]);

            send(res, 200, zup(views)(data), { "Content-Type": "text/html" });
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

    httpServer.get("/addons", async(req, res) => {
        try {
            /** @type {string[]} */
            const addons = await ihm.sendOne("gate.list_addons");
            const infos = await Promise.all(
                addons.map((name) => ihm.sendOne(`${name}.get_info`))
            );

            send(res, 200, infos);
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    return httpServer;
}

module.exports = exportServer;

