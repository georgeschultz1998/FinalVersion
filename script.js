var uploadCSV = function(tableId) {
  // Get the file input element
  var input = document.querySelector(`#${tableId} input[type=file]`);

  // Add an event listener to the file input element
  input.addEventListener('change', function() {
    // Get the selected file
    var file = input.files[0];

    // Use Papa Parse to read the file contents
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        // Get a reference to the table body element
        var tbody = document.querySelector(`#${tableId} tbody`);

        // Clear the table body
        tbody.innerHTML = '';

        // Loop through the parsed CSV data and add rows to the table
        for (var i = 0; i < results.data.length; i++) {
          var row = results.data[i];
          var newRow = document.createElement('tr');

          // Loop through the row data and add cells to the row
          for (var key in row) {
            if (row.hasOwnProperty(key)) {
              var cell = document.createElement('td');
              cell.innerText = row[key];
              newRow.appendChild(cell);
            }
          }

          tbody.appendChild(newRow);
        }
      }
    });
  });
}


var addRow = function(tableId, rowCount) {
  var tbody = document.querySelector(`#${tableId} tbody`);

  // Use Papa Parse to read the CSV file and get the headers
  Papa.parse('database.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      var header = results.meta.fields;

      for (var j = 0; j < rowCount; j++) {
        var newRow = document.createElement('tr');
        newRow.contentEditable = true;
        var html = '';

        // Generate the HTML for the new row
        for (var i = 0; i < header.length; i++) {
          var colClass = header[i].toLowerCase();
          html += `<td contentEditable="true" class="${colClass}"></td>`;
        }

        newRow.innerHTML = html;
        tbody.appendChild(newRow);
      }
    }
  });
}



var loadDefaultData = function() {
  // Wait for the DOM to load before running the script
  document.addEventListener('DOMContentLoaded', function() {
    // Get a reference to the table body element
    var tbody = document.querySelector('#data tbody');

    // Use Papa Parse to read the CSV file and populate the table
    Papa.parse('database.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        var header = results.meta.fields;

        // Dynamically create the table header row with appropriate classes
        var headerRow = '<tr>';
        for (var i = 0; i < header.length; i++) {
          headerRow += '<th class="' + header[i] + '">' + header[i] + '</th>';
        }
        headerRow += '</tr>';

        var rows = results.data.map(function(row) {
          // Replace "null" with an empty string
          for (var key in row) {
            if (row.hasOwnProperty(key) && row[key] === null) {
              row[key] = "";
            }
          }

          // Dynamically create the table row with appropriate classes
          var tableRow = '<tr>';
          for (var i = 0; i < header.length; i++) {
            tableRow += '<td contenteditable="true" class="' + header[i] + '">' + row[header[i]] + '</td>';
          }
          tableRow += '</tr>';
          return tableRow;
        });

        tbody.innerHTML = headerRow + rows.join('');

      }
    });
  });
};


//----------------------------------------------------
var saveHistory = function() {
  var csv = Papa.unparse(document.querySelector("#data table").tBodies[0]);
  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, "history.csv");
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "history.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // alert("CSV file saved successfully!");
    }
  }
}

//----------------------------------------------------



var deleteRow = function(button) {
  var row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
}




var loadSearchEnterTable = function() {
  // Wait for the DOM to load before running the script
  document.addEventListener('DOMContentLoaded', function() {
    // Get a reference to the table body element
    var tbody = document.querySelector('#searchEnterTable tbody');

    // Use Papa Parse to read the CSV file and get the headers
    Papa.parse('database.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        var header = results.meta.fields;

        // Add the header row to the table
        var headerRow = `<tr>${header.map(function(column) { return `<th>${column}</th>`; }).join('')}</tr>`;
        tbody.innerHTML = headerRow;
        addRow("searchEnterTable", 1);

  
      }
    });
  });
}


var loadSearchResultsTable = function() {
  // Wait for the DOM to load before running the script
  document.addEventListener('DOMContentLoaded', function() {
    // Get a reference to the table body element
    var tbody = document.querySelector('#searchResultsTable tbody');

    // Use Papa Parse to read the CSV file and get the headers
    Papa.parse('database.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        var header = results.meta.fields;

        // Add the header row to the table
        var headerRow = `<tr>${header.map(function(column) { return `<th>${column}</th>`; }).join('')}</tr>`;
        tbody.innerHTML = headerRow;
      }
    });
  });
}



loadDefaultData();
loadSearchEnterTable();
loadSearchResultsTable();

function toggleAutoSave() {
  const checkbox = document.getElementById("autoSaveCheckbox");
  const text = document.getElementById("autoSaveText");
  if (checkbox.checked) {
    autoSaveInterval = setInterval(saveCSV, 10000); // Save every 5 seconds
    autoSaveInterval = setInterval(saveHistory, 10000); // Save every 5 seconds
    text.innerHTML = "Auto Save On";
  } else {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    text.innerHTML = "Auto Save Off";
  }
}



