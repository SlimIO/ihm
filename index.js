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
const visual = new Addon("visual");

// Catch start event!
visual.on("start", async() => {
    // Read index
    const views = await readFile(join(VIEWS_DIR, "index.html"), { encoding: "utf8" });
    server = polka();

    // Create POLKA server
    server
        .use("css/", sirv(join(__dirname, "public", "css")))
        .use("img/", sirv(join(__dirname, "public", "img")))
        .get("/", (req, res) => {
            send(res, 200, views, { "Content-Type": "text/html" });
        })
        .listen(PORT, () => {
            console.log(`Connect to : ${yellow(`http://localhost:${PORT}`)}`);
        });

    // Main page
    // visual.sendMessage("events.get_info").subscribe(
    //     (data) => {

    //     }
    // )

    // Tell the core that your addon is ready!
    visual.ready();
});

visual.on("stop", async() => {
    server.server.close();
    console.log(`${red("Server close")}`);
});

// Export addon for SlimIO Core.
module.exports = visual;
