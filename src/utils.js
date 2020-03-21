// Require Node.js dependencies
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const { readdir } = fs;

// Node.js CJS constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CONSTANTS
const PUBLIC_DIR = join(__dirname, "..", "public");
const VIEWS_DIR = join(__dirname, "..", "views");
const COMPONENTS_DIR = join(PUBLIC_DIR, "components");
const SLIMIO_MODULES_DIR = join(PUBLIC_DIR, "..", "slimio_modules");
const DASHBOARD_JSON = join(__dirname, "..", "dashboard.json");

export {
    PUBLIC_DIR,
    VIEWS_DIR,
    COMPONENTS_DIR,
    SLIMIO_MODULES_DIR,
    DASHBOARD_JSON
}

export async function getAllHTMLComponents(folderPath = COMPONENTS_DIR) {
    const dirents = await readdir(folderPath, {
        encoding: "utf8",
        withFileTypes: true
    });

    let paths = [];
    const folderPaths = [];
    for (const dirent of dirents) {
        const direntPath = join(folderPath, dirent.name);
        if (dirent.isFile()) {
            const ext = extname(dirent.name);
            if (ext === ".html") {
                paths.push(direntPath);
            }
        }
        if (dirent.isDirectory()) {
            folderPaths.push(direntPath);
        }
    }
    const HTMLPaths = await Promise.all(folderPaths.map(async(path) => { 
        return await getAllHTMLComponents(path)
    }));

    for (const path of HTMLPaths) {
        paths.push(...path);
    }

    return paths;
}