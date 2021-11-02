const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static("public"));

//mongoose
mongoose.connect("mongodb://localhost:27017/etonDB");
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Admin = mongoose.model('Admin',
               new mongoose.Schema({ email: String, password: String}),
               'admin');

const Article = new mongoose.model("Article", articleSchema);

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

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/admin", function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  Admin.findOne({email: email}, function(err, foundData){
    if(err){
      console.log(err);
    } else{
      if(password === foundData.password){
        res.redirect("/compose");
      }
    }
  });
});

app.post("/compose", function(req, res){
  const title = req.body.title;
  const content = req.body.content;

  const newArticle = new Article({
    title: title,
    content: content
  });

  newArticle.save(function(err){
    if(!err){
      console.log("successfully saved");
    }
  });
});

app.listen(3000, function(){
  console.log("Server started at port 3000");
});
