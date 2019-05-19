// Require Node.js dependencies
const { join } = require("path");
const { readFile } = require("fs").promises;

// Require Third-Party dependencies
const polka = require("polka");
const send = require("@polka/send-type");
const sirv = require("sirv");
const { json } = require("body-parser");

// Constants
const PUBLIC_DIR = join(__dirname, "..", "public");
const VIEWS_DIR = join(__dirname, "..", "views");

// Create POLKA server
function exportServer(ihm) {
    const httpServer = polka();
    httpServer.use(sirv(PUBLIC_DIR, { dev: true }));
    httpServer.use(json({ type: "application/json" }));

    httpServer.get("/", async(req, res) => {
        try {
            const views = await readFile(join(VIEWS_DIR, "index.html"), { encoding: "utf8" });
            send(res, 200, views, { "Content-Type": "text/html" });
        }
        catch (err) {
            send(res, 500, err.message);
        }
    });

    return httpServer;
}

module.exports = exportServer;

