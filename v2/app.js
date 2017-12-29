// BASE SETUP
// =============================================================================

// Call the packages we need.
var expressSanitizer = require("express-sanitizer"),
methodOverride       = require("method-override"),
bodyParser           = require('body-parser'),
express            = require('express'),
app                = express();

// App Coniguration.
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(expressSanitizer());// after bodyParser(always)
app.use(methodOverride("_method"));

// Database Setup.
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelp_camp');

// Campground model lives here.
var Campground = require("./app/models/Campground.js");

// RESTful Routes

app.get("/", function(req, res) {
    res.render("landing");
});

// CREATE NEW CAMPGROUND
app.get("/campgrounds", function(req, res) {
  //Render all the information from campgrounds
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds:allCampgrounds});
    }
  })
});

//RECIEVES INFORMATION FROM THE FORM.
app.post("/campgrounds", function(req, res) {
  // name and image are names of the inputs inside the from in new.ejs
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  // Create new campground and save it in databases
  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// SHOW THE FOFRM TO CREATE A NEW CAMPGROUND
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err) {
      console.log(err);
    } else {
      res.render("show", {campground: foundCampground});
    }
  });
});

app.listen(3000, function() {
  console.log("YelpCamp server");
});
