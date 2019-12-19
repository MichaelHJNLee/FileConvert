const express = require('express');
const multer = require('multer');
const path = require('path');
const filestack = require('filestack-js');
const key = require('../config/filestack.js');
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
const client = filestack.init(key.apiKey);
app.use(express.static('dist'));

app.post('/api/photo', upload.single('image'), (req, res, next) => {
  client.upload(__dirname + `/../images/${req.file.filename}`)
    .then(res => {
      console.log('success: ', res)
    })
    .catch(err => {
      console.log(err)
  });
})

app.listen(port, console.log(`Listening on port ${port}`));