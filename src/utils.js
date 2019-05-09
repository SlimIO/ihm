/**
 * @function creaDiv
 * @desc Return a div for html file
 * @param {Object[]} infos addons infos
 * @returns {String[]}
 */
function buildElem(infos) {
    const ret = [];

    // Loop on all objects
    for (const info of infos) {
        // First case to Upper
        const name = `${info.name.substring(0, 1).toUpperCase()}${info.name.substring(1)}`;
        // If description field is null
        if (!info.description) {
            info.description = "";
        }

        ret.push([
            `<div class="hori-field addon" id="${info.name}">`,
            "<ul>",
            `<li class="field1 name" style="flex-grow:2">${name}</li>`,
            `<li class="field2 description" style="flex-grow:10">${info.description}</li>`,
            `<li class="field3 version">${info.version}</li>`,
            `<li class="field4 containerVersion">${info.containerVersion}</li>`,
            `<li class="field5 ready" style="font-weight:bold;color:${color(info.ready)}">${info.ready}</li>`,
            `<li class="field6 started" style="font-weight:bold;color:${color(info.started)}">${info.started}</li>`,
            `<li class="field7 awake" style="font-weight:bold;color:${color(info.awake)}">${info.awake}</li>`,
            `<li class="field8 callbacksDescriptor" style="flex-grow:3">${info.callbacksDescriptor}</li>`,
            "</ul>",
            "</div>"
        ].join(""));
    }

    return ret;
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

module.exports = buildElem;
