displayChosenCourses();
displaySchedule();

let classColors = ["red", "blue", "green", "orange", "purple", "pink", "brown", "gray"];

function displayChosenCourses(){
    let parent = document.querySelector("#chosen-courses");
    parent.innerHTML = "";
    
    fetch("http://localhost:8080/courses/chosen")
        .then(response => response.json())
        .then(json => {
            let courses = json.data;
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

function displaySchedule(){
    fetch("http://localhost:8080/schedules/get")
        .then(response => response.json())
        .then(json => {
            if (json.status == 404){
                alert(json.error);
            } else {                
                createScheduleTable();
                let schedule = json.data;
                console.log(schedule);
                let grid = document.querySelector(".grid");
                let classColorIndex = 0;
                for (let scheduleClass of schedule){

                    let courseNumber = Object.keys(scheduleClass)[0];
                    let section = scheduleClass[courseNumber].section;
                    
                    for (let singleClass of scheduleClass[courseNumber].schedules){
                        let singleClassDiv = document.createElement("span");
                        grid.appendChild(singleClassDiv);
                        singleClassDiv.style.gridRowStart = getRowGridPosition(timeToMinutes(singleClass.startTime)) + 1;
                        singleClassDiv.style.gridRowEnd = getRowGridPosition(timeToMinutes(singleClass.endTime)) + 1;
                        singleClassDiv.style.gridColumnStart = singleClass.dayOfWeek;
                        singleClassDiv.style.gridColumnEnd = singleClass.dayOfWeek + 1;
                        singleClassDiv.style.backgroundColor = classColors[classColorIndex];
                        singleClassDiv.style.border = "2px solid black";
                        singleClassDiv.innerText = courseNumber + "\nSection " + section;
                        singleClassDiv.classList.add("single-class");
                    }
                    classColorIndex++;
                }
            }
        })
        .catch(error => console.log(error));
}

function timeToMinutes(timeString){
    const [hours, minutes, seconds] = timeString.split(":");
    return (parseInt(hours) * 60) + parseInt(minutes);
}

function getRowGridPosition(minutes){
    return 1 + Math.floor((minutes - 420) / 30);
}

function createScheduleTable(){
    let parent = document.querySelector("#schedule");
    
    let numRows = 33;
    let numCols = 7;

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
            if (i === 0){
                cell.textContent = days[j];
            }
        }
        tableBody.appendChild(row);
    }   
    grid.clientHeight = grid.parentElement.offsetHeight;
}