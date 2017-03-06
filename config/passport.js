var LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport) {
	
	var Cloudant = require('cloudant');
	var vcapServices = require('../vcapServices');
	var cloudant_service = vcapServices.cloudantNoSQLDB[0].credentials;
	var cloudant = Cloudant({account:cloudant_service.username, password:cloudant_service.password});
	
	var bcrypt = require('bcryptjs');

    /// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        done(null, username);
    });


    passport.use('local-login',new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
//            var body = req.body;
//            console.log(JSON.stringify(body));

            // Use Cloudant query to find the user just based on user name
            var db = cloudant.db.use('users');
            db.get(username, function(err, result) {
                if (err){
                    console.log("There was an error finding the user: " + err);
                    return done(null, false, { message : err } );
                } 
                if (result.length == 0){
                    console.log("Username was not found");
                    return done(null, false, { message : result } );
                }

                // user was found, now determine if password matches
                var userdata = result;
                if (bcrypt.compareSync(password, userdata.password)) {
                    console.log("Password matches");
                     // all is well, return successful user
                    return done(null, userdata);
                } 
                    console.log("Password is not correct");
                    //err = {"reason":"Password is incorrect"};
                    return done(null, false, { message :"Password is incorrect"} );               
            });
        }
    ));
};