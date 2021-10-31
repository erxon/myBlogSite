const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home", {active: true});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactActive: "active"});
});

app.get("/about", function(req, res){
  res.render("about", {aboutActive: "active"});
});

app.get("/admin", function(req, res){
  res.render("admin");
});


app.listen(3000, function(){
  console.log("Server started at port 3000");
});
