var express = require('express');
var router = express.Router();
var Cloudant = require('cloudant');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var vcapServices = require('../vcapServices');
var cloudant_service = vcapServices.cloudantNoSQLDB.credentials;
var cloudant = Cloudant({account:cloudant_service.username, password:cloudant_service.password});
var db = cloudant.db.use('users');



require('../config/passport')(passport);
//console.log("printing the user from index route " + user);


/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  var User = JSON.stringify(req.user);
    if (req.user.type == "admin"){
      console.log({User});    
      res.render('admindash', {title: 'Admin Dashboard'});
    }else{
      res.render('dashboard', { title: 'Dashboard' });
      console.log("from the index route: var User = JSON.stringify(req.user) "
                  + {User}); 
    }    
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
        
	}
	res.redirect('/users/login');
}


module.exports = router;