'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

// SerializeUser from doc, update method to dev created getUserById
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//  Local Strategy
passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, (password, isMatch)=> {
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:"Invalid Password"});
      }
      
    });
  });
}));

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: ' Invalid username or password'}),
  function(req, res) {
    req.flash('success', "You are now logged in");
    res.redirect('/');
});




router.post('/register', upload.single('profileImage'), function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;

  // Check uploaded file exists or not and assign to variable profileImage  
  if(req.file){
    console.log('Uploading file...')
    var profileImage = req.file.filename;
    } else{
      console.log('No file uploaded')
      var profileImage = 'noImage.jpg'; // const || let  didn't work here.  TODO: why didn't const || let work to store this variable but var did
    }

  // Form validator
  req.checkBody('name', "Name field is required").notEmpty();
  req.checkBody('email', "Email field is required").notEmpty();
  req.checkBody('email', "Email is not valid").isEmail();
  req.checkBody('username', "Username field is required").notEmpty();
  req.checkBody('password', "Password field is required").notEmpty();
  req.checkBody('password2', "password do not match").equals(req.body.password);

  // Check errors
  const errors = req.validationErrors();

  if(errors){
    console.log("Errors");
    // rerender page if errors
    res.render('register', {
      errors: errors
    })
  } else {
    console.log('profileImage', profileImage);
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      // profileImage: profileImage
    });

    User.createUser(newUser, function (err, user) {
      if(err) throw err ;
      console.log(user);
    });

    req.flash('success', "You are now registered and can login."); // from the flash module that was loaded in app

    res.location('/');
    res.redirect('/');
  }
});

router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success', "You are now logged out");
  res.redirect('/users/login');
});

module.exports = router;
