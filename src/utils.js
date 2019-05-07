/**
 * @function creaDiv
 * @description Return a div for html file
 * @param {Array} infos Array infos
 * @returns {String}
 */

function creaDiv(infos) {
    const name = `${info.name.substring(0, 1).toUpperCase}${info.name.substring(1)}`;

    return [
        "<div class=\"addon\">",
        `<p>${name}</p>`,
        "<div class=\"etat\">",
        `<div style="color=${color(infos.ready)};">Ready</div>`,
        `<div style="color=${color(infos.started)};">Started</div>`
    ].join("");
}

/**
 * @function color
 * @description Return a color, red or green
 * @param {Boolean} bool A boolean
 * @returns {String}
 */
function color(bool) {
    if (bool) {
        return "green";
    }

    return "red";
}
