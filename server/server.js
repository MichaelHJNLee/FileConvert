const express = require('express');
const filestack = require('filestack-js');
const key = require('../config/filestack.js');
const fileUpload = require('express-fileupload');
const app = express(); 
const port = 3000;
const options = { "security": {} };
options["security"]["policy"] = key.pol;
options["security"]["signature"] = key.sec;
const client = filestack.init(key.apiKey, options);

app.use(fileUpload());
app.use(express.static('dist'));


app.post('/api/image/:type', (req, res) => {
  client.upload(req.files.image.data)
  .then((response) => {
    let transformed = client.transform(response.handle, {output: {"format": req.params.type}});
    res.send(transformed)
  })
  .catch((err) => {
    res.send(err);
  })
})

app.listen(port, console.log(`Listening on port ${port}`));