/*
    Description: Runs jQuery code when DOM is safe to manipulate, contains bulk of
    - JQuery Validation Code
    - Jquery Slider & Tab Code
*/
$().ready(function () {
    // Slider
    $(function () {
        /*
            value: sets inital value
            min: sets minimum value on the slider
            max: sets maxium value on the slider
            slide(): changes the value of the label with id #min_col
        */
        $("#min_col_slider").slider({
            value: 1,
            min: -50,
            max: 50,
            slide: function (event, ui) {
                $("#min_col").val(ui.value);
                updateTable();
                ;
            }
        });
        $("#max_col_slider").slider({
            value: 1,
            min: -50,
            max: 50,
            slide: function (event, ui) {
                $("#max_col").val(ui.value);
                updateTable();
            }
        });
        $("#min_row_slider").slider({
            value: 1,
            min: -50,
            max: 50,
            slide: function (event, ui) {
                $("#min_row").val(ui.value);
                updateTable();
            }
        });
        $("#max_row_slider").slider({
            value: 1,
            min: -50,
            max: 50,
            slide: function (event, ui) {
                $("#max_row").val(ui.value);
                updateTable();

            }
        });
    })

    // jQuery validation code
    $("#signupForm").validate({
        // Rules
        /*
            required: Means the input is required for the form to be valid
            range: Only allows non-decimal numbers in the range (handles non-numbers such as strings, char, etc)
        */
        rules: {
            min_col: {
                required: true,
                number: true,
                range: [-50, 50],
            },
            max_col: {
                required: true,
                number: true,
                range: [-50, 50],
            },
            min_row: {
                required: true,
                number: true,
                range: [-50, 50],
            },
            max_row: {
                required: true,
                number: true,
                range: [-50, 50],
            }
        },
        // Messages
        messages: {
            min_col: {
                required: " Please enter a value for minimum columns",
                number: " Only numbers are accepted!",
                min: " Please enter a number (-50 <= 0 <= 50)",
            },
            max_col: {
                required: " Please enter a value for maximum columns",
                number: " Only numbers are accepted!",
                min: " Please enter a number (-50 <= 0 <= 50)",
            },
            min_row: {
                required: " Please enter a value for minimum rows",
                number: " Only numbers are accepted!",
                min: " Please enter a number (-50 <= 0 <= 50)",
            },
            max_row: {
                required: " Please enter a value for maximum rows",
                number: " Only numbers are accepted!",
                min: " Please enter a number (-50 <= 0 <= 50)",
            }
        }
    });

    // Calls tabs when #tabs element's html is changed
    $("#tabs").on('DOMSubtreeModified', function () {
        $("#tabs").tabs();
    });

    // If form is filled out correctly the table will be generated
    $('#signupForm').submit(function (event) {
        event.preventDefault();
        if ($('#signupForm').valid()) {
            createTab();
        }
    });
});

/*
    @Params 
    min_count: minimum number of rows or cols
    max_count: maxmimum number of rows or cols
    Description: Sets array so that first value is 0 (unless min is 0)
*/
function setArray(min_count, max_count) {
    let arr = [];

    if (min_count != 0) {
        arr.push(0);
    }

    for (let i = min_count; i <= max_count; i++) {
        arr.push(i);
    }

    return arr;
}


/* 
    Description: Starter function which generates the table
*/
// Counter variable of number of tabs
let tab_counter = 1;

function generateTable(curr_counter, min_col_count, max_col_count, min_row_count, max_row_count) {

    const table = document.createElement(`table-${curr_counter}`);

    // Initializes col and row arrays
    const col_arr = setArray(min_col_count, max_col_count);
    const row_arr = setArray(min_row_count, max_row_count);

    for (let i = 0; i < row_arr.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < col_arr.length; j++) {
            const col = document.createElement('td');

            // Multplying i x j 
            let val = row_arr[i] * col_arr[j];

            // Gives styling to first row and columns
            if (i === 0 || j === 0) {
                val = row_arr[i] || col_arr[j];
                col.classList.add('header');
            }

            // If first cell, set value to empty char, else set to val
            if (i === 0 && j === 0) val = '';

            // Make the td's innerHTML value equal to value
            col.innerHTML = val;
            row.appendChild(col);
        }
        // Add the row to the HTML
        table.appendChild(row);
    }
    return table;
}

