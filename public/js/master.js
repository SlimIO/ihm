document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded");
    const pannel = document.getElementById("pannel");
    const nav = document.getElementsByTagName("nav")[0];

    pannel.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    const listOfMenus = document.querySelectorAll(".menu:not(.not-clickable)");
    for (const menu of listOfMenus) {
        menu.addEventListener("click", () => {
            console.log("menu clicked!");
        });
    }
});
