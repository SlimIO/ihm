(function(){
    const doc = window.document;
    const aPropos = document.getElementById("apropos");

    doc.addEventListener("DOMContentLoaded", function() {
        console.log("coucou")
        aPropos.addEventListener("scroll", function(e) {
            console.log("coucou");
        })
        aPropos.addEventListener("click", function(e) {
            console.log("coucou");
        })

    })

}());