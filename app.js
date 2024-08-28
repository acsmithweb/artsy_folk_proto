document.getElementById('loadCSV').addEventListener('click', function() {
  const fileInput = document.getElementById('loadFile');
   if (fileInput.files.length > 0) {
       const file = fileInput.files[0];
       loadCSVFile(file);
       fileInput.value = '';
   } else {
       alert('Please select a CSV file to load.');
   }
});

function loadCSVFile(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const csvContent = event.target.result;
        const rows = csvContent.split('\n').slice(1); // Skip header row

        // Clear existing table data
        document.getElementById('commissionTableBody').innerHTML = '';

        rows.forEach(row => {
            const cells = row.split(',');
            if (cells.length === 7) { // Ensure row has the correct number of columns
                addRow(cells[0].replace(/"/g, ''), cells[1].replace(/"/g, ''), cells[2].replace(/"/g, ''), cells[3].replace(/"/g, ''), cells[4].replace(/"/g, ''), cells[5].replace(/"/g, ''), cells[6].replace(/"/g, ''));
            }
        });
    };

    reader.readAsText(file);
}

document.getElementById('saveCSV').addEventListener('click', function() {
    saveTableToCSV('commission_tracker.csv');
});

function saveTableToCSV(filename) {
    const tableBody = document.getElementById('commissionTableBody');
    const rows = tableBody.querySelectorAll('tr');
    let csvContent = "Commission ID,Commissioner,Description,Status,Communication Log,Origin\n"; // Header row

    rows.forEach(row => {
        const cells = row.querySelectorAll('td:not(:last-child)'); // Exclude the last cell (actions)
        const rowData = Array.from(cells).map(cell => `"${cell.textContent}"`).join(',');
        csvContent += rowData + "\n";
    });

    // Create a Blob from the CSV content and trigger a download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('addRecord').addEventListener('click', function() {
    createEditableRow();
});

// Helper function to create an editable row (either new or for editing)
function createEditableRow(existingData = {}) {
    const { commissionId = '', commissioner = '', description = '', status = '', communicationLog = '', origin = '', createdDate = ''} = existingData;

    const tableBody = document.getElementById('commissionTableBody');
    const row = document.createElement('tr');

    row.innerHTML = `
        ${createInputCell(commissionId)}
        ${createInputCell(commissioner)}
        ${createInputCell(description)}
        ${createInputCell(status)}
        ${createInputCell(communicationLog)}
        ${createInputCell(origin)}
        ${createInputCell(createdDate)}
        <td>
            <button class="btn btn-sm btn-success" onclick="saveRow(this)">Save</button>
        </td>
    `;

    tableBody.appendChild(row);
}

// Helper function to create an input cell
function createInputCell(value) {
    return `<td><input type="text" class="form-control" value="${value}"></td>`;
}

// Function to save data from an editable row
function saveRow(button) {
    const row = button.parentElement.parentElement;
    const inputs = row.querySelectorAll('input');

    const [commissionId, commissioner, description, status, communicationLog, origin] = Array.from(inputs).map(input => input.value);

    updateRow(row, { commissionId, commissioner, description, status, communicationLog, origin });
}

// Function to update a row with static values
function updateRow(row, data) {
    row.innerHTML = `
        ${createStaticCell(data.commissionId)}
        ${createStaticCell(data.commissioner)}
        ${createStaticCell(data.description)}
        ${createStaticCell(data.status)}
        ${createStaticCell(data.communicationLog)}
        ${createStaticCell(data.origin)}
        ${createStaticCell(data.createdDate)}
        <td>
            <button class="btn btn-warning btn-sm" onclick="editRow(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button>
        </td>
    `;
}

// Function to handle editing an existing row
function editRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll('td');

    // Create an editable row with the current data
    const existingData = {
        commissionId: cells[0].textContent,
        commissioner: cells[1].textContent,
        description: cells[2].textContent,
        status: cells[3].textContent,
        communicationLog: cells[4].textContent,
        origin: cells[5].textContent,
        createdDate: cells[6].textContent
    };

    row.innerHTML = `
        ${createInputCell(existingData.commissionId)}
        ${createInputCell(existingData.commissioner)}
        ${createInputCell(existingData.description)}
        ${createInputCell(existingData.status)}
        ${createInputCell(existingData.communicationLog)}
        ${createInputCell(existingData.origin)}
        ${createInputCell(existingData.createdDate)}
        <td>
            <button class="btn btn-sm btn-success" onclick="saveRow(this)">Save</button>
        </td>
    `;
}

// Function to delete a row
function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// Reusable function to add a row with static data
function addRow(commissionId, commissioner, description, status, communicationLog, origin, createdDate) {
    const tableBody = document.getElementById('commissionTableBody');
    const row = document.createElement('tr');

    row.innerHTML = `
        ${createStaticCell(commissionId)}
        ${createStaticCell(commissioner)}
        ${createStaticCell(description)}
        ${createStaticCell(status)}
        ${createStaticCell(communicationLog)}
        ${createStaticCell(origin)}
        ${createStaticCell(createdDate)}
        <td>
            <button class="btn btn-warning btn-sm" onclick="editRow(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    tableBody.appendChild(row);
}

// Helper function to create a static text cell
function createStaticCell(value) {
    return `<td>${value}</td>`;
}

// Example of adding a sample row (for demonstration purposes)
addRow('001', 'John Doe', 'Portrait of a cat', 'In Progress', 'Initial contact made', 'Website', Date.now());
