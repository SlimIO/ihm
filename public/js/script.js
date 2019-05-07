/* eslint-disable */
(function(){
    // Variables
    const doc = window.document;
    const blockList = doc.getElementsByClassName("addon");
    const req = new XMLHttpRequest();

    // Animation addon list
    for (const div of blockList) {
        const cible = div.style;
        div.addEventListener("click", function(e) {
            init();
            cible.backgroundColor = "rgba(255, 151, 3, .5)";
            cible.boxShadow = "0 0 5px #404040";
            cible.borderColor = "black";

            req.open("GET", "http://localhost:8000/infos", true);
            req.send(null);
            req.onload = function(data) {
                console.log(data);
                console.log(JSON.parse(req.response));
            }

        });
        div.addEventListener("mouseover", function() {
            cible.boxShadow = "0 0 5px #404040";
        })
        div.addEventListener("mouseout", function() {
            cible.boxShadow = "";
        })
    }

    // Request server
    const intervID = setInterval(function(){
        req.open("GET", "http://localhost:8000/etats", true);
        req.send(null);
        req.onload = function() {
           
        }
    }, 500);
    // Init block addon
    function init() {
        for (const div of blockList) {
            div.style.backgroundColor = "transparent";
            div.style.boxShadow = "";
            div.style.borderColor = "#888";
        }
    }

}());