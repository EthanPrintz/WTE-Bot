// Created by Ethan Printz
//---------------------------------------------
// Node Server Setup Code
//---------------------------------------------
// Module Requirements
var express = require('express');
var path = require('path');
var app = express();

app.listen(3000, () => {
  console.log('Server is up on 3000')
})

app.use(express.static('public'));

// Send index.html at '/'
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/views/index.html'));
});
//Log start of app
console.log("App Started");