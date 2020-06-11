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
