let templatesLocation = "http://127.0.0.1:5500/templates/";
let scheduleTemplate = "schedule.html";

displayChosenCourses();

let classColors = ["red", "blue", "green", "orange", "purple", "pink", "brown", "gray"];

function displayChosenCourses(){
    let parent = document.querySelector("#chosen-courses");
    parent.innerHTML = "";
    generateSchedules();
    
    fetch("http://localhost:8080/courses/chosen")
        .then(response => response.json())
        .then(json => {
            let courses = json.data;
            if (courses === null){
                return;
            }
            courses.forEach(course => {
                displayChosenCourse(course, parent);
            });
        })
        .catch(error => console.log(error));
}

function displayChosenCourse(course, parent){
    let courseNumber = course.courseNumber;
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
        fetch("http://localhost:8080/courses/remove?course-number=" + courseNumber)
            .then(response => response.json())
            .then(json => {
                //console.log(json);
                if (json.status === 202){
                    alert("Course removed successfully");
                    displayChosenCourses();
                } else if (json.status === 404){
                    alert("Course not found");
                } else if (json.status === 409){
                    alert("Course not chosen");
                }
            })
            .catch(error => console.log(error));
    });
}

function generateSchedules(){
    let parent = document.querySelector("#schedules");
    parent.innerHTML = "";

    fetch("http://localhost:8080/schedules")
        .then(response => response.json())
        .then(json => {
            let schedules = json.data;
            if (schedules === null){
                return;
            }
            schedules.forEach(schedule => {
                generateSchedule(schedule);
            });
        })
        .catch(error => console.log(error));
}

function generateSchedule(schedule){
    let parent = document.querySelector("#schedules");
    
    let numRows = 33;
    let numCols = 7;
    
    let gridAndTableContainer = document.createElement("div");
    gridAndTableContainer.classList.add("grid-and-table-container");
    parent.appendChild(gridAndTableContainer);

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
    parent.appendChild(scheduleInfo);

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
            console.log(singleClass.startTime);
            console.log(singleClass.endTime);
            singleClassDiv.style.gridRowStart = getRowGridPosition(singleClass.startTime) + 1;
            singleClassDiv.style.gridRowEnd = getRowGridPosition(singleClass.endTime) + 1;
            singleClassDiv.style.gridColumnStart = singleClass.dayOfWeek;
            singleClassDiv.style.gridColumnEnd = singleClass.dayOfWeek + 1;
            singleClassDiv.style.backgroundColor = classColors[classColorIndex];
            singleClassDiv.style.border = "2px solid black";
            singleClassDiv.textContent = classColorIndex+1;
            singleClassDiv.classList.add("single-class");
        }
        classColorIndex++;
    }

    let chooseScheduleButton = document.createElement("button");
    scheduleInfo.addEventListener("submit", (e) => {
        e.preventDefault();
        let scheduleInput = scheduleInfo.querySelector("input[type='hidden']").value;
        fetch("http://localhost:8080/schedules/add", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: scheduleInput})
            .then(response => response.json())
            .then(json => {
                if (json.status === 201){
                    window.location.href = templatesLocation + scheduleTemplate;
                } else {
                    alert("Couldn't add this schedule, wrong json format");
                }
            })
            .catch(error => console.log(error));
    });
    chooseScheduleButton.type = "submit";
    chooseScheduleButton.textContent = "Choose";
    scheduleInfo.appendChild(chooseScheduleButton);

    matchTableSizeToGrid();
}

function matchTableSizeToGrid(){
    let grids = document.querySelectorAll(".grid");
    let table = document.querySelector("table");

    for (let grid of grids){
        let gridWidth = table.offsetWidth;
        let gridHeight = table.offsetHeight;
        grid.style.width = gridWidth + "px";
        grid.style.height = gridHeight + "px";
    }
}

function getRowGridPosition(minutes){
    return 1 + Math.floor((minutes - 420) / 30);
}