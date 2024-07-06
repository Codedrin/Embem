const express = require('express');
const cors = require('cors');
const { getPrinters, print } = require('pdf-to-printer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

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

const checkPrinterStatus = (printerName) => {
  return new Promise((resolve, reject) => {
    exec(`wmic printer where name="${printerName}" get PrinterStatus`, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error('Failed to retrieve printer status'));
      }
      const status = stdout.trim().split('\n')[1].trim();
      resolve(status === '3'); // 3 means online
    });
  });
};

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
        // Get the list of available printers
        const printers = await getPrinters();
        const printerNames = printers.map(printer => printer.name);

        // Check if the provided printer name is in the list of available printers
        if (!printerNames.includes(printerName)) {
          throw new Error('Printer not found');
        }

        // Check if the printer is online
        const isOnline = await checkPrinterStatus(printerName);
        if (!isOnline) {
          throw new Error('Printer is offline');
        }

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
