/* eslint-disable */
window.addEventListener("DOMContentLoaded", function() {
    // Variables
    const HEAD_BUTT = document.getElementsByClassName("btn");
    const MENU_BUTT = document.getElementsByClassName("btn-menu");
    let ACTUALIZE_BUTT = document.getElementById("actualize");
    const W_COLOR = "white";
    const B_COLOR = "black";

    // Event header buttons
    for (const btn of HEAD_BUTT) {
        btn.addEventListener("click", function() {
            initHead()
            btn.style.boxShadow = "0 0 10px inset #333";
            btn.style.color = W_COLOR;

            if (btn.id === "home-btn") {
                document.getElementById("alerts").style.display = "none";
                document.getElementById("home").style.display = "flex";
                buildAddon();
            }

            if (btn.id === "alerts-btn") {
                document.getElementById("home").style.display = "none";
                document.getElementById("alerts").style.display = "flex";
                alerts()
            }
        });

        btn.addEventListener("mouseover", function() {
            btn.style.color = W_COLOR;
        })

        btn.addEventListener("mouseout", function() {
            if (btn.style.boxShadow === "") {
                btn.style.color = B_COLOR;
            }
        });

    };

    //Event menu buttons - page Alerts
    for (const btn of MENU_BUTT) {
        btn.addEventListener("click", function() {
            initMenu();
            btn.style.backgroundColor = "#666";
            btn.style.fontWeight = "bold";
            btn.style.boxShadow = "0 0 10px inset #333";
        })

        btn.addEventListener("mouseover", function() {
            btn.style.fontWeight = "bold";
            btn.style.backgroundColor = "#666";
        })

        btn.addEventListener("mouseout", function() {
            if (btn.style.boxShadow === "") {
                btn.style.fontWeight = "400";
                btn.style.backgroundColor = "#777";
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

    function alerts() {
        fetch("/alerts");
    }

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
            btn.style.backgroundColor = "#777";
            btn.style.fontWeight = "400";
        }
    };

    // Press home button default
    document.getElementById("home-btn").click();

});