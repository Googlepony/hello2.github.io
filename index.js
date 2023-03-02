const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tabula = require('tabula-js');
const multer = require('multer');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const upload = multer({ dest: 'uploads/' }).single('pdf');

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/convert', upload, async (req, res) => {
    try {
        let csvData = '';
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
    next();
});

