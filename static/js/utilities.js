let templatesLocation = "https://markarko.me/templates/";
let searchTemplate = "search.html";
let schedulesTemplate = "schedules.html";
let scheduleTemplate = "schedule.html";

export const classColors = ["red", "blue", "green", "orange", "purple", "pink", "brown", "gray"];

export function displayChosenCourses(addGenerateSchedulesButton = true){
    let parent = document.querySelector("#chosen-courses");
    parent.innerHTML = "";
    
    let courses = localStorage.getItem("chosenCourses");
    if (courses === null){
        return;
    }
    courses = JSON.parse(courses);
    courses.forEach(course => {
        displayChosenCourse(course, parent);
    });

    if (addGenerateSchedulesButton && courses.length > 0){
        let generateSchedulesButton = document.createElement("button");
        generateSchedulesButton.textContent = "Generate";
        generateSchedulesButton.id = "generate-schedules";
        parent.appendChild(generateSchedulesButton);
        addGenerateSchedulesEventListener();
    }
}

function addGenerateSchedulesEventListener(){
    let generateSchedulesButton = document.querySelector("#generate-schedules");
    if (generateSchedulesButton !== null) {
        generateSchedulesButton.addEventListener("click", () => {
            window.location.href = templatesLocation + schedulesTemplate;
        });
    }
}

export function displayChosenCourse(course, parent){
    let courseNumber = Object.keys(course)[0];
    let chosenCourseForm = document.createElement("form");
    chosenCourseForm.classList.add("chosen-course");

    let chosenCourse = document.createElement("div");
    chosenCourseForm.appendChild(chosenCourse);
    parent.appendChild(chosenCourseForm);
    
    chosenCourse.textContent = courseNumber;
    let removeButton = document.createElement("button");
    chosenCourseForm.appendChild(removeButton);
    removeButton.type = "submit";
    removeButton.textContent = "X";
    chosenCourseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        removeChosenCourse(courseNumber);
    });
}

function removeChosenCourse(courseNumber){
    let chosenCourses = localStorage.getItem("chosenCourses");
        if (chosenCourses === null){
            return;
        }
        chosenCourses = JSON.parse(chosenCourses);
        let index = -1;
        for (let i = 0; i < chosenCourses.length; i++){
            if (chosenCourses[i][courseNumber] !== undefined){
                index = i;
                break;
            }
        }
        if (index !== -1){
            chosenCourses.splice(index, 1);
            localStorage.setItem("chosenCourses", JSON.stringify(chosenCourses));
            displayChosenCourses();
            window.location.href = window.location.href;
        }
}

export function generateSchedules(){
    let parent = document.querySelector("#schedules");
    parent.innerHTML = "";

    console.log(localStorage.getItem("chosenCourses"));

    fetch("https://api.markarko.me/scheduler/schedules", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: localStorage.getItem("chosenCourses")
        })
        .then(response => response.json())
        .then(json => {
            let schedules = json.data;
            if (schedules === null){
                return;
            }
            if (json.status === 200 || json.status === "OK"){
                schedules.forEach(schedule => {
                    generateSchedule(schedule);
                });
            } else {
                document.querySelector("#message").textContent = json.error;
            }    
        })
        .catch(error => console.log(error));
}

