var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Creek", image:"https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
  {name: "Granite Hill", image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
  {name: "Mountain Goat's Rest", image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
  {name: "Salmon Creek", image:"https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
  {name: "Granite Hill", image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
  {name: "Mountain Goat's Rest", image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
  {name: "Salmon Creek", image:"https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
  {name: "Granite Hill", image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
  {name: "Mountain Goat's Rest", image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"}
]

app.get("/", function(req, res) {
    res.render("landing");
});

// CREATE NEW CAMPGROUND
app.get("/campgrounds", function(req, res) {
  //Render all the information from campgrounds
  res.render("campgrounds", {campgrounds: campgrounds});
});

//RECIEVES INFORMATION FROM THE FORM.
app.post("/campgrounds", function(req, res) {
  // name and image are names of the inputs inside the from in new.ejs
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

// SHOW THE FOFRM TO CREATE A NEW CAMPGROUND
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(3000, function() {
  console.log("YelpCamp server");
});
