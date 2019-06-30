//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true }));

mongoose.connect("mongodb+srv://Hitesh:aEJKOzLlMUdAxzdt@firstcluster-b2pbe.gcp.mongodb.net/wikiDB", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const homeStartingContent ="A Full Stack Website which can be used to create blog posts, it is built using EJS at the front end and Node js and MongoDB at the back end. Also, the user can edit and delete the post, the website is hosted on Heroku cloud platform.";
const aboutContent = "Hi I am Hitesh and I am a Web Developer";
const contactContent = "Contact me at shindehitesh26@gmail.com";
var foundArticles = [];

const articleSchema = {
  title : String,
  content : String
};

//collection in mongodb
const Article =  mongoose.model("Article", articleSchema);

app.get("/", function(req, res) {

    Article.find({},function(err,foundArticles){
      res.render("home", {
        startingContent: homeStartingContent,
        newPosts: foundArticles
      });
    });

});

//get specific article
app.get("/articles/:articleTitle", function(req,res){

  let article = req.params.articleTitle;

  Article.findOne({title: article}, function(err, foundArticle){

    if(foundArticle){
      res.render("post",{
        singleTitle: foundArticle.title,
      singleContent: foundArticle.content
      });
    }else {
      res.send("No article found");
    }
  });
});

//To compose a new article
app.route("/compose").get(function(req,res){
  res.render("compose");

}).post(function(req, res){

  const newArticle = new Article({

  title : req.body.composePost,
  content : req.body.composeBody
});

newArticle.save(function(err){
    if(!err){
      res.redirect("/");
    } else {
      res.send(err);
    }
});
});

// To edit the article
app.route("/edit/:articleTitle").get(function(req,res){
  var articleTitle = req.params.articleTitle;
  res.render("edit",{
    singleTitle: articleTitle
  });
}).post(function(req , res){
  var articleTitle = req.body.title;

  Article.update({title: articleTitle}, {$set: req.body }, function(err){
    if(!err){
    res.redirect("/");
    }else {
      res.send(err);
    }
  });
});

//To delete the post.
app.get("/delete/:articleTitle",function(req,res){
  let articleTitle = req.params.articleTitle;

  Article.deleteOne({title: articleTitle}, function(err){
  if(!err){
    res.redirect("/");
  }else {
    res.send(err);
  }
});
});
app.get("/about", function(req, res) {

  res.render("about", {
    aContent: aboutContent
  });
});

app.get("/contact", function(req, res) {

  res.render("contact", {
    cContent: contactContent
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started");
});
