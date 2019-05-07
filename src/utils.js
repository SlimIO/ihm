/**
 * @function creaDiv
 * @description Return a div for html file
 * @param {Array} infos Array infos
 * @returns {String}
 */

function creaDiv(infos) {
    const name = `${infos.name.substring(0, 1).toUpperCase()}${infos.name.substring(1)}`;
    const div = [
        "<div class=\"addon\">",
        `<p>${name}</p>`,
        "<div class=\"etat\">",
        `<div style="color=${color(infos.ready)};">Ready</div>`,
        `<div style="color=${color(infos.started)};">Started</div>`
    ].join("");

    return div;
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

module.exports = creaDiv;
