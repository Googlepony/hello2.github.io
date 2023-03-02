const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tabula = require('tabula-js');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/convert', async (req, res) => {
    const pdfData = req.body.pdfData;
    const filePath = `/tmp/${Date.now()}.pdf`;
    const csvPath = `/tmp/${Date.now()}.csv`;

    // Write the PDF data to a file
    fs.writeFileSync(filePath, pdfData, 'binary');

    // Use tabula to extract CSV data from the PDF
    const table = await tabula(filePath, { output: csvPath, format: 'csv' }).streamCsv();

    // Read the CSV data from the file
    const csvData = fs.readFileSync(csvPath, 'utf-8');

    // Send the CSV data as the response
    res.send(csvData);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});











// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.post('/hello', (req, res) => {
//     const name = req.body.name;
//     res.send(`Hello, ${name}!`);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
