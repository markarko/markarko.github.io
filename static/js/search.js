import {displayChosenCourses, createCourseContainer, addEventListenersToForms} from "./utilities.js";

displayChosenCourses(true);

document.querySelector("#help").addEventListener("click", displayHelpInfo);
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector("#message").textContent = "";
    const courseNumber = e.target.elements.coursenumber.value;
    fetch("https://api.markarko.me/scheduler/courses?course-number=" + courseNumber)
        .then(response => response.json())
        .then(json => {
            clearResults();
            if (json.status === 200 || json.status === "OK"){
                json.data.forEach(course => {
                    createCourseContainer(course);
                });
                addEventListenersToForms();  
            } else {
                document.querySelector("#message").textContent = json.error;
            }
        })
        .catch(error => console.log(error));
});

function clearResults(){
    let parent = document.querySelector("#results");
    parent.innerHTML = "";
}

function displayHelpInfo(){
    document.querySelector("#message").innerText = "You can enter a full or partial course number \n Example: 420-420-DW, 603-102, 345, MQ \n Leave the input blank if you wish to see all courses";
}