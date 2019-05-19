// Required Third-Party Dependencies
const Addon = require("@slimio/addon");

// Require Internal Dependencies
const httpServer = require("./src/httpServer")(ihm);

// Create addon
const ihm = new Addon("ihm")
    .lockOn("gate")
    .lockOn("events");

// CONSTANTS
const PORT = process.env.PORT || 8000;

// Catch start event!
ihm.on("start", () => {
    httpServer.listen(PORT, () => {
        console.log(`IHM Http Server started at: ${`http://localhost:${PORT}`}`);
    });
    ihm.ready();
});

// Catch stop event
ihm.on("stop", () => {
    httpServer.server.close();
});

// Export addon for SlimIO Core.
module.exports = ihm;
