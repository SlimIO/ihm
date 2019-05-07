/* eslint-disable */
(function(){
    // Variables
    const doc = window.document;
    const blockList = doc.getElementsByClassName("addon");
    const req = new XMLHttpRequest();

    // Animation addon list
    for (const div of blockList) {
        // Init const
        const target = div.style;
        const targetP = div.children[0].style;

        // Event click
        div.addEventListener("click", function(e) {
            init();
            // Style div
            target.backgroundColor = "rgba(255, 151, 3, .5)";
            target.boxShadow = "0 0 5px #404040";
            target.borderColor = "black";

            // Style p
            targetP.backgroundColor = "#111";
            targetP.color = "white";

            // Req ajax
            req.open("GET", "http://localhost:8000/infos", true);
            req.send(null);
            req.onload = function(data) {
                console.log(data);
                console.log(JSON.parse(req.response));
            }

        });

        // Events mouse
        div.addEventListener("mouseover", function() {
            target.boxShadow = "0 0 5px #404040";
        })

        div.addEventListener("mouseout", function() {
            if (target.borderColor !== "black") {
                target.boxShadow = "";
            }
        })
    }

    // Request server
    const intervID = setInterval(function(){
        req.open("GET", "http://localhost:8000/stat", true);
        req.send(null);
        req.onload = function() {
           const data = JSON.parse(req.response);
           console.log(data);
        }
    }, 2000);

    // Init block addon
    function init() {
        for (const div of blockList) {
            // Init const
            const target = div.style;
            const targetP = div.children[0].style;
            // Style Div
            target.backgroundColor = "transparent";
            target.boxShadow = "";
            target.borderColor = "#888";
            // Style p
            targetP.backgroundColor = "#dfdfdf";
            targetP.color = "black";
        }
    }
}());