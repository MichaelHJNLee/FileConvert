const express = require('express');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
const upload = multer({ storage: storage });
const app = express();
const port = 3000;

app.use(express.static('dist'));

app.post('/api/photo', upload.single('image'), (req, res, next) => {
  console.log(req.body, req.file);
})

app.listen(port, console.log(`Listening on port ${port}`));