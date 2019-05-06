// Required Node.js dependencies
const { join } = require("path");
const { readFile } = require("fs").promises;

// Required Third-Party dependencies
const Addon = require("@slimio/addon");
const polka = require("polka");
const send = require("@polka/send-type");
const sirv = require("sirv");
const { yellow, red } = require("kleur");

// Constants
const PORT = process.env.PORT || 8000;
const VIEWS_DIR = join(__dirname, "views");

// Globlas
let listAddon;
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
        .use("img", sirv(join(__dirname, "public", "img")))
        .use("js", sirv(join(__dirname, "public", "js")))
        .get("/", (req, res) => {
            send(res, 200, views, { "Content-Type": "text/html" });
        })
        .get("/infos", (req, res) => {
            ihm.sendMessage("events.get_info").subscribe(
                (data) => {
                    const datraJSON = JSON.stringify(data);
                    send(res, 200, data);
                }
            );
        })
        .listen(PORT, () => {
            console.log(`Connect to : ${yellow(`http://localhost:${PORT}`)}`);
        });
    // Tell the core that your addon is ready!
    ihm.ready();
});

ihm.on("stop", async() => {
    server.server.close();
    console.log(`${red("Server close")}`);
});

// Export addon for SlimIO Core.
module.exports = ihm;
