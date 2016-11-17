var express = require('express');
var router = express.Router();
var multer = require('multer');
// Handle File Uploads
var upload = multer({dest: './uploads'});

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

router.post('/register', upload.single('profileImage'), function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  
  if(req.file){
    console.log('Uploading file...')
    const profileImage = req.file.filename;

    } else{
      console.log('No file uploaded')
      const profileImage = 'noImage.jpg';
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
    console.log('No Errors');
  }
});

module.exports = router;