export function generateSchedule(schedule){
    let parent = document.querySelector("#schedules");
    
    let numRows = 33;
    let numCols = 7;
    
    let scheduleContainer = document.createElement("div");
    parent.appendChild(scheduleContainer);
    scheduleContainer.style.display = "flex";
    scheduleContainer.style.gap = "1rem";

    let gridAndTableContainer = document.createElement("div");
    gridAndTableContainer.classList.add("grid-and-table-container");
    scheduleContainer.appendChild(gridAndTableContainer);

    let grid = document.createElement("div");
    grid.classList.add("grid");
    gridAndTableContainer.appendChild(grid);

    let scheduleTable = document.createElement("table");
    gridAndTableContainer.appendChild(scheduleTable);

    let tableBody = document.createElement("tbody");
    scheduleTable.appendChild(tableBody);

    let days = ["S", "M", "T", "W", "T", "F", "S"];

    for (let i = 0; i < numRows; i++){
        let row = document.createElement("tr");

        for (let j = 0; j < numCols; j++){
            let cell = document.createElement("td");
            row.appendChild(cell);

            if (i === 0){
                cell.textContent = days[j];
            }
        }
        tableBody.appendChild(row);
    }

    let classColorIndex = 0;

    let scheduleInfo = document.createElement("form");
    scheduleInfo.classList.add("schedule-info");
    scheduleContainer.appendChild(scheduleInfo);

    let scheduleInput = document.createElement("input");
    scheduleInput.type = "hidden";
    scheduleInput.value = JSON.stringify(schedule);
    scheduleInfo.appendChild(scheduleInput);

    for (let scheduleClass of schedule){
        let classInfo = document.createElement("div");
        scheduleInfo.appendChild(classInfo);
        let courseNumber = Object.keys(scheduleClass)[0];
        let section = scheduleClass[courseNumber].section;
        classInfo.textContent = (classColorIndex+1) + " - " + courseNumber + " Section " + section;
        classInfo.style.color = classColors[classColorIndex];
        classInfo.style.fontWeight = "bold";


        for (let singleClass of scheduleClass[courseNumber].schedules){
            let singleClassDiv = document.createElement("span");
            grid.appendChild(singleClassDiv);
            singleClassDiv.style.gridRowStart = getRowGridPosition(singleClass.startTime) + 1;
            singleClassDiv.style.gridRowEnd = getRowGridPosition(singleClass.endTime) + 1;
            singleClassDiv.style.gridColumnStart = singleClass.dayOfWeek;
            singleClassDiv.style.gridColumnEnd = singleClass.dayOfWeek + 1;
            singleClassDiv.style.backgroundColor = classColors[classColorIndex];
            singleClassDiv.textContent = classColorIndex+1;
            singleClassDiv.classList.add("single-class");
        }
        classColorIndex++;
    }

    let chooseScheduleButton = document.createElement("button");
    scheduleInfo.addEventListener("submit", (e) => {
        e.preventDefault();
        let scheduleInput = scheduleInfo.querySelector("input[type='hidden']").value;
        localStorage.setItem("schedule", scheduleInput);
        window.location.href = templatesLocation + scheduleTemplate;
    });
    chooseScheduleButton.type = "submit";
    chooseScheduleButton.textContent = "Choose";
    chooseScheduleButton.classList.add("choose-schedule-button");
    scheduleInfo.appendChild(chooseScheduleButton);

    matchTableSizeToGrid();
}

export function createCourseContainer(course){
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

    let sectionsContainer = document.createElement("div");
    sectionsContainer.classList.add("dropdown-check-list");
    sectionsContainer.tabIndex = "100";
    infoContainer.appendChild(sectionsContainer);

    let anchor = document.createElement("span");
    anchor.classList.add("anchor");
    anchor.textContent = "Sections";
    sectionsContainer.appendChild(anchor);

    let sections = document.createElement("ul");
    sections.style.width = (anchor.offsetWidth - 5) + "px";
    sections.classList.add("items");
    sectionsContainer.appendChild(sections);

    let sectionContainer = document.createElement("li");
    sectionContainer.textContent = "All";
    sections.appendChild(sectionContainer);

    let sectionInput = document.createElement("input");
    sectionInput.type = "checkbox";
    sectionInput.value = -1;
    sectionContainer.appendChild(sectionInput);

    sectionInput.addEventListener("change", (e) => {
        let checkboxes = sections.querySelectorAll("input[type='checkbox']");
        for (let checkbox of checkboxes){
            checkbox.checked = e.target.checked;
        }
    });

    for (let section of course.sections){
        sectionContainer = document.createElement("li");
        sectionContainer.textContent = section.section;
        sections.appendChild(sectionContainer);

        sectionInput = document.createElement("input");
        sectionInput.type = "checkbox";
        sectionInput.value = section.section;
        sectionContainer.appendChild(sectionInput);

        sectionInput.addEventListener("change", (e) => {
            let checkboxes = sections.querySelectorAll("input[type='checkbox']");
            let allChecked = true;
            for (let i = 1; i < checkboxes.length; i++){
                let checkbox = checkboxes[i];
                if (!checkbox.checked){
                    allChecked = false;
                    break;
                }
            }
            sections.querySelector("input[type='checkbox']").checked = allChecked;
        });
    }
    
    sectionsContainer.getElementsByClassName('anchor')[0].onclick = function(evt) {
    if (sectionsContainer.classList.contains('visible')){
        sectionsContainer.classList.remove('visible');
    } else{
        sectionsContainer.classList.add('visible');
    }}

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

export function addEventListenersToForms(){
    let forms = document.querySelectorAll("form");
    for (let i = 1; i < forms.length; i++){
        let form = forms[i];
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let courseNumber = form.querySelector("#course-number").value;

            let sections = [];
            let sectionInputs = form.querySelectorAll("input[type='checkbox']");
            for (let sectionInput of sectionInputs){
                if (sectionInput.checked){
                    sections.push(sectionInput.value);
                }
            }
            
            if (sections.length == 0){
                document.querySelector("#message").textContent = "You must choose at least one section";
                return;
            }

            let chosenCourse = {};
            chosenCourse[courseNumber] = sections;
            let chosenCourses = localStorage.getItem("chosenCourses");

            if (chosenCourses === null){
                chosenCourses = [];
                chosenCourses.push(chosenCourse);
                localStorage.setItem("chosenCourses", JSON.stringify(chosenCourses));
            } else {
                let newChosenCourses = JSON.parse(chosenCourses);
                for (let chosenCourse of newChosenCourses){
                    if (chosenCourse[courseNumber] !== undefined){
                        document.querySelector("#message").textContent = "this course is already chosen";
                        return;
                    }
                }
                newChosenCourses.push(chosenCourse);
                localStorage.setItem("chosenCourses", JSON.stringify(newChosenCourses));
            }

            displayChosenCourses();
            clearResults();
        });
    }
}

