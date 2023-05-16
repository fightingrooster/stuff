const taskStatuses = {
  inProgress: { statusName: 'in progress', statusColor: '#f6d78b' ,color:"black"},
  completed: { statusName: 'completed', statusColor: '#3cbab0' ,color:"white"},
  canceled: { statusName: 'canceled', statusColor: '#ff5963' ,color:"white"},
  testing: { statusName: 'testing', statusColor: '#1f99fe' ,color:"white"},
  backlog: { statusName: 'backlog', statusColor: '#9aa8bb' ,color:"white"},
  onHold: { statusName: 'on hold', statusColor: '#8348ff' ,color:"white"},
};

const tasks1: Task[] = [
  {
    taskID: '1',
    taskName: 'test task 1',
    taskDuration: 1,
    taskStartDate: '5/5/2023',
    taskEndDate: '15/5/2023',
    status: taskStatuses.inProgress,
    taskOwner:"Daniel De Lima",
    milestoneId: '123',
  },
  {
    taskID: '2',
    taskName: 'test task 2',
    taskDuration: 2,
    taskStartDate: '9/5/2023',
    taskEndDate: '17/5/2023',
    status: taskStatuses.completed,
    milestoneId: '123',
  },
  {
    taskID: '3',
    taskName: 'test task 3',
    taskDuration: 3,
    taskStartDate: '3/5/2023',
    taskEndDate: '10/7/2023',
    status: taskStatuses.canceled,
    taskOwner:"Daniel De Lima",
    milestoneId: '123',
  },
];

const tasks2: Task[] = [
  {
    taskID: '4',
    taskName: 'test task 4',
    taskDuration: 4,
    taskStartDate: '4/5/2023',
    taskEndDate: '8/8/2023',
    status: taskStatuses.testing,
    milestoneId: '123',
  },
  {
    taskID: '5',
    taskName: 'test task 5',
    taskDuration: 5,
    taskStartDate: '4/8/2023',
    taskEndDate: '10/8/2023',
    status: taskStatuses.onHold,
    milestoneId: '123',
  },
];

const milestones: Milestone[] = [
  {
    milestoneId: '123',
    milestoneName: 'Front End',
    milestoneStartDate: '5/1/2023',
    milestoneEndDate: '10/10/2023',
    tasks: tasks1,
  },
  {
    milestoneId: '456',
    milestoneName: 'Back End ',
    milestoneStartDate: '5/1/2023',
    milestoneEndDate: '10/10/2023',
    tasks: tasks2,
  },
  {
    milestoneId: '789',
    milestoneName: 'UI Design ',
    milestoneStartDate: '5/1/2023',
    milestoneEndDate: '10/10/2023',
  },
];

const monthMapping: { [key: string]: string } = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

type WeekDay = {
  weekDay: string;
  dayNumber: number;
};

type DateInput = {
  year: number;
  day: number;
  month: number;
};

type Status = {
  statusName: string;
  statusColor: string;
};

type Task = {
  taskID: string;
  taskName: string;
  taskDuration: number;
  //D/M/YYYY
  taskStartDate: string;
  taskEndDate: string;
  taskOwner?: string;
  status: Status;
  milestoneId: string;
};

type Milestone = {
  milestoneId: string;
  milestoneName: string;
  milestoneStartDate: string;
  milestoneEndDate: string;
  tasks?: Task[];
};


function triggerDatePickerListener(){
    const datePicker = document.getElementById("date-input") as HTMLInputElement;
    datePicker.addEventListener('change',()=>{
        const dateInput:DateInput | undefined = formatDatePickerValue(datePicker.value);
        if(dateInput!== undefined){
            placeChartContainerData(milestones, dateInput);
            generateCalendarView(dateInput);
            generateChartGridColumns(dateInput);
            styleIndicatorLines();
            registerMilestoneToggleListeners()
            toggleHoverContainer();
        }
    });
}

