function formatDate(date = new Date(), local = "en-GB") {
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

function createChart(canvasId, config = {}) {
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

function createFastElement(kind = "div", options = {}) {
    const { classList = [] } = options;

    const el = document.createElement(kind);
    for (const name of classList) {
        el.classList.add(name);
    }

    return el;
}
