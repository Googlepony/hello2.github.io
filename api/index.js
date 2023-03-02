
const express = require('express');
const fileUpload = require('express-fileupload');
const tabula = require('tabula-js');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();
const tmpDir = '/tmp/uploads';
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
}
app.use(fileUpload());
app.get('/', (req, res) => {
    res.send('Get - Working');
});
app.post('/upload', (req, res) => {
    const files = req.files;
    if (!files) {
        return res.status(400).send('No files were uploaded.');
    }
    for (const key in files) {
        const file = files[key];
        if (file.mimetype !== 'application/pdf') {
            return res.status(400).send('Only PDF files are allowed.');
        }
        const fileName = `${file.name}-${Date.now()}`;
        const filePath = path.join(tmpDir, fileName);
        const outputPath = path.join(tmpDir, `${fileName}.csv`);
        file.mv(filePath, err => {
            if (err) { return res.status(500).send(err); }
            const stream = tabula(filePath, { pages: "all", area: "80, 30, 1080 , 810" }).streamCsv();
            stream.pipe(fs.createWriteStream(outputPath));
            stream.on('end', () => {
                fs.readFile(outputPath, 'utf-8', (err, data) => {
                    if (err) { return res.status(500).send(err); }
                    res.send(data);
                });
            });
        });
    }
});
app.listen(process.env.PORT || 3000, () => console.log('Server started'));








// const files = document.getElementById('files').files;
// const formData = new FormData();
// for (let i = 0; i < files.length; i++) {
//   formData.append('files', files[i]);
// }
// fetch('/upload', {
//   method: 'POST',
//   body: formData
// })
// .then(response => response.json())
// .then(data => {
//   console.log(data);
// });






// const http = require('http');
// const fs = require('fs');

// const server = http.createServer(function (req, res) {
//     if (req.method === 'POST') {
//         const fileStream = fs.createWriteStream('myfile.txt');
//         req.pipe(fileStream);
//         fileStream.on('finish', () => {
//             res.writeHead(200, { 'Content-Type': 'text/plain' });
//             res.end('File transferred to backend code successfully!');
//         });
//     }
// });
// server.listen(3000);












// const express = require('express');
// const multer = require('multer');
// const tabula = require('tabula-js');
// const path = require('path');

// const app = express();

// // configure multer for handling file upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage });

// app.get('/', (req, res) => {
//     res.send('Get - Working');
// });

// app.post('/api/convert', upload.single('pdf'), async (req, res) => {
//     try {
//         const pdfPath = req.file.path;
//         const stream = tabula(pdfPath, { pages: "all" }, { area: "80, 30, 1080 , 810" }).streamCsv();
//         const fileStream = stream.fork();
//         let csvData = '';
//         fileStream.on('data', chunk => csvData += chunk);
//         fileStream.on('end', () => {
//             const jsonArray = csvToJson(csvData);
//             res.setHeader('Content-Type', 'application/json');
//             res.setHeader('Content-Disposition', `attachment; filename=${path.parse(req.file.originalname).name}.json`);
//             res.send(jsonArray);
//         });
//     } catch (err) {
//         res.status(500).send(`Error occurred while processing PDF: ${err.message}`);
//     }
// });

// function csvToJson(csvData) {
//     const lines = csvData.trim().split('\n');
//     const headers = lines.shift().split(',');
//     return lines.map(line => {
//         const values = line.split(',');
//         return headers.reduce((obj, header, index) => {
//             obj[header] = values[index];
//             return obj;
//         }, {});
//     });
// }

// module.exports = app;
// app.listen(process.env.PORT || 3000, () => {
//     console.log(`Server listening on port ${process.env.PORT || 3000}`);
// });









// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const tabula = require('tabula-js');
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// const upload = multer({ dest: 'uploads/' });

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.post('/convert', upload.single('pdf'), async (req, res) => {
//     try {
//         let csvData = '';
//         const pdfFile = req.file;
//         const stream = tabula(pdfFile.path, { pages: "all" }, { area: "80, 30, 1080 , 810" }).streamCsv();
//         const fileStream = stream.fork();
//         fileStream.on('data', chunk => csvData += chunk);
//         fileStream.on('end', () => {
//             res.setHeader('Content-Type', 'text/csv');
//             res.setHeader('Content-Disposition', 'inline; filename=merged.csv');
//             res.send(csvData);
//         });
//         fileStream.on('error', (err) => {
//             console.error(err);
//             res.status(500).send('Error occurred while converting PDF to CSV.');
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error occurred while processing PDF file.');
//     }
//     next();
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
