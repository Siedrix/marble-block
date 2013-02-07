var vows      = require('vows'),
    assert    = require('assert'),
    request   = require('request')
    requirejs = require('requirejs');

requirejs.config({
    nodeRequire : require
});


requirejs(["../../lib/controller"], function (Controller) {
	var express = require('express'),
		server  = express(),
		closable = server.listen(4000);

	var controller = Controller({
		path : 'controller'
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
	}).run({}, function(results){
		closable.close();

		delete closable;
		delete server;		
	});
});