function triggerDatePickerButtonsListeners(){
    const datePickerBtnLeft = document.getElementById('date-picker-btn-left');
    const datePickerBtnRight = document.getElementById('date-picker-btn-right');
    const dateInput = document.getElementById("date-input") as HTMLInputElement;

    datePickerBtnLeft?.addEventListener('click', ()=>{
        if(dateInput.value === ""){
            const newDate = new Date();
            let month = newDate.getMonth();

            if(month===0){
                dateInput.value = `${newDate.getFullYear()-1}-12-01`;
            }else{
                let newMonth:string = month.toString();
                if(month <10){
                    newMonth = `0${month}`;
                }
                dateInput.value = `${newDate.getFullYear()}-${newMonth}-01`;
            }


        }else{
            let [year, month] = dateInput.value.split("-");
            if (month.charAt(0) === '0') {
                month = month.replace('0', '');
            }

            if(Number(month)===1){
                dateInput.value = `${Number(year)-1}-12-01`;
            }else{
                const incrementedMonth = (Number(month)-1).toString();
                let newMonth: string = incrementedMonth; 
                if(Number(incrementedMonth) < 10){
                    newMonth = `0${incrementedMonth}`;
                }
                dateInput.value = `${year}-${newMonth}-01`;
            }
        }
        const dateInputValue:DateInput | undefined = formatDatePickerValue(dateInput.value);
        placeChartContainerData(milestones, dateInputValue);
        generateCalendarView(dateInputValue);
        generateChartGridColumns(dateInputValue);
        styleIndicatorLines();
        registerMilestoneToggleListeners();
        toggleHoverContainer();
    });

    datePickerBtnRight?.addEventListener('click', ()=>{
        if(dateInput.value === ""){
            const newDate = new Date();
            let month = newDate.getMonth()+1;

            if(month===12){
                dateInput.value = `${newDate.getFullYear()+1}-01-01`;
            }else{
                let newMonth:string = (month+1).toString();
                if(month+1 <10){
                    newMonth = `0${month+1}`;
                }
                dateInput.value = `${newDate.getFullYear()}-${newMonth}-01`;
            }

        }else{
            let [year, month] = dateInput.value.split("-");

            if (month.charAt(0) === '0') {
                month = month.replace('0', '');
            }

            if(Number(month)===12){
                dateInput.value = `${Number(year)+1}-01-01`;
            }else{
                const incrementedMonth = (Number(month)+1).toString();
                let newMonth: string = incrementedMonth; 
                if(Number(incrementedMonth) < 10){
                    newMonth = `0${incrementedMonth}`;
                }
                dateInput.value = `${year}-${newMonth}-01`;
            }
        }
        const dateInputValue:DateInput | undefined = formatDatePickerValue(dateInput.value);
        placeChartContainerData(milestones, dateInputValue);
        generateCalendarView(dateInputValue);
        generateChartGridColumns(dateInputValue);
        styleIndicatorLines();
        registerMilestoneToggleListeners();
        toggleHoverContainer();
    });
}

function formatDatePickerValue(value:string):DateInput | undefined{
    if(value !=="" && value!== undefined && value!== null){
        let [year, month, day] = value.split('-');
        if (month.charAt(0) === '0') month = month.replace('0', '');
        return {
            year: Number(year),
            month: Number(month),
            day: Number(day),
        }

    }
    return;
}

function getDaysOfTheMonth(dateInput?:DateInput):number{
    if(dateInput !== undefined){
        const currentDate = new Date(dateInput.year, dateInput.month, dateInput.day);
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    }
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
}

function getWeekDaysOfTheMonth(dateInput?:DateInput):WeekDay[]{
    const weekDays:WeekDay[] = [];
    const weekDayAbbreviations:string[] = ['S', 'M', 'T', 'W', 'T','F', 'S'];
    
    if(dateInput !== undefined){
        const days = getDaysOfTheMonth(dateInput);
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();

        for(let i = 0; i<days; ++i){
            const date = new Date(year, month, i+1);
            weekDays.push({weekDay:weekDayAbbreviations[date.getDay()],dayNumber:i+1})

        }
        return weekDays;
    }
    //TODO: make it into smaller function
    const days = getDaysOfTheMonth(dateInput);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    for(let i = 0; i<days; ++i){
        const date = new Date(year, month, i+1);
        weekDays.push({weekDay:weekDayAbbreviations[date.getDay()],dayNumber:i+1})

    }
    return weekDays;

}

