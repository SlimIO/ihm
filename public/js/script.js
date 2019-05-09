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
            if (btn.id = "home") {
                
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

    // Request for build div
    (function buildAddon() {
        fetch("/build").then(async function(res) {
            const target = doc.getElementById("board");
            const body = await res.json();
            
            target.innerHTML += body.join("");
        });
    }());

}());