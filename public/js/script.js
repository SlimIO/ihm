/* eslint-disable */
(function(){
    // Variables
    const doc = window.document;
    const blockList = doc.getElementsByClassName("addon");

    // Animation addon list
    for (const div of blockList) {
        const cible = div.style;
        div.addEventListener("click", function(e) {
            init();
            cible.backgroundColor = "#cacaca";
            cible.boxShadow = "0 0 5px #404040";
            cible.borderColor = "#008aff";

            const req = new XMLHttpRequest();
            req.open("GET", "http://localhost:8000/infos", true);
            req.send(null);
            req.onload = function() {
                console.log(req.responseText);
            }


        });
        div.addEventListener("mouseover", function() {
            cible.backgroundColor = "#cacaca";
        })
        div.addEventListener("mouseout", function() {
            if (cible.boxShadow === "") {
                cible.backgroundColor = "#bbb";
            }
        })
    }

    // Init block addon
    function init() {
        for (const div of blockList) {
            div.style.backgroundColor = "transparent";
            div.style.boxShadow = "";
            div.style.borderColor = "#888";
        }
    }

}());