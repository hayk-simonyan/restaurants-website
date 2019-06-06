const express = require('express');

const Restaurant = require('../models/restaurants');
const middleware = require('../middleware');

const router = express.Router();

router.get("/", function(req, res) {
    Restaurant.find({}, function(err, allrestaurants) {
        if(err) console.log(err);
        else res.render("restaurants/index", {restaurants: allrestaurants,});
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newRestaurant = {name: name, price: price, image: image, description: desc, author: author};
    Restaurant.create(newRestaurant, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/restaurants");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("restaurants/new");
});

router.get("/:id", function(req, res) {
    Restaurant.findById(req.params.id).populate('comments').exec(function(err, foundRestaurant) {
        if(err) {
            console.log(err)
        } else {
            console.log(foundRestaurant);
            res.render("restaurants/show", {restaurant: foundRestaurant});
        }
    });
});

router.get('/:id/edit', middleware.checkRestaurantOwnership, function(req, res) {
    Restaurant.findById(req.params.id, function(err, foundRestaurant) {
                res.render('restaurants/edit', {restaurant: foundRestaurant});
    });
});

router.put('/:id', middleware.checkRestaurantOwnership, function(req, res) {
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant) {
        if(err) {
            res.redirect('/restaurants');
            console.log(err);
        } else {
            res.redirect('/restaurants/' + req.params.id);
        }
    });
});

router.delete('/:id', middleware.checkRestaurantOwnership, function(req, res) {
    Restaurant.findByIdAndRemove(req.params.id, function(err) {
        if(err) res.redirect('/restaurants');
        else res.redirect('/restaurants');
    });
});

module.exports = router;