function generateChartGridColumns(dateInput?:DateInput):void{
    
    const days = getDaysOfTheMonth(dateInput);
    const weekDays = getWeekDaysOfTheMonth(dateInput);

    const chartGridElement = document.querySelectorAll('.task-grid-lines') as NodeListOf<HTMLDivElement>;
    
    chartGridElement.forEach((gridElement)=>{
        gridElement.style.gridTemplateColumns = `repeat(${days}, 1fr)`;

        if(gridElement.hasChildNodes()){
            while(gridElement.firstChild){
                if(gridElement.lastChild){
                    gridElement.removeChild(gridElement.lastChild);
                }
            }
        }

        
        for(let i=0; i<days; ++i){
            const spanElement = document.createElement('span');
            spanElement.className = 'span-grid-column';
            spanElement.id = `span-${weekDays[i].dayNumber}`;
            
            if(isWeekendDay(weekDays[i].weekDay)){
                spanElement.style.background = '#F3F5F6';
            }
            gridElement.appendChild(spanElement);
        }
    });
}

function getDateName(dateInput:DateInput | undefined){
    if(dateInput){
        return `${monthMapping[dateInput.month]} ${dateInput.day} ${dateInput.year}`; 
    }
    const date = new Date();
    return `${monthMapping[date.getMonth()+1]} ${date.getDate()} ${date.getFullYear()}`; 
}

function generateCalendarView(dateInput?:DateInput){
    const dateTitle = document.getElementById('picker-date-title') as  HTMLHeadingElement; 

    const dateName = getDateName(dateInput);
    if(dateName) dateTitle.innerHTML = dateName;

    const days = getDaysOfTheMonth(dateInput);
    const weekDays = getWeekDaysOfTheMonth(dateInput);

    const calendarElement = document.querySelector('.calendar') as HTMLDivElement;
    calendarElement.style.gridTemplateColumns = `repeat(${days}, 1fr)`;

    if(calendarElement.hasChildNodes()){
        while(calendarElement.firstChild){
            if(calendarElement.lastChild){
                calendarElement.removeChild(calendarElement.lastChild);
            }
        }
    }

    for(let i=0; i<days; ++i){
        const spanElement = document.createElement('span');
        spanElement.className = 'span-grid-column-cal';
        //TODO: Dangerous zone
        spanElement.id = `span-${weekDays[i].dayNumber}`;
        spanElement.innerHTML = `
            <p>${weekDays[i].weekDay}</p>  
            <p>${weekDays[i].dayNumber}</p>  
        `;
        calendarElement.appendChild(spanElement);
    }
}

function toggleDatePicker(){
    const pickerElement = document.querySelector('.picker') as HTMLDivElement;
    const dateInput = document.getElementById("date-input") as HTMLInputElement;
    pickerElement.addEventListener('click',()=>{
        //dateInput.classList.toggle('date-input');
        dateInput.showPicker();
    });
}


function isWeekendDay(weekday:string){
    return weekday === 'S'
}

function styleIndicatorLines(){
    const chartContainers = document.querySelectorAll('.chart-container') as NodeListOf<HTMLElement>;
    if(chartContainers){
        for(let chartContainer of chartContainers){
            const lines = chartContainer.querySelectorAll('.indicator-line') as NodeListOf<HTMLElement>;
            if(lines.length>0){
                lines[lines.length-1].style.borderLeft = "0px"
                lines[lines.length-2].style.borderBottomLeftRadius = "0.5rem"
            }
        }

    }
}

function createHtmlElement(htmlString:string){
   const template:HTMLTemplateElement = document.createElement('template'); 
   template.innerHTML = htmlString.trim();
   return template.content.firstElementChild;
}

function createChartContainerElement(milestoneTitle:string,milestoneId:string,tasks:Task[]| undefined, dateInput?:DateInput){
    const tasksHtml = createTasksHtml(tasks, dateInput);
    const milestoneTaskHtml =createMilestoneTaskHtml(tasks);
    const milestoneContainerHtml = createMilestoneContainerHtml(milestoneTitle, milestoneId, milestoneTaskHtml);
    const chartContainerHtml = createChartContainerHtml(milestoneId,milestoneContainerHtml,tasksHtml);
    const chartContainerElement = createHtmlElement(chartContainerHtml);
    return chartContainerElement;
}

function createChartContainerHtml(milestoneId:string,milestoneContainerHtml:string, tasksHtml:string){
    return `
        <div class="chart-container">
            ${milestoneContainerHtml}
            <div class="task-grid-lines-wrapper">
                <div class="task-grid-lines"></div>
                    <div class="tasks-grid" id="tasks-grid-${milestoneId}">
                        ${tasksHtml}
                    </div>
                </div>
        </div>
    `
}

