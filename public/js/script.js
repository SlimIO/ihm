/* eslint-disable */
window.addEventListener("DOMContentLoaded", function() {
    // Variables
    const HEAD_BUTT = document.getElementsByClassName("btn");
    const MENU_BUTT = document.getElementsByClassName("btn-menu");
    const LABELS = document.getElementsByClassName("labels")
    let ACTUALIZE_BUTT = document.getElementById("actualize");
    const W_COLOR = "white";
    const B_COLOR = "black";

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
                buildAddon();
            }

            if (btn.id === "alerts-btn") {
                document.getElementById("home").style.display = "none";
                document.getElementById("alerts").style.display = "flex";
                document.getElementById("alarms").click();
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
        buildAddon();
    })

    // Request http in loop
    const intervID = setInterval(function() {
        // fetch("/stat").then(async function(res) {
            
        // });
    }, 500);

    // function alerts() {
    //     fetch("/alerts");
    // }

    function buildAddon() {
        const target = document.getElementById("addons-list");
        // Request for build div
        fetch("/build").then(function(res) {
            const body = res.json();
            // Dellete all divs
            for (let i = 0; i < target.children.length; i++) {
                target.removeChild(target.children[i]);
                i--;
            }

            return body;
        }).then(function(body) {
            // Add addons
            const setDiv = document.createDocumentFragment();
            for (const addon of body) {
                const newDiv = document.createElement('div');
                newDiv.className = "hori-field addon";
                newDiv.id = addon.name
                newDiv.innerHTML = addon.div;
                setDiv.appendChild(newDiv);
            }

            target.appendChild(setDiv);
        })
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

    // Press home button default
    document.getElementById("home-btn").click();

});