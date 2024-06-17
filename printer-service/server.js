const express = require('express');
const cors = require('cors');
const { getPrinters, print } = require('pdf-to-printer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/printers', async (req, res) => {
  try {
    const printers = await getPrinters();
    res.json(printers);
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.post('/print', async (req, res) => {
  const { printerName, fileUrl } = req.body;
  const fileName = `${uuidv4()}.pdf`; // Generate a unique file name
  const filePath = path.join(__dirname, 'documents', fileName); // Adjust the path accordingly

  try {
    // Ensure the documents directory exists
    if (!fs.existsSync(path.join(__dirname, 'documents'))) {
      fs.mkdirSync(path.join(__dirname, 'documents'));
    }

    // Download the file
    const response = await axios.get(fileUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', async () => {
      try {
        // Print the downloaded file
        await print(filePath, { printer: printerName });
        // Remove the file after printing
        fs.unlinkSync(filePath);
        res.json({ status: 'success' });
      } catch (error) {
        console.error('Error during print job:', error);
        res.status(500).json({ status: 'error', error: error.message });
      }
    });

    writer.on('error', (err) => {
      console.error('Error writing file:', err);
      res.status(500).json({ status: 'error', error: err.message });
    });
  } catch (error) {
    console.error('Error during file download:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Printer service listening at http://localhost:${port}`);
});
