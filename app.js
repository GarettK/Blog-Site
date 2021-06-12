// Require Section
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

// Connect to our database
const uri = "mongodb://localhost:27017/blogDB";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Create post schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please check your data entry, title is missing."]
  },
  post: {
    type: String
  },
  link: {
    type: String
  },
  shortPost: {
    type: String
  }
});

// Create model for new posts from Schema
const Post = new mongoose.model("Post", postSchema);

// Starting Content
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const allPosts = [];

// GET section
app.get("/", function(req, res) {
  Post.find(function(err, foundPosts) {
    if (!err) {
      // Put DB posts into array allPosts
      if (allPosts.length == 0) {
        foundPosts.forEach(post => allPosts.push(post));
      }
    }
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: allPosts});
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:post", function(req, res) {
  const requestId = req.params.post;

  allPosts.forEach(function(post) {
    if ( post.id === requestId ) {
      res.render("post", {singlePost: post});
    }
  });
});

// POST Section
app.post("/compose", function(req, res) {
  //https://stackoverflow.com/questions/1983648/replace-spaces-with-dashes-and-make-all-letters-lower-case
  var link = "/posts/";
  var shortPost = req.body.post;
  if (shortPost.length > 100) {
    shortPost = shortPost.substring(0,100) + "...";
  }
  // Make New DB item
  const newPost = new Post({
    title: req.body.title,
    post: req.body.post,
    link: link,
    shortPost: shortPost
  });
  newPost.link += newPost.id; // Update link to include post_id
  newPost.save();
  allPosts.push(newPost);
  res.redirect("/");
});

// Empty Database
app.get("/delete", function(req, res) {
  Post.deleteMany(function(err) {
    if (err) {
      console.log(err);
    }
  });
  allPosts.length = 0;
  res.redirect("/");
});





app.listen(PORT, function() {
  console.log("Server started on port " + PORT + ".");
});
