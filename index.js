var jsonData;
var sortOrder = true; // True for ascending, false for descending
function getCurrentFormattedDate(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

    
// Function to render the JSON data in the table
function renderTable(data) {
    const tableBody = document.querySelector('#jsonTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(item => {
        const row = document.createElement('tr');

        Object.values(item).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

function loadJson(filePath){

   // Fetch the JSON data from the file
   fetch(filePath)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Read as text first to debug
    })
    .then(text => {
        jsonData = JSON.parse(text); // Parse the text as JSON
        renderTable(jsonData);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });
    

}

function filterTable() {
        const filter = document.getElementById('filterInput').value.toLowerCase();
        const filteredData = jsonData.filter(item => 
            item.name.toLowerCase().includes(filter)
        );
        renderTable(filteredData);
}

// Function to sort the table by a specific key
function sortTable(key) {
    const sortedData = jsonData.sort((a, b) => {
        if (sortOrder) {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });
    sortOrder = !sortOrder; // Toggle sort order
    renderTable(sortedData);
}


function fileExists(url, callback) {
    $.ajax({
        url: url,
        type: 'HEAD',
        error: function() {
            callback(false);
        },
        success: function() {
            callback(true);
        }
    });
}

function loadSetJsonForDate(offsetDays = 0) {
    const date = getCurrentFormattedDate(offsetDays);
    const filePath = `/json/set-economy_stats_${date}.json`;
    fileExists(filePath, function(exists) {
        if (exists) {
            $("#today-date").append(date);
            loadJson(filePath);
        } else if (offsetDays === 0) {
            // Try loading the file for the previous day if today's file doesn't exist
            loadSetJsonForDate(-1);
        } else {
            // If previous day's file also doesn't exist
            $('#jsonTable').html('<tr><td>No data available</td></tr>');
        }
    });
}

function loadRivenJsonForDate(offsetDays = 0) {
    const date = getCurrentFormattedDate(offsetDays);
    const filePath = `/json/riven-stats_${date}.json`;
    fileExists(filePath, function(exists) {
        if (exists) {
            $("#today-date").append(date);
            loadJson(filePath);
        } else if (offsetDays === 0) {
            // Try loading the file for the previous day if today's file doesn't exist
            loadRivenJsonForDate(-1);
        } else {
            // If previous day's file also doesn't exist
            $('#jsonTable').html('<tr><td>No data available</td></tr>');
        }
    });
}


function initializeSet() {
    // Attempt to load the Json file for the current date
    loadSetJsonForDate(0);
}

function initializeRivens(){
    loadRivenJsonForDate(0);
}