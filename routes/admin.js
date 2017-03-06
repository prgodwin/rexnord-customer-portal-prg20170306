var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Cloudant = require('cloudant');
var vcapServices = require('../vcapServices');
var bcrypt = require('bcryptjs');
var cloudant_service = vcapServices.cloudantNoSQLDB[0].credentials;
var cloudant = Cloudant({account:cloudant_service.username, password:cloudant_service.password});
var db = cloudant.db.use('devices');

router.get('/admindash', isAdmin, function(req, res, next) {
  res.render('admindash', {title: 'Admin Dashboard'});
});

router.get('/configuration', isAdmin, function(req, res, next) {
  res.render('configuration', {title: 'Device Configuration'});
});

router.get('/devices', isAdmin, function(req, res, next) {
    var devices = []
    db.list({include_docs:true}, function (err, data) {
        for (var i = 0; i < data.rows.length; i++ ) {
            devices.push(data.rows[i].doc.device); 
        }
        console.log(devices);   
        
        devicestr=(devices);
        devices.push(devicestr);
    
        res.render('devices', {
           title: 'Devices',
           devices: devicestr
        })
    });
});

router.get('/addDevice', isAdmin, function(req, res, next) {
  res.render('addDevice', {title: 'Add Device'});
});

router.post('/addDevice', function(req, res) {
var device = {
    "deviceID": req.body.deviceID,
    "device_name": req.body.device_name,
    "son": req.body.son,
    "gearbox_size": req.body.gearbox_size,
    "gearbox_configuration": req.body.gearbox_configuration,
    "gearbox_nominal_ratio": req.body.gearbox_nominal_ratio,
    "gearbox_exact_ratio": req.body.gearbox_exact_ratio,
    "customer_name": req.body.customer_name,
    "install_location": req.body.install_location,
    "install_country": req.body.install_country,
    "basic_or_advanced": req.body.basic_or_advanced,
    "customer_motor_speed_rpm": req.body.customer_motor_speed_rpm,
    "customer_motor_amp_rating": req.body.customer_motor_amp_rating,
    "customer_motor_hp": req.body.customer_motor_hp,
    "customer_motor_voltage": req.body.customer_motor_voltage,
    "customer_motor_power_factor": req.body.customer_motor_power_factor,
    "motor_current_transformer_ratio": req.body.motor_current_transformer_ratio,
    "customer_speed_input_scaling_electrical": req.body.customer_speed_input_scaling_electrical,
    "customer_speed_input_scaling_physical": req.body.customer_speed_input_scaling_physical,
    "customer_amp_draw_input_scaling_electrical": req.body.customer_amp_draw_input_scaling_electrical,
    "customer_amp_draw_input_scaling_physical": req.body.customer_amp_draw_input_scaling_physical
}    
//
//
//
//// Form Validation 
//  req.checkBody('company','Name field is required').notEmpty();
//  req.checkBody('name','Name field is required').notEmpty();
//  req.checkBody('email','Email is not valid').isEmail();
//  req.checkBody('auth_token','Authentication Token is required to register').notEmpty();
//  req.checkBody('username','Username field is required').notEmpty();
//  req.checkBody('password','Password field is required').notEmpty();
//  req.checkBody('password2','Passwords do not match').equals(req.body.password);
//  req.checkBody('dev_id_1','You musr register at least 1 Device').notEmpty();
//
//  // Check Errors
//  var errors = req.validationErrors();
//
//  if(errors){
//  	res.render('register', {
//  		errors: errors
//  	});
//  } else{
        db.insert({device}, null, function(err, body){
            if(!err){
                console.log(body);
            }
             req.flash('success', 'You added a new device');

            res.location('devices');
            res.redirect('devices');
        });

});


function isAdmin(req, res, next, user){
	if(user.type == admin){
		return next();
        
	}
	res.redirect('/users/error');
}



module.exports = router;