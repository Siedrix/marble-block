var vows = require('vows'),
    assert = require('assert'),
    requirejs = require('requirejs');

requirejs.config({
    nodeRequire : require
});


requirejs(["../../lib/connection"], function (Connection) {
	vows.describe('Basic Connection test').addBatch({
	    'Add routes to express': {
	        topic: function () {
	        	var express = require('express'),
	        		server  = express();

	        	var connection = Connection();
	        	connection.get('/', function(){});
	        	connection(server);

	        	return server.routes;
	        },

	        'Express app should have one route now': function (topic) {
	            assert.equal (topic.get && topic.get.length, 1);
	        }
	    },
	    'Add to passport strategy to passport' : {
	    	topic : function () {
	        	var passport = require('passport');

	        	var strategy = new passport.Strategy();
	        	strategy.name = "lol";

	        	var connection = Connection();
	        	connection.setStrategy(strategy);
	        	connection(null, passport);

	        	return passport;
	    	},
	    	'Express app should have passport strategy registed' : function (topic) {
	    		assert.isObject (topic._strategies && topic._strategies.lol);
	    	}
	    }
	}).run();
});
