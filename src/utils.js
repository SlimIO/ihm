/**
 * @function creaDiv
 * @description Return a div for html file
 * @param {Array} infos Array infos
 * @returns {String}
 */

function creaDiv(infos) {
    // First case to Upper
    const name = `${infos.name.substring(0, 1).toUpperCase()}${infos.name.substring(1)}`;

    return [
        `<div class="addon" id="${infos.name}">`,
        `<p>${name}</p>`,
        "<div class='etat'>",
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

module.exports = creaDiv;
