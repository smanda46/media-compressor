const express = require('express');
const multer  = require('multer');
const cors = require('cors');

const upload = multer({ limits: { fileSize: 1024 * 1024 * 1024 } });
const app = express();
app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    ok: true,
    filename: req.file?.originalname || 'unnamed',
    size: req.file?.size || 0,
    mimetype: req.file?.mimetype || 'unknown',
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Uploader listening on http://localhost:${PORT}`));