function createTab() {
    // Creation of table element

    // Stores input value's into variables
    const min_col_count = Number(document.getElementById("min_col").value);
    const max_col_count = Number(document.getElementById("max_col").value);
    const min_row_count = Number(document.getElementById("min_row").value);
    const max_row_count = Number(document.getElementById("max_row").value);

    const table = generateTable(tab_counter, min_col_count, max_col_count, min_row_count, max_row_count);

    // Adds a new tab label (an <li> nested with a <a> per the spec)
    $("#tab-titles").append(
        `<li>
            <a href="#tab-${tab_counter}">
                [${min_col_count}, ${max_col_count}] x [${min_row_count}, ${max_row_count}]
            </a>
            <p title="close" id="close-btn" onclick="removeTab(${tab_counter})">x</p>
        </li>`
    )
    // Adds a tab-item to the tab-list section
    $("#tab-list").append(`
        <div class="">
            <span id="tab-item-${tab_counter}">
                [${min_col_count}, ${max_col_count}] x [${min_row_count}, ${max_row_count}]
            </span>
            <input type="checkbox" name="box" id="#table-${tab_counter}">
        </div>
    `)
    // Adds a new div section to contain the body of the tab (in our case the table)
    $("#tab-titles").after(`<div id="tab-${tab_counter}"></div>`);

    // Appends table to current tab
    $(`#tab-${tab_counter}`).append(table);
    // Refresh tabs (updates tabs)
    $("#tabs").tabs("refresh");
    // Increments tab-counter
    tab_counter++;

    // Prevents reload on submit
    event.preventDefault();
}

function updateTable() {
    // Checks to see if table already exists, if it does remove it via DOM
    if (document.querySelector(`table-${tab_counter - 1}`)) {
        $(`table-${tab_counter - 1}`).remove();
    }

    // Stores input value's into variables
    const min_col_count = Number(document.getElementById("min_col").value);
    const max_col_count = Number(document.getElementById("max_col").value);
    const min_row_count = Number(document.getElementById("min_row").value);
    const max_row_count = Number(document.getElementById("max_row").value);

    const table = generateTable(tab_counter - 1, min_col_count, max_col_count, min_row_count, max_row_count);


    // Appends table to prev tab
    $(`#tab-${tab_counter - 1}`).append(table);
    console.log(`#tab-${tab_counter}`);

    // Refresh tabs (updates tabs)
    $("#tabs").tabs("refresh");
    // Increments tab-counter

    // Prevents reload on submit
    event.preventDefault();
}

/*
    Description: Dynamically deletes tab by id (i.e "#tab-1")

    @Params
    tabId: the number of the specified tab
*/
function removeTab(tabId) {
    let current_tab = "#tab-" + tabId;
    let current_table = "#tab-item-" + tabId;
    // Remove Panel
    $(current_tab).remove(0);
    $("#tabs").tabs("refresh");
    // Remove Tab
    let href = "a[href='" + current_tab + "']";
    $(href).closest("li").remove();
    // Remove tab-list-item
    $(current_table).parent().remove();
}


/*
    Description: Deletes multiple tabs 
*/
function deleteSelectedTabs() {
    let selected = $('input[name=box]:checked');

    for (let i = 0; i < selected.length; i++) {
        // Retrieve id of selected element
        let id = $(selected[i]).attr('id');
        // Regex to retrieve only numbers from the id string
        var reg = id.replace(/\D/g, "");
        // Calls removeTab to remove the tab
        removeTab(reg);
        // Removes parent of selected element (in this instance the list-item)
        console.log(selected[i])
        $(selected[i]).parent().remove();
    }
}