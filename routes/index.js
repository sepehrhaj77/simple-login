var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../lib/User'); //defined in User.js


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        "hide": "hidden"
    });
});

router.post('/login', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({
        username: username
    }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        if (!user) {
            res.render("index",{"hidden":"visible"});
            return;
        } else {
            user.comparePassword(password, function(err, isMatch) {
                if (isMatch && isMatch == true) {
                    req.session.user = user;
                    res.redirect('/loginPage');
                    return res.status(200).send();
                } else {
                    res.render('index', {"hidden":"visible"});
                    return;
                }
            });
        }

    });
});

router.get('/loginPage', (req, res, next) =>{
    res.render('loginPage, {req.session.}');
});

router.get('/dashboard', (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send();
    }

    return res.status(200).send("Welcome to site api");
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    return res.status(200).send();
});

router.get('/signup', (req, res, next) =>{
    res.render('signup');
});

router.post('/register', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var newuser = new User();
    newuser.username = username;
    newuser.password = password;
    newuser.firstname = firstname;
    newuser.lastname = lastname;
    newuser.save(function(err, savedUser) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        } else {
            return res.status(200).send();
        }
    });
});

module.exports = router;
