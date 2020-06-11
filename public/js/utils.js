/* eslint-disable jsdoc/require-jsdoc */
import Chart from "chart.js";

export function formatDate(date = new Date(), local = "en-GB") {
    // eslint-disable-next-line
    return Intl.DateTimeFormat(local, {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    }).format(date instanceof Date ? date : new Date(date));
}

export function createChart(canvasId, config = {}) {
    const { type, data, options } = config;

    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
        type, data,

        // Configuration options go here
        options: Object.assign({
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5
        }, options)
    });
}

export function createDOMElement(kind = "div", options = {}) {
    const { classList = [], childs = [], attributes = {}, text = null } = options;

    const el = document.createElement(kind);
    classList.forEach((name) => el.classList.add(name));
    childs.forEach((child) => el.appendChild(child));

    for (const [key, value] of Object.entries(attributes)) {
        el.setAttribute(key, value);
    }

    if (text !== null) {
        el.appendChild(document.createTextNode(String(text)));
    }

    return el;
}