//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
// Load the apartment data from CSV file
var loadTableData = function() {
  fetch("database.csv")
    .then(response => response.text())
    .then(data => {
      const rows = data.split("\n");
      const table = document.getElementById("data");

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(",");
        if (cells.length === 11) {
          const row = table.insertRow(-1);
          for (let j = 0; j < cells.length; j++) {
            const cell = row.insertCell(-1);
            cell.innerHTML = cells[j];
          }
          addCellEditListener(row.cells);
        }
      }
    })
    .catch(error => {
      console.error("Error loading apartment data:", error);
    });
}


var addEditableRow = function(tableId) {
  // Get a reference to the table
  var table = document.getElementById(tableId);

  // Create a new row
  var row = table.insertRow();

  // Add cells to the row
  var header = Array.from(table.querySelector('thead tr').cells).map(function(th) {
    return th.textContent.trim();
  });

  for (var i = 0; i < header.length; i++) {
    var cell = row.insertCell(i);
    cell.contentEditable = true;
    cell.classList.add(header[i].toLowerCase());
  }
};


//----------------------------------------------------
//----------------------------------------------------
// Add event listener to each cell to allow for editing
var addCellEditListener = function(cells) {
  for (let i = 0; i < cells.length; i++) {
    //alert("cell exited");

    cells[i].addEventListener("click", function() {
      const currentCell = this;
      const originalValue = currentCell.innerHTML;
      currentCell.innerHTML = "<input type='text' value='" + originalValue + "'>";
      const input = currentCell.firstChild;
      input.focus();
      input.addEventListener("blur", function() {
        currentCell.innerHTML = input.value;
        //alert("cell exited");
      });
    });
  }
}


function tableToDataArray() {
  var data = [];

  // get table element
  var table = document.getElementById("data");

  // get table rows
  var rows = table.getElementsByTagName("tr");

  // loop through rows
  for (var i = 1; i < rows.length; i++) {
    var row = [];
    var cells = rows[i].getElementsByTagName("td");

    // loop through cells
    for (var j = 0; j < cells.length; j++) {
      row.push(cells[j].textContent);
    }

    // add row to data array
    data.push(row);
  }

  return data;
}


var getTableData = function() {
  const table = document.getElementById("data");
  const rows = Array.from(table.rows);

  // Convert the table rows to a 2D array
  const data = rows.map(row => {
    return Array.from(row.cells).map(cell => {
      return cell.textContent.trim() === '' ? '' : cell.textContent.trim();
    });
  });

  return data;
}



//----------------------------------------------------
// Handle errors when using the FileSystem API
var errorHandler = function(e) {
  console.error(e);
  //alert('An error occurred: ' + e.code);
}

loadTableData();





























