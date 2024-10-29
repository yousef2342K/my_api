const express = require('express');
const fs = require('fs');
const path = require('path');
const existingCode = require('./VIP'); // Import your existing code

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to get data from JSON file
app.get('/api/data', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    res.json(JSON.parse(data));
  });
});

// Example endpoint using existing code
app.get('/api/process', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }

    const jsonData = JSON.parse(data);
    const result = existingCode.processData(jsonData); // Use your existing function
    res.json(result);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
