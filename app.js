// Created by Ethan Printz
//---------------------------------------------
// Node Server Setup Code
//---------------------------------------------
// Module Requirements
var express = require('express');
var path = require('path');
var app = express();

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});

app.use(express.static('public'));

// Send index.html at '/'
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/views/index.html'));
});
//Log start of app
console.log("App Started");