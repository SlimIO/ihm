// Require Node.js Dependencies
import queryString from "querystring";

/**
 * @async
 * @function bodyParser
 * @param {*} req
 * @returns {Promise<any>}
 */
export default async function bodyParser(req) {
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
}