function createTasksHtml(tasks:Task[] | undefined,dateInput?:DateInput){
    if(tasks === undefined) return "";
    let currentDate:Date | undefined;
    let year = 0;
    let month = 0;
    let lastdayOfTheMonth = 0;
    let borderStyle = '';
    let tasksHtml = '';

    if(dateInput){
        currentDate = new Date(dateInput.year, dateInput.month, dateInput.day);
        year = currentDate.getFullYear();
        month = currentDate.getMonth();
        lastdayOfTheMonth = new Date(year,month, 0).getDate()+1;
    }else{
        currentDate = new Date();
        year = currentDate.getFullYear();
        month = currentDate.getMonth()+1;
        lastdayOfTheMonth = new Date(year,month, 0).getDate()+1;
    }

    tasks.forEach((task:Task, _:number)=>{
        const startDate = getDateObject(task.taskStartDate);
        const endDate = getDateObject(task.taskEndDate);
        const background = `background:${task.status.statusColor}`;

        if(startDate.year === year){
            if(startDate.month === month ){
                if(endDate.month === month){
                    borderStyle = 'border-radius:0.85rem'
                    tasksHtml += `<div class="task" id="${task.taskID}" style="grid-column:${startDate.day}/${endDate.day+1};${borderStyle};${background}">${task.taskName}</div>`;
                }else{
                    borderStyle = 'border-radius:0.85rem 0 0 0.85rem';
                    tasksHtml += `<div class="task" id="${task.taskID}" style="grid-column:${startDate.day}/${lastdayOfTheMonth+1};${borderStyle};${background}">${task.taskName}</div>`;
                }
            }
            else if(month === endDate.month){
                borderStyle = 'border-radius:0 0.85rem 0.85rem 0';
                tasksHtml += `<div class="task" id="${task.taskID}" style="grid-column:${1}/${endDate.day+1};${borderStyle};${background}">${task.taskName}</div>`;
            }
            else if(month > startDate.month && month < endDate.month){
                    tasksHtml += `<div class="task" id="${task.taskID}" style="grid-column:${1}/${lastdayOfTheMonth+1};${background}">${task.taskName}</div>`;
            }else{
                tasksHtml += `<div class="task-not-visible" id="${task.taskID}" style="grid-column:${1}/${lastdayOfTheMonth+1};"></div>`;
            }
        }
    });
    return tasksHtml;
}

function createMilestoneContainerHtml(milestoneTitle:string,milestoneId:string, milestoneTaskHtmlString:string){
    return`
        <div class="milestone-container">
            <div class="milestone-title">
                <div class="milestone-toggle toggle-down" id="toggle-container-down-${milestoneId}">
                    <i class="fa-solid fa-chevron-down" id="toggle-down-${milestoneId}"></i> 
                </div>
                <div class="milestone-toggle toggle-right" id="toggle-container-right-${milestoneId}">
                    <i class="fa-solid fa-chevron-right" id="toggle-right-${milestoneId}"></i> 
                </div>
                <p>${milestoneTitle}</p>
            </div>
            <div class="milestone-tasks" id="milestone-tasks-${milestoneId}">
                ${milestoneTaskHtmlString}
            </div>
        </div>
    `
}

function registerMilestoneToggleListeners(){

    const toggles = document.querySelectorAll(`.toggle-down`) as NodeListOf<HTMLDivElement>;
    toggles.forEach((toggle)=>{
        //make it visible
        toggle.classList.toggle("toggle-visible");
        toggle.addEventListener('click',(event: MouseEvent)=>{
             
            //on click make it invisible
            toggle.classList.toggle("toggle-visible");

            if (event.target instanceof Element){
                // id is at last position
                let id = "";
                if(event.target.id.includes('toggle-container-down')){
                    id = event.target.id.split("-")[3];
                     
                }else{
                    id = event.target.id.split("-")[2];
                }
                //hide other containers
                const milestoneTasksContainer = document.getElementById(`milestone-tasks-${id}`) as HTMLDivElement;
                const tasksGridContainer = document.getElementById(`tasks-grid-${id}`) as HTMLDivElement;
               
                tasksGridContainer.style.display ="none";
                milestoneTasksContainer.style.display ="none";

                const toggleRight = document.getElementById(`toggle-container-right-${id}`) as HTMLDivElement;
                toggleRight.classList.toggle("toggle-visible");
            }
        });
    });

    const togglesRight = document.querySelectorAll('.toggle-right') as NodeListOf<HTMLDivElement>;
    togglesRight.forEach((toggle)=>{
        toggle.addEventListener('click',(event:MouseEvent)=>{

            if (event.target instanceof Element){

                let id = "";
                if(event.target.id.includes('toggle-container-right')){
                    id = event.target.id.split("-")[3];
                     
                }else{
                    id = event.target.id.split("-")[2];
                }

                toggle.classList.toggle("toggle-visible");
                const toggleDown = document.getElementById(`toggle-container-down-${id}`) as HTMLDivElement;
                toggleDown.classList.toggle("toggle-visible");


                const milestoneTasksContainer = document.getElementById(`milestone-tasks-${id}`) as HTMLDivElement;
                const tasksGridContainer = document.getElementById(`tasks-grid-${id}`) as HTMLDivElement;
                 
               
                tasksGridContainer.style.display ="grid";
                milestoneTasksContainer.style.display ="block";

            }
        });
    });
}


