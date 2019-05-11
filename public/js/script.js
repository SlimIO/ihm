/* eslint-disable */
window.addEventListener("DOMContentLoaded", function() {
    // Constantes
    const HEAD_BUTT = document.getElementsByClassName("btn");
    const MENU_BUTT = document.getElementsByClassName("btn-menu");
    const LABELS = document.getElementsByClassName("labels");
    const ACTUALIZE_BUTT = document.getElementById("actualize");
    const ctxMenu = document.getElementById("ctx-menu");
    const W_COLOR = "white";
    const B_COLOR = "black";

    // Globals
    let intervID;
    let ulID = "";

    // Event header buttons
    for (const btn of HEAD_BUTT) {
        const div = btn.style;
        btn.addEventListener("click", function() {
            initHead()
            div.boxShadow = "0 0 10px inset #333";
            div.color = W_COLOR;

            if (btn.id === "home-btn") {
                document.getElementById("alerts").style.display = "none";
                document.getElementById("home").style.display = "flex";
                request("addons", "addons-list", "addon");
            }

            if (btn.id === "alerts-btn") {
                document.getElementById("home").style.display = "none";
                document.getElementById("alerts").style.display = "flex";
                document.getElementById("alarms").click();
            }

            if (btn.id === "test") {
                fetch("/test");
            }
        });

        btn.addEventListener("mouseover", function() {
            div.color = W_COLOR;
        })

        btn.addEventListener("mouseout", function() {
            if (div.boxShadow === "") {
                div.color = B_COLOR;
            }
        });

    };

    // Event menu buttons - page Alerts
    for (const btn of MENU_BUTT) {
        const div = btn.style;
        const details = document.getElementById("details");
        btn.addEventListener("click", function() {
            // Button animation
            initMenu();
            div.backgroundColor = "rgba(172, 189, 230, 1)";
            div.fontWeight = "bold";
            div.boxShadow = "0 0 5px inset #444";
            // Display label;
            for (const label of LABELS) {
                if (label.dataset.id === btn.id) {
                    label.style.display = "flex";
                    continue;
                }
                label.style.display = "none";
            }
            // Delete #details children
            del(details);
            // Import alarms
            if (btn.id === "alarms") {
                request(btn.id);
                clearInterval(intervID);
                reqLoop(btn.id);
            }

            // Import entities
            if (btn.id === "entities") {
                request(btn.id);
                clearInterval(intervID);
                reqLoop(btn.id);
            }
        })

        btn.addEventListener("mouseover", function() {
            if (div.boxShadow === "") {
                div.fontWeight = "bold";
                div.backgroundColor = "#777";
            }
        })

        btn.addEventListener("mouseout", function() {
            if (div.boxShadow === "") {
                div.fontWeight = "400";
                div.backgroundColor = "#888";
            }
        });
    }

    // Event board buttons - page Home
    ACTUALIZE_BUTT.addEventListener("click", function(e) {
        request("addons", "addons-list", "hori-field addon");
    })

    // Event context menu (remove alarms)
    ctxMenu.addEventListener("mouseleave", function(event) {
        this.style.display = "none";
        document.getElementById(ulID).style.backgroundColor = "";
    })
    ctxMenu.addEventListener("click", function(event) {
        this.style.display = "none";
        document.getElementById(ulID).style.backgroundColor = "";
    })

    // Request http in loop
    function reqLoop(route) {
        intervID = setInterval(execute, 500, route);
    }

    function execute(route) {
        fetch(`/${route}`).then(async function(res) {
            const elements = await res.json();

            // Create a set of the UUID
            const targets = document.getElementsByClassName("infos");
            const details = document.getElementById("details");
            const UUID_SET = new Set();
            for (const elem of targets) {
                UUID_SET.add(elem.obj.uuid);
            }

            // If new alarms
            for(const elem of elements) {
                if (UUID_SET.has(elem.obj.uuid)) {
                    document.getElementById(elem.obj.uuid).innerHTML = elem.div;
                    continue;
                }
                del(details);
                await request(route);
            }
            
            return;
        }).catch(function() {
            clearInterval(intervID);
        });
    }

    /**
     * @function request
     * @description Request server for get infos
     * @param {!String} route Route for the server
     * @param {String} id Id for the div
     * @param {String} classN Class to add for the new elements
     * @returns {void}
     */
    function request(route, id = "details", classN = "infos") {
        const target = document.getElementById(id);
        // Request for build div
        fetch(`/${route}`).then(function(res) {
            if (route === "addons") {
                for (let i = 0; i < target.children.length; i++) {
                    target.removeChild(target.children[i]);
                    i--;
                }
            }
            return res.json();
        }).then(function(body) {
            // Add elements
            const setDiv = document.createDocumentFragment();
            for (const elem of body) {
                const ul = document.createElement("ul");
                ul.className = classN;
                ul.id = elem.obj.uuid;
                ul.dataset.id = elem.obj.id
                ul.innerHTML = elem.div;
                ulEvent(ul);
                setDiv.appendChild(ul)
            }

            target.appendChild(setDiv);
        }).catch(console.error);
    };

    // Init style header button
    function initHead () {
        for (const btn of HEAD_BUTT) {
            btn.style.boxShadow = "";
            btn.style.color = B_COLOR;
        }
    };

    // Init style menu button
    function initMenu() {
        for (const btn of MENU_BUTT) {
            btn.style.boxShadow = "";
            btn.style.backgroundColor = "#888";
            btn.style.fontWeight = "400";
        }
    };

    // Delete elem children
    function del(elem) {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }

    // Function Event for <ul> alarm
    function ulEvent(target) {
        target.addEventListener("contextmenu", function(event) {
            const { clientX, clientY } = event;
            ulID = target.id;
            target.style.backgroundColor = "rgba(172, 189, 230, .3)";
            ctxMenu.style.display = "flex";
            ctxMenu.style.left = `${clientX - 10}px`;
            ctxMenu.style.top = `${clientY - 10}px`;
            ctxMenu.children[0].innerHTML = `ID N° ${target.dataset.id}`;
        })
    }

    // Press home button default
    document.getElementById("home-btn").click();

});