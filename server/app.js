var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser.json());




//routes
var login = require("./routes/login.js");
app.use('/login', login);

var signup = require("./routes/signup.js");
app.use('/signup', signup);



app.get("/*", function(req,res){
  var file = req.params[0] || "views/index.html";
  res.sendFile(path.join(__dirname, "/public", file));
});

app.set("port", (process.env.PORT || 5000));

app.listen(app.get("port"), function(){
  console.log("\n-End: Sever is running at:", app.get("port"));
});
