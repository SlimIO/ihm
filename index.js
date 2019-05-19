// Required Third-Party dependencies
const Addon = require("@slimio/addon");

// Create addon
const ihm = new Addon("ihm");

// CONSTANTS
const PORT = process.env.PORT || 8000;
const server = require("./src/httpServer")(ihm);

// Catch start event!
ihm.on("start", async() => {
    server.listen(PORT, () => {
        console.log(`IHM Http Server started at: ${`http://localhost:${PORT}`}`);
    });
    ihm.ready();
});

// Catch stop event
ihm.on("stop", async() => {
    server.server.close();
});

// Export addon for SlimIO Core.
module.exports = ihm;
