const Restaurant = require("../models/restaurants");
const Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkRestaurantOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Restaurant.findById(req.params.id, function(err, foundRestaurant) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundRestaurant.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You Don't Have Permission For That");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You Need To Be Logged In");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash("error", "Restaurant Not Found");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You Don't Have Permission For That");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You Need To Be Logged In!");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You Need To Be Logged In!");
  res.redirect("/login");
};

module.exports = middlewareObj;
