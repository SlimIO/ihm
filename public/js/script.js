/* eslint-disable */
(function(){
    // Variables
    const DOC = window.document;
    const BUTTONS = DOC.getElementsByClassName("btn");
    const W_COLOR = "white";
    const B_COLOR = "black";
    const MENU_ELEMS = new Set(["label", "menu"])

    // Event header button
    for (const btn of BUTTONS) {
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

    // Request http in loop
    const intervID = setInterval(function() {
        // fetch("/stat").then(async function(res) {
            
        // });
    }, 500);

    // Init style header button
    function initHead () {
        for (const btn of BUTTONS) {
            btn.style.boxShadow = "";
            btn.style.color = B_COLOR;
        }
    };

    function buildAddon() {
        const target = DOC.getElementById("board");
        // Dellete all divs
        for (let i = 0; i < target.children.length; i++) {
            if (MENU_ELEMS.has(target.children[i].id)) {
                continue;
            }
            target.removeChild(target.children[i]);
            i--;
        }
        // Request for build div
        fetch("/build").then(function(res) {
            const target = DOC.getElementById("board");
            const body = res.json();

            return body;
        }).then(function(body) {
            // Add addons
            target.innerHTML += body.join("");
        })
    };

    buildAddon();

}());