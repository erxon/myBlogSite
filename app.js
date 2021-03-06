const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
/*
To apply authentication, sessions and cookies
*/
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session(
  {
    secret: "iloveyou",
    resave: false,
    saveUninitialized: false
  }
));

app.use(passport.initialize());
app.use(passport.session());

//mongoose
mongoose.connect("mongodb://localhost:27017/etonDB");

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String
});



adminSchema.plugin(passportLocalMongoose);

const Admin = new mongoose.model("Admin", adminSchema);

passport.use(Admin.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// const Admin = mongoose.model('Admin',
//                new mongoose.Schema({ email: String, password: String}),
//                'admin');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

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

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/compose", function(req, res){
  if(req.isAuthenticated()){
    res.render("compose");
  } else {
    res.redirect("/admin");
  }
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
    const admin = new Admin({
      username: req.body.username,
      password: req.body.password
    });
    req.login(admin, function(err){
      if(err){
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/compose");
        });
      }
    });
});

app.post("/register", function(req, res){
  Admin.register(
  {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  }, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/compose");
      });
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
