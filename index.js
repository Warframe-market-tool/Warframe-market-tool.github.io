function getCurrentFormattedDate() {
    const date = new Date();
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