function createMilestoneTaskHtml(tasks:Task[] | undefined){
    if(tasks === undefined) return "";
    let milestoneTaskHtml = '';
    for(let task of tasks){
        milestoneTaskHtml += `
        <div class="milestone-task">
        <div class="indicator-lines">
        <div class="indicator-line"></div>
        <div class="indicator-line"></div>
        </div>
        <div class="milestone-task-content">
        <div class="milestone-task-name">${task.taskName}</div>
        <div class="milestone-task-duration">${task.taskDuration} days</div>
        </div>
        </div>
        `
    }
    return milestoneTaskHtml;

}

function getDateObject(dateStr:string){
  const [day, month, year] = dateStr.split('/');
  return {day:Number(day), month:Number(month), year: Number(year)}
}

function registerAddTaskBtnListener(){
    const newTaskBtn = document.getElementById('new-task-btn') as HTMLDivElement;
    newTaskBtn.addEventListener('click',()=>{
        const form = document.getElementById('add-new-task-form') as HTMLFormElement;
        form.classList.toggle("form-show");
    });
}

function registerAddMilestoneBtnListener(){
    const newTaskBtn = document.getElementById('new-milestone-btn') as HTMLDivElement;
    newTaskBtn.addEventListener('click',()=>{
        const form = document.getElementById('add-new-milestone-form') as HTMLFormElement;
        form.classList.toggle("form-show");
    });
}

function registerCloseWindowsListener(){
    const taskForm = document.getElementById('add-new-task-form') as HTMLFormElement;
    const milestoneForm = document.getElementById('add-new-milestone-form') as HTMLFormElement;
    const taskDeletionScreen = document.querySelector(".task-deletion-screen") as HTMLDivElement;

    document.addEventListener('click',(event:MouseEvent)=>{
       if (event.target instanceof Element){
           if(!event.target.matches('#new-task-btn')){
               if(taskForm.classList.contains("form-show")){
                   taskForm.classList.remove("form-show")
               }
           }

           if(!event.target.matches('#new-milestone-btn')){
               if(milestoneForm.classList.contains("form-show")){
                   milestoneForm.classList.remove("form-show")
               }
           }

           if(!event.target.matches('.task-menu-option-delete')){
               if(taskDeletionScreen.classList.contains("task-deletion-show")){
                   taskDeletionScreen.classList.remove("task-deletion-show")
               }


               const taskMenuStatuses = document.querySelectorAll('.task-menu-statuses') as NodeListOf<HTMLDivElement>;
               taskMenuStatuses.forEach((statuses)=>{
                   statuses.style.display = "none";
               });
           }
       }
    });

    taskForm.addEventListener('click',(event)=>{
        event.stopPropagation();
    });

    milestoneForm.addEventListener('click',(event)=>{
        event.stopPropagation();
    });

    //taskDeletionScreen.addEventListener('click',(event)=>{
    //    event.stopPropagation();
    //});
}

function placeChartContainerData(milestones:Milestone[],dateInput?:DateInput){
    const chartContentElements = document.querySelectorAll(".chart-content") as NodeListOf<HTMLDivElement>;
    chartContentElements.forEach((chartContentElement)=>{
        if(chartContentElement.hasChildNodes()){
            while(chartContentElement.firstChild){
                if(chartContentElement.lastChild){
                    chartContentElement.removeChild(chartContentElement.lastChild);
                }
            }
        }
    });

    milestones.forEach((milestone:Milestone)=>{
        const chartContainerElement = createChartContainerElement(milestone.milestoneName,milestone.milestoneId, milestone.tasks, dateInput);
        const chartContentElement = document.querySelector(".chart-content") as HTMLDivElement;

        if(chartContainerElement !== null){
            chartContentElement.appendChild(chartContainerElement);
        }
    });
}

