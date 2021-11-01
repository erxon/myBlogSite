const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static("public"));

//mongoose
mongoose.connect("mongodb://localhost:27017/etonDB");

const adminSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Admin = new mongoose.model(adminSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/home", function(req, res){
  res.render("home");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/admin", function(req, res){
  res.render("admin");
});

app.post("/admin", function(req, res){
  const email = req.body.email;
  const password = req.body.password;

});

app.listen(3000, function(){
  console.log("Server started at port 3000");
});
