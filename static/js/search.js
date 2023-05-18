import {displayChosenCourses, createCourseContainer, addEventListenersToForms} from "./utilities.js";

displayChosenCourses(true);

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector("#message").textContent = "";
    const courseNumber = e.target.elements.coursenumber.value;
    fetch("http://localhost:8000/scheduler/courses?course-number=" + courseNumber)
        .then(response => response.json())
        .then(json => {
            clearResults();
            json.data.forEach(course => {
                createCourseContainer(course);
            });
            addEventListenersToForms();  
        })
        .catch(error => console.log(error));
});

function clearResults(){
    let parent = document.querySelector("#results");
    parent.innerHTML = "";
}
