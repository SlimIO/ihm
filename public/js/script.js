/* eslint-disable */
window.addEventListener("DOMContentLoaded", function() {
    // Constantes
    const HEAD_BUTT = document.getElementsByClassName("btn");
    const MENU_BUTT = document.getElementsByClassName("btn-menu");
    const LABELS = document.getElementsByClassName("labels");
    const INFOS = document.getElementsByClassName("infos");
    const ACTUALIZE_BUTT = document.getElementById("actualize");
    const CTX_MENU = document.getElementById("ctx-menu");
    const ALERTS = document.getElementById("alerts");
    const HOME = document.getElementById("home");
    const ALARM = document.getElementById("alarm");
    const DETAILS = document.getElementById("details");
    const ADDN_LIST = document.getElementById("addons-list")

    // Globals
    let intervID;
    let ulID = "";

    // Event header buttons
    for (const btn of HEAD_BUTT) {
        btn.addEventListener("click", function() {
            initElem("h")
            btn.classList.add("h-click");

            if (btn.id === "home-btn") {
                ALERTS.style.display = "none";
                HOME.style.display = "flex";
                getInfos("addons");
            }

            if (btn.id === "alerts-btn") {
                HOME.style.display = "none";
                ALERTS.style.display = "flex";
                ALARM.click();
            }

            if (btn.id === "test") {
                fetch("/test");
            }
        });

        btn.addEventListener("mouseover", function() {
            btn.classList.add("h-mouse-over");
        })

        btn.addEventListener("mouseout", function() {
            if (!btn.classList.contains("h-click")) {
                btn.classList.remove("h-mouse-over")
            }
        });

    };

    // Event menu buttons - page Alerts
    for (const btn of MENU_BUTT) {
        btn.addEventListener("click", function() {
            // Button animation
            initElem("m");
            btn.classList.add("m-click");
            // Display label;
            for (const label of LABELS) {
                if (label.dataset.id === btn.id) {
                    label.style.display = "flex";
                    continue;
                }
                label.style.display = "none";
            }
            // Delete #DETAILS children
            del(DETAILS);
            // Import alarms
            if (btn.id === "alarm") {
                request(btn.id);
                // clearInterval(intervID);
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
            btn.classList.add("m-mouse-over");
        })

        btn.addEventListener("mouseout", function() {
            if (!btn.classList.contains("m-click")) {
                btn.classList.remove("m-mouse-over");
            }
        });
    }

    // Event board buttons - page Home
    ACTUALIZE_BUTT.addEventListener("click", function() {
        request("addons", "addons-list");
    })

    // Event context menu (remove alarms)
    CTX_MENU.addEventListener("mouseleave", function() {
        const target = document.getElementById(ulID);
        this.style.display = "none";
        if (target) {
            document.getElementById(ulID).style.backgroundColor = "";
        }
    })
    for (const child of CTX_MENU.children) {
        child.addEventListener("click", function() {
            // Hide context menu
            this.parentNode.style.display = "none";
            // Remove alarm
            if (child.id === "remove") {
                clearInterval(intervID);
                const ulToDel = document.getElementById(child.dataset.id);
                const CID = ulToDel.dataset.cid;
                // If alarm or others
                const typeToDel = ulToDel.className.replace("infos ", "");
                const init = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ type: typeToDel, cid: CID })
                }

                fetch("/remove", init).then(function() {
                    // Id <ul> line --> remove <ul> local
                    DETAILS.removeChild(ulToDel);
                    // Remove alarm in the server
                })
            }
        })
    }

    // Request http in loop
    function reqLoop(route) {
        intervID = setInterval(execute, 1000, route);
    }

    function execute(route) {
        fetch(`/${route}`).then(async(res) => {
            if (res.status !== 200) {
                throw new Error(`Connexion failed. ${res.status} : ${res.statusText}`)
            }
            const elements = await res.json();

            // Create a set of the UUID
            const UUID_SET = new Set([...INFOS].map((elem) => elem.id));

            // If new alarms
            for(const elem of elements) {
                if (UUID_SET.has(elem.obj.uuid)) {
                    document.getElementById(elem.obj.uuid).innerHTML = elem.div;
                    continue;
                }
                DETAILS.appendChild(htmlFragment([[elem]]));
            }
            
            return;
        }).catch(function(err) {
            clearInterval(intervID);
        });
    }

    // Request for all infos type (addon, alarms etc..)
    function getInfos(nameElem, target) {
        fetch(`/${nameElem}`).then(async(body) => {
            // Array addon's infos
            const nameElemInfos = await body.json();
            // Create fragment
            const setUl = document.createDocumentFragment();
            // Del all elements html in addon-list
            del(target);
            // Create all elements
            for (const info of nameElemInfos) {
                // Add ul to the fragment
                setUl.appendChild(createUl(nameElem, info));
            }

            ADDN_LIST.appendChild(setUl);
        });
    }

    function createUl(nameElem, info) {
        // Create ul element
        const ul = document.createElement("ul");
        // Switch on nameElem (addon, alarm etc..)
        switch (nameElem) {
            case "addons":
                        // First case to Upper
                const name = `${info.name.substring(0, 1).toUpperCase()}${info.name.substring(1)}`;
                // If description field is null
                if (!info.description) {
                    info.description = "";
                }
                ul.className = "infos addons";
                ul.id = info.name;
                ul.dataset.id = info.uid;
                ul.innerHTML = [
                    `<li class="field1">${name}</li>`,
                    `<li class="field2" style="${state(info, "style")}" title="${state(info, "title")}">${state(info, "state")}</li>`,
                    `<li class="field3">${info.description}</li>`,
                    `<li class="field4">${info.version}</li>`,
                    `<li class="field5">${info.containerVersion}</li>`
                ].join("")
                break;
            case "alarms":
            
            break;
            case "entities":
                
            break;
        
            default:
                break;
        }

        return ul;
    }

    // Create state addon for getAddons function
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

    // Init style header button
    function initElem (elem) {
        for (const btn of HEAD_BUTT) {
            btn.classList.remove(`${elem}-click`, `${elem}-mouse-over`);
        }
    };

    // Delete elem children
    function del(elem) {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }

    // Create a fragment html
    function htmlFragment(body) {
        const setDiv = document.createDocumentFragment();
        for (const elem of body) {
            const ul = document.createElement("ul");
            ul.className = `infos ${body[1]}`;
            ul.id = elem.obj.uuid || elem.obj.name;
            ul.dataset.id = elem.obj.id || elem.obj.uid;
            ul.dataset.cid = elem.obj.correlate_key || "0";
            ul.innerHTML = elem.div;
            ulEvent(ul);
            setDiv.appendChild(ul);
        }

        return setDiv;
    }

    // Function Event for tools <ul> alarm
    function ulEvent(target) {
        target.addEventListener("contextmenu", function(e) {
            const { clientX, clientY } = e;
            ulID = target.id;
            target.style.backgroundColor = "rgba(172, 189, 230, .3)";
            CTX_MENU.style.display = "flex";
            CTX_MENU.style.left = `${clientX - 10}px`;
            CTX_MENU.style.top = `${clientY - 10}px`;
            CTX_MENU.children[0].innerHTML = `ID N° ${target.dataset.id}`;
            CTX_MENU.children[1].dataset.id = target.id;
        })
    }

    // Press home button default
    document.getElementById("home-btn").click();

});