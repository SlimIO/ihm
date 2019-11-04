"use strict";

// Required Third-Party Dependencies
const Addon = require("@slimio/addon");

// Create addon
const ihm = new Addon("ihm", { verbose: true })
    .lockOn("gate")
    .lockOn("events");

// Require Internal Dependencies
const httpServer = require("./src/httpServer")(ihm);

// CONSTANTS
const PORT = process.env.PORT || 1338;

// Catch start event!
ihm.on("awake", () => {
    httpServer.listen(PORT, () => {
        ihm.logger.writeLine(`Server started at: ${`http://localhost:${PORT}`}`);
    });
    ihm.ready();
});

// Catch stop event
ihm.on("sleep", () => {
    httpServer.server.close();
});

// Export addon for SlimIO Core.
module.exports = ihm;