export function displaySchedule(){
    let schedule = JSON.parse(localStorage.getItem("schedule"));

    if (schedule !== null){
        createScheduleTable();
        let grid = document.querySelector(".grid");
        let classColorIndex = 0;

        for (let scheduleClass of schedule){

            let courseNumber = Object.keys(scheduleClass)[0];
            let section = scheduleClass[courseNumber].section;
            
            for (let singleClass of scheduleClass[courseNumber].schedules){
                let singleClassDiv = document.createElement("span");
                grid.appendChild(singleClassDiv);
                singleClassDiv.style.gridRowStart = getRowGridPosition(singleClass.startTime) + 1;
                singleClassDiv.style.gridRowEnd = getRowGridPosition(singleClass.endTime) + 1;
                singleClassDiv.style.gridColumnStart = singleClass.dayOfWeek + 1;
                singleClassDiv.style.gridColumnEnd = singleClass.dayOfWeek + 2;
                singleClassDiv.style.backgroundColor = classColors[classColorIndex];
                singleClassDiv.innerText = courseNumber + "\nSection " + section;
                singleClassDiv.classList.add("single-class");
            }
            classColorIndex++;
        }
    }
}

function createScheduleTable(){
    let parent = document.querySelector("#schedule");
    
    let classesStartTime = 7 * 60;

    let numRows = 30;
    let numCols = 8;

    let grid = document.createElement("div");
    grid.classList.add("grid");
    parent.appendChild(grid);

    let scheduleTable = document.createElement("table");
    parent.appendChild(scheduleTable);

    let tableBody = document.createElement("tbody");
    scheduleTable.appendChild(tableBody);

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (let i = 0; i < numRows; i++){
        let row = document.createElement("tr");

        for (let j = 0; j < numCols; j++){
            let cell = document.createElement("td");
            row.appendChild(cell);

            if (j === 0 && i !== 0){
                let time = document.createElement("div");
                let startTime = (Math.floor(classesStartTime / 60)) + ":" + (classesStartTime % 60 === 0 ? "00" : classesStartTime % 60);
                classesStartTime += 30;
                let endTime = (Math.floor(classesStartTime / 60)) + ":" + (classesStartTime % 60 === 0 ? "00" : classesStartTime % 60);
                time.textContent = startTime + " - " + endTime;
                cell.appendChild(time);
            }
            
            if (i === 0 && j !== 0){
                cell.textContent = days[j-1];
            }
        }
        tableBody.appendChild(row);
    }   
    grid.style.height = grid.parentElement.offsetHeight + "px";
}

export function matchTableSizeToGrid(){
    let grids = document.querySelectorAll(".grid");
    let table = document.querySelector("table");

    for (let grid of grids){
        let gridWidth = table.offsetWidth;
        let gridHeight = table.offsetHeight;
        grid.style.width = gridWidth + "px";
        grid.style.height = gridHeight + "px";
    }
}

export function getRowGridPosition(minutes){
    return 1 + Math.floor((minutes - 420) / 30);
}

function clearResults(){
    let parent = document.querySelector("#results");
    parent.innerHTML = "";
}