///////////////////////////////////////////////////////////////
//---------------------------------------------------
// File Section ***********************************
//---------------------------------------------------
// New function
//---------------------------------------------------
// Open function
var openCSV = function() {
  console.log("openCSV");
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true, // add this option to skip empty lines
    complete: function(results) {
      const data = results.data;
      const tbody = document.querySelector('#data tbody');
      tbody.innerHTML = ''; // clear the table

      data.forEach(function(row) {
        // ignore empty rows
        if (Object.keys(row).length === 0) {
          return;
        }

        const tr = document.createElement('tr');
        tr.setAttribute("contenteditable", true); // set row to be editable
        tr.addEventListener('blur', function() { saveCSV(); }); // save changes on blur event
        tr.addEventListener('keydown', function(event) { // save changes on enter key press
          if (event.key === 'Enter') {
            event.preventDefault();
            this.blur();
          }
        });

        Object.keys(row).forEach(function(key) {
          const td = document.createElement('td');
          td.setAttribute("contenteditable", true); // set cell to be editable
          td.addEventListener('blur', function() { saveCSV(); }); // save changes on blur event
          td.addEventListener('keydown', function(event) { // save changes on enter key press
            if (event.key === 'Enter') {
              event.preventDefault();
              this.blur();
            }
          });

          td.innerText = row[key];
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  });
}

//---------------------------------------------------
// Save function
var saveCSV = function() {
  // Get a reference to the table body element
  var tbody = document.querySelector('#data tbody');

  // Get the table rows as an array
  var rows = Array.from(tbody.querySelectorAll('tr'));

  // Remove any rows that contain only whitespace characters
  rows = rows.filter(function(row) {
    var cells = Array.from(row.querySelectorAll('td'));
    return cells.some(function(cell) {
      return /\S/.test(cell.textContent);
    });
  });

  // Convert the table rows to an array of objects
  var data = rows.map(function(row) {
    var cells = Array.from(row.querySelectorAll('td'));
    var obj = {};
    cells.forEach(function(cell, index) {
      var key = row.querySelector('td:first-child').textContent.trim();
      obj[key] = cell.textContent.trim();
    });
    return obj;
  });

  // Use Papa Parse to convert the data to CSV format
  var csv = Papa.unparse(data, {
    quotes: true,
    header: true
  });

  // Create a download link for the CSV file
  var link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  link.setAttribute('download', 'database.csv');

  // Add the link to the document and trigger a click on it to start the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


//---------------------------------------------------
// Print 

var printDatabase = function() {
  // Create a reference to the table element
  var table = document.getElementById('data');

  // Store the current overflow style property
  var originalOverflow = document.body.style.overflow;

  // Set the overflow property to 'visible' to display the entire table
  document.body.style.overflow = 'visible';

  // Create a new window and write the table to it
  var printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>Table Contents</title>');
  printWindow.document.write('<style>table { width: 100%; margin-top: 20px; border-collapse: collapse; } table th, table td { padding: 10px; border: 1px solid #ddd; text-align: center; } table th { background-color: #eee; }</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(table.outerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  // Print the new window and restore the original overflow property
  printWindow.print();
  document.body.style.overflow = originalOverflow;
}
//---------------------------------------------------
// Close Function
//---------------------------------------------------


//---------------------------------------------------
// Download Function
//---------------------------------------------------
var downloadCSV = function() {
  var csv = "";
  var rows = document.querySelectorAll("#data tr");

  // Use Papa Parse to read the CSV file and get the headers
  Papa.parse('database.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      var header = results.meta.fields;
      csv += header.join(",") + "\n";

      // Loop through the rows in the table and add them to the CSV string
      for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].querySelectorAll("td");
        for (var j = 0; j < cells.length; j++) {
          csv += cells[j].innerText + ",";
        }
        csv = csv.slice(0, -1);
        csv += "\n";
      }

      // download the CSV file
      var encodedUri = encodeURI(csv);
      var link = document.createElement("a");
      link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
      link.setAttribute("download", "database.csv");
      document.body.appendChild(link);
      link.click();
    }
  });
}


function updateSearchResults() {
  const searchTable = document.getElementById("searchEnterTable");
  const dataTable = document.getElementById("data");

  let dataTableContents = [];
  for (let i = 0; i < dataTable.rows.length; i++) {
    const row = Array.from(dataTable.rows[i].cells).map(cell => cell.textContent);
    dataTableContents.push(row);
  }
  //alert(dataTableContents[0]);

  let searchTableContents = [];
  for (let i = 0; i < searchTable.rows.length; i++) {
    const row = Array.from(searchTable.rows[i].cells).map(cell => cell.textContent);
    searchTableContents.push(row);
  }
  //alert(searchTableContents[2][0]);

  // Create an empty array to store the filtered rows
  let filteredContents = [];

  // Loop through each row of dataTableContents
  for (let x = 0; x < dataTableContents.length; x++) {
    let match = true;
    for (let y = 0; y < searchTableContents[1].length; y++) {
      if (searchTableContents[2][y] !== "" && dataTableContents[x][y] !== searchTableContents[2][y]) {
        match = false;
        break;
      }
    }
    if (match) {
      filteredContents.push(dataTableContents[x] + "\n");
    }
  }

  // alert(filteredContents);


  // Get a reference to the table body element
  const searchResultsTable = document.querySelector('#searchResultsTable tbody');

  // Clear the existing search results
  searchResultsTable.innerHTML = "";

  // Create a new header row for the search results table
  const headerRow = searchResultsTable.insertRow();
  const headerData = dataTableContents[0];
  for (let i = 0; i < headerData.length; i++) {
    const headerCell = headerRow.insertCell();
    headerCell.textContent = headerData[i];
  }

  // Loop through each filtered row to create a new row in the search results table
  for (let i = 0; i < filteredContents.length; i++) {
    // Create a new row for the search results table
    const newRow = searchResultsTable.insertRow();

    // Split the filtered row into individual values
    const cellValues = filteredContents[i].split(',');

    // Loop through the cell values array to create cells for the new row
    for (let j = 0; j < cellValues.length; j++) {
      const cell = newRow.insertCell();
      cell.textContent = cellValues[j];
    }
  }

}





var loadSearchResultsTable = function() {
  // Wait for the DOM to load before running the script
  document.addEventListener('DOMContentLoaded', function() {
    // Get a reference to the table body element
    var tbody = document.querySelector('#searchResultsTable tbody');

    // Use Papa Parse to read the CSV file and get the headers
    Papa.parse('database.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        var header = results.meta.fields;

        // Add the header row to the table
        var headerRow = `<tr>${header.map(function(column) { return `<th>${column}</th>`; }).join('')}</tr>`;
        tbody.innerHTML = headerRow;
      }
    });
  });
}

