// Information for Timeline
var data = [
    {
        "day": 4,
        "month": "December",
        "year": 1995,
        "text": "<p>Javascript first appeared after being created by Brendan Eich </p>"
    },
    {
        "month": "August",
        "year": 1996,
        "text": "<p>Microsoft reverse-engineered the Navigator interpreter to create " +
            "its own, called JScript (Not to be confused with JavaScript).</p>" +
            "<p>JScript was first released in 1996, alongside initial support for " +
            "CSS and extensions to HTML.</p>"
    },
    {
        "month": "November",
        "year": 1996,
        "text": "<p> In November 1996, Netscape submitted JavaScript to ECMA International, " +
            "as the starting point for a standard specification that all browser vendors " +
            "could conform to.</p>"
    },
    {
        "month": "June",
        "year": 1997,
        "text": "<p>The first ECMAScript language specification was officially released</p>"
    },
    {
        "month": "June",
        "year": 1998,
        "text": "<p>ECMAScript 2 was released the next year, with minimal changes " +
            "to the previous version to keep up with the ISO standard for the language.</p>"
    },
    {   "month": "December",
        "year": 1999,
        "text": "<p>ECMAScript 3 was released with lots of changes. ECMAScript " +
            "3 saw the introduction of the language’s regular expression and " +
            "exception handling features. It also added support for all browsers</p>"},
    {
        "month": "March",
        "year": 2000,
        "text": "<p>Work on ECMAScript 4 began in 2000. However, the whole " +
            "process died down with the closure of this project confirmed " +
            "in 2003 after ECMA released an interim report containing some of " +
            "the functionality intended for ECMAScript 4.</p>"
    },
    {
        "month": "February",
        "year": "2005",
        "text": "<p>Jesse James Garrett released a white paper in which he coined" +
            " the term Ajax and described a set of technologies, of which " +
            "JavaScript was the backbone, to create web applications where data " +
            "can be loaded in the background, avoiding the need for full page reloads.</p>" +
            "<p>This sparked a renaissance period of JavaScript, spearheaded by open source " +
            "libraries and the communities that formed around them. Many new libraries " +
            "were created, including jQuery, Prototype, Dojo Toolkit, and MooTools.</p>"
    },
    {
        "month": "December",
        "year": 2009,
        "text": "<p>While ECMAScript 4 was abandoned, the successor to ECMAScript 3 was" +
            " finally released in December 2009. This was a decade after the release " +
            "of ECMAScript 3 and was called ECMAScript 5 and came with lots of new " +
            "features including support for the parsing of JSON files, strict mode and " +
            "being fully supported in all modern browsers</p>"
    },
    {
        "month": "June",
        "year": "2015",
        "text": "<p>ECMAScript 6 was renamed to ECMAScript 2015, and this naming " +
            "pattern has continued for the latest releases of the JavaScript standard.</p>" +
            "<p>ECMAScript 2015 added Classes and modules (although not supported in all modern browers)</p>"
    },

];

// Hashmap for getting the number associated with each month
var months = {};
months["January"] = 1;
months["February"] = 2;
months["March"] = 3;
months["April"] = 4;
months["May"] = 5;
months["June"] = 6;
months["July"] = 7;
months["August"] = 8;
months["September"] = 9;
months["October"] = 10;
months["November"] = 11;
months["December"] = 12;

// Function for returning the time in days between two dates
function timeBetweenInDays(date1, date2) {
    return (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
}

// Function for creating a timeline
$(document).ready(function () {
    var firstMonth = months[data[0].month];
    var firstYear = data[0].year;
    var firstDate = new Date(firstYear, firstMonth - 1);

    var lastMonth = months[data[data.length - 1].month];
    var lastYear = data[data.length - 1].year;
    var lastDate = new Date(lastYear, lastMonth - 1);

    var totalDays = timeBetweenInDays(firstDate, lastDate);

    //Draw first date circle
    $("#line").append('<div class="circle" id="circle0" style="left: ' + 0 + '%;"><div class="popupSpan">'
        + data[0].month + ", " + data[0].year + '</div></div>');

    $("#content").append('<span id="span0" class="show">' + data[0].text + '</span>');

    //Loop through middle dates
    for (i = 1; i < data.length - 1; i++) {
        var thisMonth = months[data[i].month];
        var thisYear = data[i].year;
        var thisDate = new Date(thisYear, thisMonth - 1);

        var timeFromStart = timeBetweenInDays(firstDate, thisDate);
        var percentageFromLeft = timeFromStart / totalDays;

        //Draw the date circle
        $("#line").append('<div class="circle" id="circle' + i + '" style="left: ' + percentageFromLeft * 100 +
            '%;"><div class="popupSpan">' + data[i].month + ", " + data[i].year + '</div></div>');


        $("#content").append('<span id="span' + i + '" class="hidden">' + data[i].text + '</span>');
    }

    //Draw the last date circle
    $("#line").append('<div class="circle" id="circle' + i + '" style="left: ' + 99 + '%;"><div class="popupSpan">'
        + data[i].month + ", " + data[i].year + '</div></div>');

    $("#content").append('<span id="span' + i + '" class="hidden">' + data[i].text + '</span>');

    $(".circle:first").addClass("active");
});

// Display date when hovering over circle
$(document).ready(function () {
    $(".circle").mouseenter(function () {
        $(this).addClass("hover");
    });
});

// Remove date when leaving a circle
$(document).ready(function () {
    $(".circle").mouseleave(function () {
        $(this).removeClass("hover");
    });
});

// Change active circle on click
$(document).ready(function () {
    $(".circle").click(function () {
        var dateId = $(this).attr("id");
        selectDate(dateId);
    });
});

// Select the date and change the corresponding text
function selectDate(selector) {
    $selector = "#" + selector;
    $spanSelector = $selector.replace("circle", "span");
    var current = $selector.replace("circle", "");

    // remove active class from old circle and add to the new class
    $(".circle.active").removeClass("active");
    $($selector).addClass("active");

    // Changes the current content to hidden and shows the new content
    $("span.show").removeClass("show").addClass("hidden");
    $($spanSelector).addClass("show");
    $($spanSelector).removeClass("hidden");

}
