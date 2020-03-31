// Require Node.js dependencies
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

// Node.js CJS constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CONSTANTS
export const PUBLIC_DIR = join(__dirname, "..", "public");
export const VIEWS_DIR = join(__dirname, "..", "views");
export const COMPONENTS_DIR = join(PUBLIC_DIR, "components");
export const SLIMIO_MODULES_DIR = join(PUBLIC_DIR, "..", "slimio_modules");
export const CONFIG_DIR = join(PUBLIC_DIR, "..", "config");
export const DASHBOARD_JSON = join(__dirname, "..", "dashboard.json");

/**
 * @async
 * @function getAllHTMLComponents
 * @param {!string} directoryLocation
 * @returns {AsyncIterable<string>}
 */
export async function* getAllHTMLComponents(directoryLocation = COMPONENTS_DIR) {
    const dirents = await fs.readdir(directoryLocation, { withFileTypes: true });

    for await (const dirent of dirents) {
        const fullDirentPath = join(directoryLocation, dirent.name);

        if (dirent.isDirectory()) {
            yield* getAllHTMLComponents(fullDirentPath);
        }
        else if (extname(dirent.name) === ".html") {
            yield fullDirentPath;
        }
    }
}