function createTaskHoverContainerHtml(task:Task | undefined){
    if(task === undefined) return "";
    return `
        <div class="task-hover-container" id="task-hover-${task.taskID}">
            <div class="task-hover-wrapper">
                <p class="hover-label" id="task-name-label">Task Name</p>
                <p class="hover-value" id="task-name">${task.taskName}</p>

                <p class="hover-label" id="task-milestone-label">Milestone</p>
                <p class="hover-value" id="task-milestone">${task.milestoneId}</p>
            </div>

            <div class="task-hover-wrapper">
                <p class="hover-label" id="task-assigned-label">Assigned to</p>
                <p class="hover-value"id="task-assigned">${task.taskOwner}</p>

                <p class="hover-label" id="task-start-date-label">Start/End Date</p>
                <p class="hover-value" id="task-start-date">${task.taskStartDate} - ${task.taskEndDate}</p>
            </div>

            <div class="task-hover-wrapper">
                <p class="hover-label" id="task-status-label">Status</p>
                <p class="hover-value"id="task-assigned">${task.status.statusName}</p>
            </div>
        </div>
    `;
}

function toggleHoverContainer(){
    const tasks = document.querySelectorAll('.task') as NodeListOf<HTMLDivElement>;
    tasks.forEach((task)=>{
        task.addEventListener('mouseenter',(event:MouseEvent)=>{
             
            if(event.target instanceof Element){
                const id = event.target.id;
                const taskHover = document.getElementById(`task-hover-${id}`) as HTMLDivElement;
                taskHover.classList.toggle('task-hover-visible');

                let left = event.clientX+200 + 'px';
                let top = event.clientY-100 + 'px';

                taskHover.style.left = left;
                taskHover.style.top = top;

            }
        });

        task.addEventListener('mouseleave',(event:MouseEvent)=>{
             
            if(event.target instanceof Element){
                const id = event.target.id;
                const taskHover = document.getElementById(`task-hover-${id}`) as HTMLDivElement;
                taskHover.classList.toggle('task-hover-visible');
            }
        });
    });
}

function createTaskMenuHtml(task:Task){
    return `
        <div class="task-menu" id="task-menu-${task.taskID}">
            <div class="wrapper">
                <div class="task-menu-option">
                    <p>Mark as done</p>
                </div>
                <div class="task-menu-option">
                    <i class="fa-regular fa-pen-to-square"></i>
                    <p>Edit</p>
                </div>
                <div class="task-menu-option" id="task-menu-progress">
                    <i class="fa-regular fa-flag"></i>
                    <p>Progress</p>
                </div>
                <div class="task-menu-option task-menu-option-delete" id="task-menu-option-delete-${task.taskID}">
                    <i class="fa-regular fa-trash-can"></i>
                    <p>Delete</p>
                </div>
            </div>

            <div class="task-menu-statuses">

                <div class="task-menu-option id="task-menu-option-status-progress">
                    <p>In Progress</p>
                </div>

                <div class="task-menu-option id="task-menu-option-status-canceled">
                    <p>Canceled</p>
                </div>

                <div class="task-menu-option id="task-menu-option-status-complete">
                    <p>Complete</p>
                </div>

                <div class="task-menu-option id="task-menu-option-status-hold">
                    <p>On Hold</p>
                </div>

                <div class="task-menu-option id="task-menu-option-status-backlog">
                    <p>Backlog</p>
                </div>
            </div>
        </div>
    `;

}


function showTaskMenuOnClick(){
    let taskMenu:HTMLElement | undefined;

    const tasks = document.querySelectorAll('.task') as NodeListOf<HTMLDivElement>;
    tasks.forEach((task)=>{
        task.addEventListener('click',(event:MouseEvent)=>{
            if(event.target instanceof Element){
                const id = event.target.id;
                 taskMenu = document.getElementById(`task-menu-${id}`) as HTMLDivElement;
                //taskMenu.classList.toggle("task-menu-visible");
                taskMenu.style.display = "flex";

                let left = event.clientX + 'px';
                let top = event.clientY + 'px';

                taskMenu.style.left = left;
                taskMenu.style.top = top;


                event.stopPropagation();



                //taskMenuProgress.addEventListener('mouseleave',()=>{
                //    const taskMenuStatuses = document.querySelector('.task-menu-statuses') as HTMLDivElement;
                //    console.log(taskMenuStatuses);
                //    taskMenuStatuses.style.display = "none";

                //});
            }
        });
    });

    
    document.addEventListener('click',(event:MouseEvent)=>{
        if (event.target instanceof Element){
            if(taskMenu){
                if(taskMenu.style.display ==="flex"){
                    taskMenu.style.display = "none";
                }

//                taskMenu.addEventListener('click',(event)=>{
//                    event.stopPropagation();
//                });
//
            }
        }
    });

}

