// BASE SETUP
// =============================================================================

// Call the packages we need.
var expressSanitizer = require('express-sanitizer'),
methodOverride       = require('method-override'),
bodyParser           = require('body-parser'),
express              = require('express'),
app                  = express();

// App Coniguration.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(expressSanitizer());// after bodyParser(always)
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

// Database Setup.
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelp_camp');

// Models lives here.
var Campground = require('./app/models/Campground.js');
var Comment = require('./app/models/Comments.js');

// RESTful Routes

//Campgrounds Routes.

app.get("/", function(req, res) {
    res.render('landing');
});

// SHOW ALL CAMPGROUNDS
app.get('/campgrounds', function(req, res) {
  //Render all the information from campgrounds
  Campground.find({}, function(err, allCampgrounds) {
    if(err) console.log(err);
    else res.render('campgrounds/index', {campgrounds:allCampgrounds});
  })
});

//RECIEVES INFORMATION FROM THE FORM AND CREATE A NEW CAMPGROUND.
app.post('/campgrounds', function(req, res) {
  // name and image are names of the inputs inside the from in new.ejs
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  // Create new campground and save it in databases
  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) console.log(err);
     else res.redirect('/campgrounds');
  });
});

// SHOW THE FORM TO CREATE A NEW CAMPGROUND
app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new');
});

// SHOW - shows more info about one campground.
app.get('/campgrounds/:id', function(req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// Comments Routes.

app.get('/campgrounds/:id/comments/new', function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', function(req, res) {
  // lookup campground using ID.
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment.
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        } 
      });
    }
  });

});

app.listen(3000, function() {
  console.log("YelpCamp server");
});
