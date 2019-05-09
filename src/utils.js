/**
 * @function creaDiv
 * @desc Return a div for html file
 * @param {Object[]} infos addons infos
 * @returns {Object[]}
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

        ret.push({
            name: info.name,
            div: [
                "<ul>",
                `<li class="field1 name" style="flex-grow:2">${name}</li>`,
                `<li class="field2 description" style="flex-grow:10">${info.description}</li>`,
                `<li class="field3 version">${info.version}</li>`,
                `<li class="field4 containerVersion">${info.containerVersion}</li>`,
                `<li class="field5 ready" style="${color(info.ready, true)}">${color(info.ready)}</li>`,
                `<li class="field6 started" style="${color(info.started, true)}">${color(info.started)}</li>`,
                `<li class="field7 awake" style="${color(info.awake, true)}">${color(info.awake)}</li>`,
                `<li class="field8 callbacksDescriptor" style="flex-grow:3">${info.callbacksDescriptor}</li>`,
                "</ul>"
            ].join("")
        });
    }

    return ret;
}

/**
 * @function color
 * @description Return a color, red or green
 * @param {Boolean} bool A boolean
 * @param {Boolean} getColor A boolean
 * @returns {String}
 */
function color(bool, getColor) {
    if (getColor) {
        if (bool) {
            return "font-weight:bold;color:green";
        }

        return "font-weight:bold;color:red";
    }
    if (bool) {
        return "<i class=\"icon-ok\"></i>";
    }

    return "<i class=\"icon-cancel\"></i>";
}

module.exports = buildElem;
