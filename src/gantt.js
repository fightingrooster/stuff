function getDaysOfTheMonth() {
    var currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
}
function getWeekDaysOfTheMonth() {
    var weekDays = [];
    var weekDayAbbreviations = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    var days = getDaysOfTheMonth();
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    for (var i = 0; i < days; ++i) {
        var date_1 = new Date(year, month, i + 1);
        weekDays.push({ weekDay: weekDayAbbreviations[date_1.getDay()], dayNumber: i + 1 });
    }
    return weekDays;
}
function generateChartGridColumns() {
    //TODO: will need to find a way to make this work with user input
    var days = getDaysOfTheMonth();
    var weekDays = getWeekDaysOfTheMonth();
    var chartGridElement = document.querySelectorAll('.task-grid-lines');
    chartGridElement.forEach(function (gridElement) {
        gridElement.style.gridTemplateColumns = "repeat(".concat(days, ", 1fr)");
        for (var i = 0; i < days; ++i) {
            var spanElement = document.createElement('span');
            spanElement.className = 'span-grid-column';
            //TODO: Dangerous zone
            spanElement.id = "span-".concat(weekDays[i].dayNumber);
            if (isWeekendDay(weekDays[i].weekDay)) {
                //spanElement.style.background = 'rgb(248, 249, 252)';
                spanElement.style.background = '#F3F5F6';
            }
            gridElement.appendChild(spanElement);
        }
    });
}
function generateCalendarView() {
    var days = getDaysOfTheMonth();
    var weekDays = getWeekDaysOfTheMonth();
    var calendarElement = document.querySelector('.calendar');
    calendarElement.style.gridTemplateColumns = "repeat(".concat(days, ", 1fr)");
    for (var i = 0; i < days; ++i) {
        var spanElement = document.createElement('span');
        spanElement.className = 'span-grid-column-cal';
        //TODO: Dangerous zone
        spanElement.id = "span-".concat(weekDays[i].dayNumber);
        spanElement.innerHTML = "\n       <p>".concat(weekDays[i].weekDay, "</p>  \n       <p>").concat(weekDays[i].dayNumber, "</p>  \n        ");
        //if(isWeekendDay(weekDays[i].weekDay)){
        //    //spanElement.style.background = 'rgb(248, 249, 252)';
        //    spanElement.style.background = '#F3F5F6';
        //}
        calendarElement.appendChild(spanElement);
    }
}
function isWeekendDay(weekday) {
    return weekday === 'S';
}
function styleIndicatorLines() {
    var chartContainers = document.querySelectorAll('.chart-container');
    for (var _i = 0, chartContainers_1 = chartContainers; _i < chartContainers_1.length; _i++) {
        var chartContainer = chartContainers_1[_i];
        var lines = chartContainer.querySelectorAll('.indicator-line');
        lines[lines.length - 1].style.borderLeft = "0px";
        lines[lines.length - 2].style.borderBottomLeftRadius = "0.5rem";
    }
}
function createChartContainer(htmlString) {
    var template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstElementChild;
}
document.addEventListener('DOMContentLoaded', function () {
    generateChartGridColumns();
    generateCalendarView();
    styleIndicatorLines();
});
