function getCurrentFormattedDate(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function loadCSV(filePath) {
    Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function(results) {
            // Get data
            var data = results.data;
            
            // Clear the existing table
            $('#csvHeader').empty();
            $('#csvBody').empty();

            // Generate table header
            var headerHtml = '';
            var keys = Object.keys(data[0]);
            keys.forEach(function(key) {
                headerHtml += '<th>' + key + '</th>';
            });
            $('#csvHeader').html(headerHtml);

            // Generate table body
            var bodyHtml = '';
            data.forEach(function(row) {
                bodyHtml += '<tr>';
                keys.forEach(function(key) {
                    bodyHtml += '<td>' + row[key] + '</td>';
                });
                bodyHtml += '</tr>';
            });
            $('#csvBody').html(bodyHtml);

            // Initialize DataTable
            $('#csvTable').DataTable();
        }
    });
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

function loadCSVForDate(offsetDays = 0) {
    const date = getCurrentFormattedDate(offsetDays);
    const filePath = `/csv/stats_${date}.csv`;
    fileExists(filePath, function(exists) {
        if (exists) {
            $("#today-date").append(date);
            loadCSV(filePath);
        } else if (offsetDays === 0) {
            // Try loading the file for the previous day if today's file doesn't exist
            loadCSVForDate(-1);
        } else {
            // If previous day's file also doesn't exist
            $('#csvHeader').html('<th>No data available</th>');
            $('#csvBody').html('<tr><td>No data available</td></tr>');
        }
    });
}

function initializePage() {
    // Attempt to load the CSV file for the current date
    loadCSVForDate(0);
}