const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tabula = require('tabula-js');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/convert', upload.single('pdf'), async (req, res) => {
    try {
        const pdfFile = req.file;
        const stream = tabula(pdfFile.path, { pages: "all" }, { area: "80, 30, 1080 , 810" }).streamCsv();
        const fileStream = stream.fork();
        fileStream.on('data', chunk => csvData += chunk);
        fileStream.on('end', () => {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'inline; filename=merged.csv');
            res.send(csvData);
        });
        fileStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('Error occurred while converting PDF to CSV.');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while processing PDF file.');
    }
});









// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const tabula = require('tabula-js');
// const fs = require('fs');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.post('/convert', async (req, res) => {
//     const pdfData = req.body.pdfData;
//     const filePath = `/tmp/${Date.now()}.pdf`;
//     const csvPath = `/tmp/${Date.now()}.csv`;

//     // Write the PDF data to a file
//     fs.writeFileSync(filePath, pdfData);

//     // Use tabula to extract CSV data from the PDF
//     const table = await tabula(filePath, { output: csvPath, format: 'csv' }).streamCsv();

//     // Read the CSV data from the file
//     const csvData = fs.readFileSync(csvPath, 'utf-8');

//     // Send the CSV data as the response
//     res.send(csvData);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const tabula = require('tabula-js');
// const fs = require('fs');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.post('/convert', async (req, res) => {
//     const pdfDir = './';

//     const pdfFiles = fs.readdirSync(pdfDir, { withFileTypes: true })
//         .filter(dirent => dirent.isFile() && dirent.name.endsWith('.pdf'))
//         .map(dirent => dirent.name);

//     const csvDataArray = [];
//     const promises = pdfFiles.map(async (pdfFile) => {
//         const pdfPath = path.join(pdfDir, pdfFile);
//         const stream = tabula(pdfPath, { pages: "all" }, { area: "80, 30, 1080 , 810" }).streamCsv();
//         const fileStream = stream.fork();
//         await new Promise((resolve, reject) => {
//             let csvData = '';
//             fileStream.on('data', chunk => csvData += chunk);
//             fileStream.on('end', () => {
//                 csvDataArray.push(csvData);
//                 resolve();
//             });
//             fileStream.on('error', (err) => reject(err));
//         });
//     });

//     try {
//         await Promise.all(promises);
//         const csvData = csvDataArray.join('');
//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', 'attachment; filename=merged.csv');
//         console.log(csvData);
//         res.send(csvData);
//     } catch (err) {
//         res.status(500).send(`Error occurred while processing PDFs: ${err.message}`);
//     }
// });


// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });








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
