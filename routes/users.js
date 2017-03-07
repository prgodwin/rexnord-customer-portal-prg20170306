var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Cloudant = require('cloudant');
var vcapServices = require('../vcapServices');
var bcrypt = require('bcryptjs');
var cloudant_service = vcapServices.cloudantNoSQLDB[0].credentials;
var cloudant = Cloudant({account:cloudant_service.username, password:cloudant_service.password});
var db = cloudant.db.use('rexnord-users');





/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('dashboard');
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});


router.post('/login',  function(req, res, next) {
      passport.authenticate('local-login', function(err, userdata, info) {
        console.log("In Passport Authenticate Route");
        if (err || !userdata) { res.status(500).json(info); }
        else {
            req.logIn(userdata, function(err) {        
                if (err) { res.status(500).json(err); }
                else {
					req.flash('success', 'You are now logged in');
                    console.log("loggin userdata from the post function where userdata is passed in the passport authenticate function = " 
                                + JSON.stringify(userdata));
					res.location('/');
			    	res.redirect('/');
                    
                    
                }
            });      
        }
      })(req, res, next);
      
});


// route to post form data to cloudant and register a user
router.post('/register', function(req, res) { 
var company=req.body.company;
var name=req.body.name;
var email=req.body.email;
var auth_token=req.body.auth_token;
var username=req.body.username;
var password=req.body.password;
var dev_id_1=req.body.dev_id_1;
var dev_id_2=req.body.dev_id_2;
var dev_id_3=req.body.dev_id_3;
var dev_id_4=req.body.dev_id_4;
var dev_id_5=req.body.dev_id_5;
var dev_id_6=req.body.dev_id_6;

// Form Validation 
  req.checkBody('company','Name field is required').notEmpty();
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('auth_token','Authentication Token is required to register').notEmpty();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);
  req.checkBody('dev_id_1','You musr register at least 1 Device').notEmpty();

  // Check Errors
  var errors = req.validationErrors();

  if(errors){
  	res.render('register', {
  		errors: errors
  	});
  } else{
  	
//  	hash password and post data to cloudant 
  	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(password, salt, function(err, hash) {
   			db.insert({
   				"_id": username,
                "type": "basic",
			    "company": company,
			    "name": name,
			    "email": email,
			    "auth_token": auth_token,
			    "username": username,
			    "password": hash,
                "devices": [
                    dev_id_1,
                    dev_id_2,
                    dev_id_3,
                    dev_id_4,
                    dev_id_5,
                    dev_id_6
                    ]
			     }, null, function(err, body){
				if(!err){
					console.log(body);
				}
				 req.flash('success', 'You are now registered and can login');

			    res.location('/');
			    res.redirect('/');
			});
    	});
	});
	
	}

});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
