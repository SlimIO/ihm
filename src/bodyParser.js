// Require Node.js Dependencies
const queryString = require("querystring");

module.exports = async function bodyParser(req) {
    let rawBody = "";
    for await (const chunk of req) {
        rawBody += chunk;
    }

    switch (req.headers["content-type"]) {
        case "application/x-www-form-urlencoded":
            return queryString.parse(rawBody);
        case "application/json":
            return JSON.parse(rawBody);
        default:
            return rawBody;
    }
};
