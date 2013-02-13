var vows      = require('vows'),
    assert    = require('assert'),
    request   = require('request')
    requirejs = require('requirejs');

requirejs.config({
    nodeRequire : require
});


requirejs(["../../lib/controller"], function (Controller) {
	var express = require('express'),
		server  = express();

	// Add post, cookie and session support
	server.use(express.bodyParser());
	server.use(express.cookieParser());	

	var closable = server.listen(4000);

	// Controller
	var controller = Controller({
		path : 'controller'
	});

	controller.beforeEach(function(req, res, next){
		if(req.query.lolz){
			res.send('lolz');
			return;
		}

		next();
	});

	controller.get('/', function(req, res){
		res.send("{}")
	});

	controller.get('/multifunction', function(req, res, next){
		req.data = {};
		req.data.body = "multifunction";

		next();
	}, function(req, res) {
		res.send(req.data.body)
	});

	controller.post('/', function (req, res) {
		res.send(req.body.post);
	});

	// Subcontroller
	var subcontroller = Controller({
		path : 'subcontroller'
	});

	subcontroller.beforeEach(function(req, res, next){
		if(req.query.sublolz){
			res.send('sublolz');
			return;
		}

		next();
	});		

	subcontroller.get('', function (req, res) {
		res.send('Subcontrollers Present!!!')
	});

	subcontroller.post('', function (req, res) {
		res.send('Subcontroller: '+req.body.post)
	});

	// Merge controler and subcontroller to the express server;
	controller.attach(subcontroller);
	controller(server);

	vows.describe('Basic Controller test').addBatch({
		"Controller creates a controller" : {
			topic : function(){
				return Controller();
			},
			"controller is a function": function (topic) {
				assert.equal (typeof topic, "function");
			}
		}
	}).addBatch({
		"Request controller information" : {
			topic : function (){
				var topic = this;
				request("http://localhost:4000/controller/", function (err, response, body){
					topic.callback(err, response, body);
				});
			},
			"controller main path return empty object" : function(err, response, body){
				assert.equal (body, "{}");
			}
		},
		"Request to multiple function route" : {
			topic : function (){
				var topic = this;
				request("http://localhost:4000/controller/multifunction", function (err, response, body){
					topic.callback(err, response, body);
				});
			},
			"controller main path return empty object" : function(err, response, body){
				assert.equal (body, "multifunction");
			}
		}
	}).addBatch({
		"Post requests" : {
			topic : function () {
				var topic = this;
				request.post({
			        "headers" : {'content-type' : 'application/x-www-form-urlencoded'}, 
			        "url"     : "http://localhost:4000/controller/",
			        "form"    : {
			            "post" : "lol"
			        }
			    }, function (err, response, body){
					topic.callback(err, response, body);
				});				
			},
			"Post should get post parameter send as response" : function (err, response, body) {
				assert.equal (body, "lol");
			}

		}
	}).addBatch({
		"beforeEach" : {
			topic : function () {
				var topic = this;
				request("http://localhost:4000/controller/?lolz=true", function (err, response, body){
					topic.callback(err, response, body);
				});
			},
			"Value should be modified to lolz" : function (err, response, body) {
				assert.equal(body, 'lolz');
			}
		},
		"beforeEach with post" : {
			topic : function () {
				var topic = this;
				request.post({
			        "headers" : {'content-type' : 'application/x-www-form-urlencoded'}, 
			        "url"     : "http://localhost:4000/controller/?lolz=true",
			        "form"    : {
			            "post" : "lol"
			        }
			    }, function (err, response, body){
					topic.callback(err, response, body);
				});		
			},
			"Value should be modified to lolz" : function (err, response, body) {
				assert.equal(body, 'lolz');
			}			
		}
	}).addBatch({
		"Subcontrollers" : {
			topic : function () {
				var topic = this;
				request("http://localhost:4000/controller/subcontroller", function (err, response, body){
					topic.callback(err, response, body);
				});
			},
			"Value should on controller/subcontroller" : function (err, response, body) {
				assert.equal(body, 'Subcontrollers Present!!!');
			}
		},
		"Subcontrollers have post" : {
			topic : function () {
				var topic = this;
				request.post({
			        "headers" : {'content-type' : 'application/x-www-form-urlencoded'}, 
			        "url"     : "http://localhost:4000/controller/subcontroller",
			        "form"    : {
			            "post" : "posted"
			        }
			    }, function (err, response, body){
					topic.callback(err, response, body);
				});
			},
			"Value should on post to controller/subcontroller" : function (err, response, body) {
				assert.equal(body, 'Subcontroller: posted');
			}			
		},
		"Subcontrollers have beforeEach" : {
			topic : function () {
				var topic = this;
				request("http://localhost:4000/controller/subcontroller?sublolz=true", function (err, response, body){
					topic.callback(err, response, body);
				});
			},
			"Value should be beforeEach response from subcontroller" : function (err, response, body) {
				assert.equal(body, 'sublolz');
			}
		},
		"Subcontrollers have controller beforeEach" : {
			topic : function () {
				var topic = this;
				request("http://localhost:4000/controller/subcontroller?lolz=true", function (err, response, body){
					topic.callback(err, response, body);
				});
			},
			"Value should be beforeEach response from controller" : function (err, response, body) {
				assert.equal(body, 'lolz');
			}
		}
	}).run({}, function(results){
		closable.close();

		delete closable;
		delete server;		
	});
});