const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
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
  Article.find(function(err, foundArticles){
    res.render("home", {articles: foundArticles});
  });
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
  res.redirect("/admin");
});

app.get("/article/:articleId", function(req, res){
  Article.findOne({_id: req.params.articleId}, function(err, foundArticle){
    if(!err){
      res.render("article", {
        title: foundArticle.title,
        content: foundArticle.content
      });
    }
  });

});

app.post("/admin", function(req, res){
    Admin.findOne({email: req.body.email}, function(err, foundData){
      if(err){
        res.redirect("/admin");
      } else{
        if(req.body.password === ""){
          res.redirect("/admin");
        } else{
          if(req.body.password === foundData.password){
            res.render("compose");
          }
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
      res.redirect("/");
    }
  });
});

app.post("/article/:articleId", function(req, res){
  res.redirect("/article/"+req.params.articleId);
});

app.listen(3000, function(){
  console.log("Server started at port 3000");
});
