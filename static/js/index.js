let templatesLocation = "http://127.0.0.1:5500/templates/";
let home = "index.html";
let search = "search.html";

document.querySelector("#search").addEventListener("click", () => {
    window.location.href = templatesLocation + search;
});