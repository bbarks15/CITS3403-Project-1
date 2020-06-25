// Make AJAX Request on Document ready
$(document).ready(function () {
    $.get("https://corona.lmao.ninja/v2/countries", makeTableByCases, "json");
    $.get("https://corona.lmao.ninja/v2/historical/Australia", makeGraph, "json");
});


// Function to generate table from returned data in JSON format
// It also generates a list of countries for the graph
function makeTableByCases(returnedData) {
    // Sort the data by confirmed cases
    returnedData.sort(function (a, b) {
        return b.cases - a.cases;
    });

    // Construction of table body to be added
    let content = "<tbody>";

    // Loops through all of the countries and adds their statistics to
    // the row
    for (let i = 0; i < returnedData.length; i++) {
        content += "<tr><td>" +
                    (i + 1) + "</td><td>" +
                    returnedData[i].country + "</td><td>" +
                    returnedData[i].cases + "</td><td>" +
                    returnedData[i].active + "</td><td>" +
                    returnedData[i].recovered + "</td><td>" +
                    returnedData[i].deaths + "</td><td>" +
                    returnedData[i].todayCases + "</td><td>" +
                    returnedData[i].todayDeaths + "</td></tr>"
    }
    // Closes table body tag
    content += "</tbody>";

    // Adds table body to the table element
    $("#table_here").append(content);

    // Generating list of countries for the graph

    // Sorts the countries by name
    returnedData.sort(function (a, b) {
        a = a.country.toLowerCase();
        b = b.country.toLowerCase();

        return a < b ? -1 : a > b ? 1 : 0;
    });

    // Construction of element to add countries to form
    let countries = "";

    // Loops through each country adding it to a option element and
    // appending it to the variable countries
    //
    // Note it makes Australia the default by adding the selected attribute
    // when it gets to Australia
    for (let i = 0; i < returnedData.length; i++) {
        if (returnedData[i].country != "Australia") {
            countries += "<option value=\"" + returnedData[i].country + "\">" + returnedData[i].country + "</option>";
        }
        else {
            countries += "<option value=\"" + returnedData[i].country + "\" selected>" + returnedData[i].country + "</option>";
        }
    }

    // Adds the options to the form element
    $("#graph_country").append(countries);

}

// overload method for sort_table
function sortTable(n) {
    sort_table(document.getElementById("table_here"), n);
}



// new chart
var chart;
// count number of charts
var chartsCreated = 0;

// Function to create graph
function makeGraph(returnedData) {
    // get data for the y axis
    let data = Object.values(returnedData.timeline.cases);

    // get dates for the x-axis
    let labels = Object.keys(returnedData.timeline.cases);

    // Checks is chart already exists. If true remove it
    if (chartsCreated != 0) {
        chart.destroy();
    }

    // construct chart object for the last 14 days
    let ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.slice(-15, labels.length),
            datasets: [{
                data: data.slice(-15, labels.length),
                backgroundColor: 'rgba(0, 119, 204, 0)',
                borderColor: 'rgba(253,230,52, 1)',
                // pointBorderColor: 'rgba(0,0,0, 1)',
                pointBackgroundColor: 'rgba(0,0,0, 1)'
            }],

        },
        options: {
            legend: {
                display: false
            },
        }
    });

    // Increment the number of charts created
    chartsCreated++;
}

// When the document is ready update the graph when the form is changed
$(document).ready(function () {
    // When the form element is changed
    $("#graph_country").change(function () {
        // make url with specified country for tAJAX request
        var country = $(this).children("option:selected").val()
        var url = "https://corona.lmao.ninja/v2/historical/" + country;
        // make request and call makeGraph on success
        $.ajax(url, {
            cache: false,
            dataType: "json",
            error: function countryNotFound(jqXHR, textStatus, errorThrown) {
                    alert("Could Not Get Data For " + country + " :(\n" +
                           "Status: " + jqXHR.status);
                },
            success: makeGraph
        });
    });
});


// Function for sorting the table
$(document).ready(function () {
    $("#table_filter").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#table_here tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

// variable to toggle ascending or descending order
var asc = 0;

// function to sort the table
function sort_table(table, col) {
    $('.sortorder').remove();
    if (asc == 2) {
        asc = -1;
    } else {
        asc = 2;
    }
    var rows = table.tBodies[0].rows;
    var rlen = rows.length;
    var arr = [];
    var i, j, cells, clen;
    // fill the array with values from the table
    for (i = 0; i < rlen; i++) {
        cells = rows[i].cells;
        clen = cells.length;
        arr[i] = [];
        for (j = 0; j < clen; j++) {
            arr[i][j] = cells[j].innerHTML;
        }
    }
    // sort the array by the specified column number (col) and order (asc)
    arr.sort(function (a, b) {
        var retval = 0;
        var col1 = a[col].toLowerCase().replace(',', '').replace('$', '').replace(' usd', '')
        var col2 = b[col].toLowerCase().replace(',', '').replace('$', '').replace(' usd', '')
        var fA = parseFloat(col1);
        var fB = parseFloat(col2);
        if (col1 != col2) {
            if ((fA == col1) && (fB == col2)) {
                retval = (fA > fB) ? asc : -1 * asc;
            }
            else {
                retval = (col1 > col2) ? asc : -1 * asc;
            }
        }
        return retval;
    });

    // place the elements in the correct order
    for (var rowidx = 0; rowidx < rlen; rowidx++) {
        for (var colidx = 1; colidx < arr[rowidx].length; colidx++) {
            table.tBodies[0].rows[rowidx].cells[colidx].innerHTML = arr[rowidx][colidx];
        }
    }

    // update the arrow in the heading to denote ascending or descending
    hdr = table.rows[0].cells[col];
    if (asc == -1) {
        $(hdr).html($(hdr).html() + '<span class="sortorder"> ▲</span>');
    }
    else {
        $(hdr).html($(hdr).html() + '<span class="sortorder"> ▼</span>');
    }
}
