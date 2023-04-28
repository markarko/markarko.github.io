document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const courseNumber = e.target.elements.coursenumber.value;

    fetch("http://localhost:8080/courses?course-number=" + courseNumber)
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

function createCourseContainer(course){
    let parent = document.querySelector("#results");
    let courseContainer = document.createElement("form");
    courseContainer.classList.add("course-container");
    parent.appendChild(courseContainer); 

    let courseNumberInput = document.createElement("input"); 
    courseContainer.appendChild(courseNumberInput);
    courseNumberInput.type = "hidden";
    courseNumberInput.id = "course-number";
    courseNumberInput.value = course.courseNumber;

    let infoContainer = document.createElement("div");
    courseContainer.appendChild(infoContainer);
    infoContainer.classList.add("info-container");

    let courseNumber = document.createElement("div");
    courseNumber.textContent = course.courseNumber;
    infoContainer.appendChild(courseNumber);

    let courseTitle = document.createElement("div");
    courseTitle.textContent = course.courseTitle;
    infoContainer.appendChild(courseTitle);

    let sections = document.createElement("select");
    for (let section of course.sections){
        let option = document.createElement("option");
        option.textContent = section.section;
        sections.appendChild(option);
    }

    infoContainer.appendChild(sections);

    let courseDescription = document.createElement("div");
    courseDescription.textContent = course.courseDescription;
    courseContainer.appendChild(courseDescription);
    courseDescription.classList.add("course-description");

    let chooseButton = document.createElement("button");
    chooseButton.textContent = "Choose";
    courseContainer.appendChild(chooseButton);
    chooseButton.classList.add("choose-button");
    chooseButton.type = "submit";
}

function clearResults(){
    let parent = document.querySelector("#results");
    parent.innerHTML = "";
}

function addEventListenersToForms(){
    let forms = document.querySelectorAll("form");
    for (let i = 1; i < forms.length; i++){
        let form = forms[i];
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let courseNumber = form.querySelector("#course-number").value;
            fetch("http://localhost:8080/courses/add?course-number=" + courseNumber)
                .then(response => response.json())
                .then(json => {
                    console.log(json);
                    if (json.status == 404){
                        alert("Course not found");
                    } else if (json.status == 409){
                        alert("Course already added");
                    } else if (json.status == 201){
                        alert("Course added successfully");
                    }
                })
                .catch(error => console.log(error));
            clearResults();
        });
    }
}