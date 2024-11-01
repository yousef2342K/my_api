const express = require('express');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable PORT

// Middleware to parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /data to read JSON and /execute to run your script.');
});

// Endpoint to read JSON data
app.get('/data', (req, res) => {
    fs.readFile('leijao.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error: Could not read file.');
        }
        try {
            res.send(JSON.parse(data));
        } catch (jsonErr) {
            console.error('Error parsing JSON:', jsonErr);
            return res.status(500).send('Internal Server Error: Invalid JSON format.');
        }
    });
});

// Endpoint to execute the existing JavaScript code
app.post('/execute', (req, res) => {
    const args = req.body.args || []; // Expecting an array of arguments

    if (!Array.isArray(args)) {
        return res.status(400).send({ error: 'Invalid input: args must be an array' });
    }

    const child = spawn('node', ['VIP.js', ...args]);

    let output = '';
    let errorOutput = '';

    // Capture standard output
    child.stdout.on('data', (data) => {
        output += data.toString();
    });

    // Capture standard error
    child.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    // Handle process exit
    child.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send({ error: errorOutput || `Process exited with code ${code}` });
        }
        res.send({ output });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
