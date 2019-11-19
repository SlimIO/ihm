// Required Third-Party Dependencies
import Addon from "@slimio/addon";
// import { initialize } from "@slimio/modules";

// Require Internal Dependencies
import createServer from "./src/httpServer.js";

// CONSTANTS & Variables
const PORT = process.env.PORT || 1338;
let httpServer = null;

const ihm = new Addon("ihm", { verbose: true })
    .lockOn("gate")
    .lockOn("events");

// initialize(ihm);

// Catch start event!
ihm.on("awake", async() => {
    httpServer = createServer(ihm);
    httpServer.listen(PORT, () => {
        ihm.logger.writeLine(`Server started at: ${`http://localhost:${PORT}`}`);
    });

    await ihm.ready();
});

// Catch stop event
ihm.on("sleep", () => {
    if (httpServer !== null) {
        httpServer.server.close();
        httpServer = null;
    }
});

// Export addon for SlimIO Core.
export default ihm;