function registerTaskMenuDeleteHandler(){
    const taskDeleteMenus = document.querySelectorAll(".task-menu-option-delete") as NodeListOf<HTMLDivElement>;
    console.log(taskDeleteMenus);
    taskDeleteMenus.forEach((menu)=>{
        const id = menu.id;
        menu.addEventListener('click',(event:MouseEvent)=>{
            if(event.target instanceof Element){
                console.log(id);
                //showTaskDeletionConfirmationScreen(id);
            }
        });
    });
}

function createTaskDeletionScreenHtml(taskName?:string){
    return `
        <div class="task-deletion-screen">
            <div class="task-deletion-close">
                <i class="fa-regular fa-circle-xmark"></i>
            </div>
            <h2>Confirm Task Deletion.</h2>
            <h3>This will delete the task: <span id="task-to-delete"> ${taskName}</span>.</h3>
            <div class="task-deletion-wrapper">
                <div class="confirm-btn" id="btn-reject">
                    <strong>
                        <p>No, Don't Delete</p>
                    </strong>
                </div>
                <div class="confirm-btn" id="btn-delete">
                    <strong>
                        <p>Yes, Delete Task</p>
                    </strong>
                </div>
            </div>
        </div>
    ` 
}

function createTaskDeletionScreenElement(taskName?:string){
    const html =createTaskDeletionScreenHtml(taskName);
    const taskDeletionScreenElement = createHtmlElement(html);
    if(taskDeletionScreenElement !== null){
        document.body.appendChild(taskDeletionScreenElement);
    }
}

function showTaskDeletionConfirmationScreen(taskName:string){
    //const taskDeletionScreen = document.querySelector(".task-deletion-screen") as HTMLDivElement;
    const taskToDelete = document.getElementById('task-to-delete') as HTMLSpanElement;
    taskToDelete.innerHTML = taskName;
    //taskDeletionScreen.classList.toggle("task-deletion-show");
}

document.addEventListener('DOMContentLoaded',()=>{
    createTaskDeletionScreenElement();
    placeChartContainerData(milestones);
    triggerDatePickerListener();
    triggerDatePickerButtonsListeners();
    generateChartGridColumns(); 
    toggleDatePicker();
    generateCalendarView();
    styleIndicatorLines();
    registerAddTaskBtnListener();
    registerAddMilestoneBtnListener();
    registerCloseWindowsListener();
    registerMilestoneToggleListeners();
    toggleHoverContainer();

    milestones.forEach((milestone)=>{
        if(milestone.tasks){
            if(milestone.tasks.length > 0){
                milestone.tasks.forEach((task)=>{
                    const taskHoverHtml = createTaskHoverContainerHtml(task);
                    const taskHoverElement = createHtmlElement(taskHoverHtml);

                    const taskMenuHtml = createTaskMenuHtml(task);
                    const taskMenuElement = createHtmlElement(taskMenuHtml);

                    if(taskHoverElement){
                        document.body.appendChild(taskHoverElement);
                    }

                    if(taskMenuElement){
                        document.body.appendChild(taskMenuElement);
                    }
                });
            }
        }
    });

    showTaskMenuOnClick();
    registerTaskMenuDeleteHandler();

    const progressMenus = document.querySelectorAll('#task-menu-progress') as NodeListOf<HTMLDivElement>;
    progressMenus.forEach((progressMenu)=>{
        console.log('progress', progressMenu);
        progressMenu.addEventListener('mouseenter',()=>{
            console.log('mouse enter');
            const taskMenuStatuses = document.querySelectorAll('.task-menu-statuses') as NodeListOf<HTMLDivElement>;
            taskMenuStatuses.forEach((statuses)=>{
                statuses.style.display = "block";
            });
        });

    });
});
