const express = require('express');
const filestack = require('filestack-js');
const key = require('../config/filestack.js');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const request = require('request');

const app = express(); 
const port = 3000;
const options = { "security": {} };
options["security"]["policy"] = key.pol;
options["security"]["signature"] = key.sec;
const client = filestack.init(key.apiKey, options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(fileUpload());
app.use(express.static('dist'));

app.post('/api/verify', (req, res) => {
  if (req.body.value) {
    request(`https://www.google.com/recaptcha/api/siteverify?secret="${key.capsec}"&response="${req.body.value}"`, (err, response, body) => {
      if(err || (body.success !== undefined && !body.success)) {
        return res.json({"responseCode" : 1, "responseDesc" : "Failed captcha verification"});
      }
      res.json({"responseCode" : 0, "responseDesc" : "Success"});
    })
  } else {
    return res.json({"responseCode" : 1, "responseDesc" : "Failed captcha verification"});
  }
})

app.post('/api/image/:type', (req, res) => {
  client
    .upload(req.files.image.data)
    .then(response => {
      const transformed = client.transform(response.handle, { output: {"format": req.params.type }});
      res.send(transformed)
    })
    .catch(err => {
      res.send(err);
    })
})

app.listen(port, console.log(`Listening on port ${port}`));