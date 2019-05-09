/* eslint-disable */
window.addEventListener("DOMContentLoaded", function() {
    // Variables
    const DOC = window.document;
    const HEAD_BUTT = DOC.getElementsByClassName("btn");
    let ACTUALIZE_BUTT = DOC.getElementById("actualize");
    const W_COLOR = "white";
    const B_COLOR = "black";

    // Event header buttons
    for (const btn of HEAD_BUTT) {
        btn.addEventListener("click", function() {
            initHead()
            btn.style.boxShadow = "0 0 10px inset #333";
            btn.style.color = W_COLOR;
            if (btn.id === "home") {
                buildAddon();
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

    // Event board buttons
    ACTUALIZE_BUTT.addEventListener("click", function(e) {
        buildAddon();
    })

    // Request http in loop
    const intervID = setInterval(function() {
        // fetch("/stat").then(async function(res) {
            
        // });
    }, 500);

    // Init style header button
    function initHead () {
        for (const btn of HEAD_BUTT) {
            btn.style.boxShadow = "";
            btn.style.color = B_COLOR;
        }
    };

    function buildAddon() {
        const target = DOC.getElementById("addons-list");
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
            const setDiv = DOC.createDocumentFragment();
            for (const addon of body) {
                const newDiv = DOC.createElement('div');
                newDiv.className = "hori-field addon";
                newDiv.id = addon.name
                newDiv.innerHTML = addon.div;
                setDiv.appendChild(newDiv);
            }
            
            target.appendChild(setDiv);
        })
    };

    // Press home button default
    document.getElementById("home").click();

});