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
                `<li class="field1">${name}</li>`,
                `<li class="field2" style="${state(info, "style")}" title="${state(info, "title")}">${state(info, "state")}</li>`,
                `<li class="field3">${info.description}</li>`,
                `<li class="field4">${info.version}</li>`,
                `<li class="field5">${info.containerVersion}</li>`
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
                `<li class="alarm1">${info.id}</li>`,
                `<li class="alarm2">${info.uuid}</li>`,
                `<li class="alarm3">${info.message}</li>`,
                `<li class="alarm4" style="color:${color[info.severity]}">${idx[info.severity]}</li>`,
                `<li class="alarm5">${info.createdAt}</li>`,
                `<li class="alarm6">${info.updateAt}</li>`,
                `<li class="alarm7">${info.occurence}</li>`,
                `<li class="alarm8">${info.correlate_key}</li>`,
                `<li class="alarm9">${info.entity_id}</li>`
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
 * @function state
 * @description Return a color, red or green
 * @param {Object} info A boolean
 * @param {String} type A boolean
 * @returns {String}
 */
function state(info, type) {
    let str = "";

    switch (type) {
        case "title":
            str = `Started = ${info.started}, Ready = ${info.ready}`;
            break;

        case "state":
            if (info.ready && info.started) {
                str = "<i class=\"icon-ok\"></i>";
            }
            if (!info.ready && info.started) {
                str = "<i class=\"icon-attention\"></i>";
            }
            if (!info.started) {
                str = "<i class=\"icon-cancel\"></i>";
            }
            break;
        case "style":
            if (info.ready && info.started) {
                str = "color:green";
            }
            if (!info.ready && info.started) {
                str = "color:orange";
            }
            if (!info.started) {
                str = "color:red";
            }
            break;
        default:
            break;
    }

    return str;
}

module.exports = { addonBuilder, alarmBuilder, entityBuilder };
