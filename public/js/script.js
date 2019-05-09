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
        })

        btn.addEventListener("mouseover", function() {
            btn.style.color = WColor;
        })

        btn.addEventListener("mouseout", function() {
            if (btn.style.boxShadow === "") {
                btn.style.color = BColor;
            }
        })
    }

    // Init style header button
    function initHead () {
        for (const btn of buttons) {
            btn.style.boxShadow = "";
            btn.style.color = BColor;
        }
    }
}());