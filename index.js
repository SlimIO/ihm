// Required Node.js dependencies
const { join } = require("path");
const { readFile } = require("fs").promises;

// Required Third-Party dependencies
const Addon = require("@slimio/addon");
const polka = require("polka");
const send = require("@polka/send-type");
const sirv = require("sirv");
const { yellow, red } = require("kleur");

// Require Internal dependencies
const creaDiv = require("./src/utils");

// Constants
const PORT = process.env.PORT || 8000;
const VIEWS_DIR = join(__dirname, "views");

// Globlas
let server;

// Create addon
const ihm = new Addon("ihm");

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
        .get("/", async(req, res) => {
            const addonsList = await ihm.sendOne("gate.get_info")
            console.log(addonsList);
            send(res, 200, views, { "Content-Type": "text/html" });
        })
        .get("/infos", (req, res) => {
            ihm.sendMessage("events.get_info").subscribe(
                (data) => {
                    const datraJSON = JSON.stringify(data);
                    send(res, 200, datraJSON);
                }
            );
        })
        .get("/stat", async(req, res) => {
            // eslint-disable-next-line func-names
            // Add list addon to addonsList
            const _p = [];
            const ret = [];
            const addonsList = await ihm.sendOne("gate.list_addons");

            // Addon filter
            const list = addonsList
                .filter((addonName) => addonName !== "ihm")
                .sort();

            // Loop on all addons
            for (let idx = 0; idx < list.length; idx++) {
                const infos = await ihm.sendOne(`${list[idx]}.get_info`);
                const div = creaDiv(infos);
                ret[idx] = div;
            }

            // Send
            send(res, 200, ret);
        })
        .listen(PORT, () => {
            console.log(`Connect to : ${yellow(`http://localhost:${PORT}`)}`);
        });
    // Tell the core that your addon is ready!
    ihm.ready();
});

ihm.on("stop", async() => {
    server.server.close();
    console.log(`${red("Server Ihm close")}`);
});

// Export addon for SlimIO Core.
module.exports = ihm;
