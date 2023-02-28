const http = require('http');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const csv = require('csv-parser');
const Papa = require('papaparse');

const filePath1 = 'database.csv';
const filePath2 = 'history.csv';

function loadData(callback) {
  const dataArray = [];
  const headers = [];

  fs.createReadStream(filePath1)
    .pipe(csv())
    .on('data', (row) => {
      dataArray.push(row);
      // Save headers
      if (headers.length === 0) {
        headers.push(...Object.keys(row));
      }
    })
    .on('end', () => {
      // Dynamically create arrays based on headers
      const dataByHeader = headers.reduce((acc, curr) => {
        acc[curr] = dataArray.map((row) => row[curr]);
        return acc;
      }, {});

      // Call the callback function with the data arrays
      callback(dataArray, dataByHeader);
    });
}



function loadHistoryData(callback) {
  const historyArray = [];
  fs.createReadStream(filePath2)
    .pipe(csv())
    .on('data', (row) => {
      historyArray.push(row);
    })
    .on('end', () => {
      callback(historyArray);
    });
}

function updateDatabase(body) {
  fs.writeFile(filePath1, body, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Database updated successfully');
    }
  });
}

let previousData = "";

function updateHistory(body) {
  var dataArray = Papa.parse(body.trim()).data;
  fs.readFile(filePath2, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const csvData = data.toString();
      var csvArray = Papa.parse(csvData.trim()).data;

      // Check if the current data array is different from the previous version
      if (!arraysEqual(dataArray, previousData)) {
        fs.appendFile(filePath2, body, (err) => {
          if (err) {
            console.error(err);
          } else {
            //console.log("Updated History:" + body);
            previousData = dataArray; // update previousData with the current data array
          }
        });
      }
    }
  });
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) {
      return false;
    }
    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        return false;
      }
    }
  }
  return true;
}



const server = http.createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  const extname = path.extname(req.url);
  let contentType = 'text/html';

  switch (extname) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (req.url === '/history') {
        updateHistory(body + "\n");
        updateDatabase(body);
      } else {
        updateHistory(body + "\n");
        updateDatabase(body);
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('Database updated successfully\n');
      res.end();
    });

  } else {
    loadData(() => {
      loadHistoryData((historyArray) => {
        // read the HTML file
        const filePath = req.url === '/' ? './index.html' : '.' + req.url;
        fs.readFile(filePath, (err, content) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404 Not Found\n');
            res.end();
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            if (req.url === '/history') {
              res.write(JSON.stringify(historyArray));
            } else {
              res.write(content);
            }
            res.end();
          }
        });
      });
    });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = {
  updateDatabase,
};

