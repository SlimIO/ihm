/**
 * @function addonBuilder
 * @desc Return a div for html file
 * @param {Object[]} infos addons infos
 * @returns {Object[]}
 */
function addonBuilder(infos) {
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
            obj: info,
            name: info.name,
            div: [
                `<li class="field1 name" style="flex-grow:2">${name}</li>`,
                `<li class="field2 description" style="flex-grow:10">${info.description}</li>`,
                `<li class="field3 version">${info.version}</li>`,
                `<li class="field4 containerVersion">${info.containerVersion}</li>`,
                `<li class="field5 ready" style="${color(info.ready, true)}">${color(info.ready)}</li>`,
                `<li class="field6 started" style="${color(info.started, true)}">${color(info.started)}</li>`,
                `<li class="field7 awake" style="${color(info.awake, true)}">${color(info.awake)}</li>`,
                `<li class="field8 callbacksDescriptor" style="flex-grow:3">${info.callbacksDescriptor}</li>`
            ].join("")
        });
    }

    return ret;
}

/**
 * @function alarmBuilder
 * @desc Return a div for html file
 * @param {Object[]} infos addons infos
 * @returns {Object[]}
 */
function alarmBuilder(infos) {
    const ret = [];
    const idx = {
        0: "Critical",
        1: "Major",
        2: "Minor"
    };
    const color = {
        0: "red",
        1: "orange",
        2: "green"
    };

    // No alarms
    if (infos.length === 0) {
        return ret;
    }
    // Loop an all objects
    for (const info of infos) {
        ret.push({
            obj: info,
            div: [
                `<li class="alarms1">${info.id}</li>`,
                `<li class="alarms2">${info.uuid}</li>`,
                `<li class="alarms3">${info.message}</li>`,
                `<li class="alarms4" style="color:${color[info.severity]}">${idx[info.severity]}</li>`,
                `<li class="alarms5">${info.createdAt}</li>`,
                `<li class="alarms6">${info.updateAt}</li>`,
                `<li class="alarms7">${info.occurence}</li>`,
                `<li class="alarms8">${info.correlate_key}</li>`,
                `<li class="alarms9">${info.entity_id}</li>`
            ].join("")
        });
    }

    return ret;
}

/**
 * @function entityBuilder
 * @desc Return a div for html file
 * @param {Object[]} infos addons infos
 * @returns {Object[]}
 */
function entityBuilder(infos) {
    const ret = [];

    // No entity
    if (infos.length === 0) {
        return ret;
    }
    // Loop an all objects
    for (const info of infos) {
        ret.push({
            obj: info,
            div: [
                `<li class="entities1">${info.id}</li>`,
                `<li class="entities2">${info.uuid}</li>`,
                `<li class="entities3">${info.parent}</li>`,
                `<li class="entities4">${info.name}</li>`,
                `<li class="entities5">${info.description}</li>`,
                `<li class="entities6">${info.createdAt}</li>`
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

module.exports = { addonBuilder, alarmBuilder, entityBuilder };
