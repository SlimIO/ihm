// // Import Node.js Dependencies
// import { join, dirname } from "path";
// import { readdirSync } from "fs";
// import { fileURLToPath } from "url";

// // Import Third-party Dependencies
// import * as CopyWebpackPlugin from "copy-webpack-plugin";
// import * as ExtractTextPlugin from "extract-text-webpack-plugin";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Require Node.js Dependencies
const { join } = require("path");
const { readdirSync } = require("fs");

// Require Third-party Dependencies
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// CONSTANTS
const kPublicDir = join(__dirname, "public");
const kComponentsDir = join(__dirname, "public", "components");
const kDistDir = join(__dirname, "dist");
const kCssDir = join(__dirname, "public", "css");

module.exports = {
    entry: {
        "main.min.css": [
            join(kCssDir, "reset.css"),
            join(kCssDir, "style.css"),
            join(kCssDir, "table.css"),
            join(kCssDir, "fontello.css"),
            join(kCssDir, "modules", "console.css"),
            join(kCssDir, "modules", "dashboard.css"),
            join(kCssDir, "modules", "metrics.css"),
            join(kCssDir, "modules", "alerting.css")
        ],
        "main.js": [
            join(kPublicDir, "js", "master.js"),
            join(kPublicDir, "js", "utils.js"),
            join(kComponentsDir, "alarm", "alarm.js"),
            join(kComponentsDir, "modules", "dashboard.js"),
            join(kComponentsDir, "modules", "alarmconsole.js"),
            join(kComponentsDir, "modules", "metrics.js"),
            join(kComponentsDir, "modules", "alerting.js"),
            join(kComponentsDir, "popup", "popup.js"),
            join(kComponentsDir, "searchbar", "searchbar.js"),
            join(kComponentsDir, "widgets", "widget.js")
        ]
    },
    output: {
        filename: "[name]",
        path: kDistDir
    },
    mode: "development",
    devtool: "sourcemap",
    optimization: {
        usedExports: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "fonts/"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("main.min.css"),
        new CopyWebpackPlugin({
            patterns: [
                { from: join(kPublicDir, "img"), to: join(kDistDir, "img") },
                { from: join(kCssDir, "fontello.css"), to: join(kDistDir, "css", "fontello.css") },
                { from: join(kCssDir, "reset.css"), to: join(kDistDir, "css", "reset.css") },
                { from: join(kCssDir, "popup.css"), to: join(kDistDir, "css", "popup.css") },
                { from: join(kCssDir, "table.css"), to: join(kDistDir, "css", "table.css") },
                { from: join(kCssDir, "searchbar.css"), to: join(kDistDir, "css", "searchbar.css") },
                { from: join(kCssDir, "components"), to: join(kDistDir, "css", "components") },
                { from: join(kCssDir, "widgets"), to: join(kDistDir, "css", "widgets") }
                // { from: join(kPublicDir, "favicon.ico"), to: join(kDistDir, "favicon.ico") }
            ]
        })
    ]
};
