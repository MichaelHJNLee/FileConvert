const express = require('express');
const multer = require('multer');
const path = require('path');
const filestack = require('filestack-js');
const fs = require('fs');
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
const options = { "security": {} };
options["security"]["policy"] = key.pol;
options["security"]["signature"] = key.sec;
const client = filestack.init(key.apiKey, options);

app.use(express.static('dist'));


app.post('/api/image/:type', upload.single('image'), (req, res, next) => {
  client.upload(__dirname + `/../images/${req.file.filename}`)
    .then((response) => {
      let transformed = client.transform(response.handle, {output: {"format": req.params.type}});
      res.send(transformed)
      // let src = new filestack.Filelink(response.handle, key.apiKey);
      // src.output({"format": `${req.params.type}`});
      // let data = src.toString();
      // res.send(data)
    })
    .catch((err) => {
      console.log(err, options)
      res.send(err);
    })
    .then(() => {
      fs.unlink(__dirname + `/../images/${req.file.filename}`, (err) => {
        if (err) throw err;
      });
    })
})

app.listen(port, console.log(`Listening on port ${port}`));