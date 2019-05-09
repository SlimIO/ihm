/* eslint-disable */
(function(){
    // Variables
    const doc = window.document;
    const buttons = doc.getElementsByClassName("btn");
    const WColor = "white";
    const BColor = "black";

    // Event header button
    for (const btn of buttons) {
        btn.addEventListener("click", function() {
            initHead()
            btn.style.boxShadow = "0 0 10px inset #333";
            btn.style.color = WColor;
            if (btn.id === "home") {
                buildAddon();
            }
        });

        btn.addEventListener("mouseover", function() {
            btn.style.color = WColor;
        })

        btn.addEventListener("mouseout", function() {
            if (btn.style.boxShadow === "") {
                btn.style.color = BColor;
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
        for (const btn of buttons) {
            btn.style.boxShadow = "";
            btn.style.color = BColor;
        }
    };

    function buildAddon() {
        const target = doc.getElementById("board");
        // Dellete all divs
        for (let i = 0; i < target.children.length; i++) {
            if (target.children[i].id === "menu") {
                continue;
            }
            target.removeChild(target.children[i]);
            i--;
        }
        // Request for build div
        fetch("/build").then(function(res) {
            const target = doc.getElementById("board");
            const body = res.json();

            return body;
        }).then(function(body) {
            // Add addons
            target.innerHTML += body.join("");
        })
    };

    buildAddon();

}());