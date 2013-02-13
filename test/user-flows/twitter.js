var Browser = require("zombie"),
	vows    = require('vows'),
	assert  = require("assert");

var browser = new Browser();
var TWITTER_PASSWORD = "XXX";

//This flow logs a user that already exists using twitter
vows.describe('Twitter Log in').addBatch({
    'Click on link': {
        topic: function () {
        	var topic = this;

   			browser.visit("http://faceauth.siedrix.com:3000/", function () {
				browser.clickLink("#log-in a.twitter", function(){
					topic.callback();	
				});
			});
        },
        'User should be redirected to twitter for log in': function () {
			assert.equal(browser.location.host     , "api.twitter.com");
			assert.equal(browser.location.pathname , "/oauth/authenticate");
        }
    },
}).addBatch({
	'Fill form' : {
    	topic : function () {
    		var topic = this;

    		browser.fill("session[username_or_email]", "Siedrix")
			 .fill("session[password]", TWITTER_PASSWORD);

			browser.pressButton(".buttons #allow", function() {
			 	browser.visit("http://faceauth.siedrix.com:3000/auth/twitter", function () {
			 		topic.callback();
			 	});
			});			
    	},
    	'User Should be on app url' : function() {
			assert.equal(browser.location.href, "http://faceauth.siedrix.com:3000/a");
			assert.equal(!!browser.query("#twitter"), true);
    	}
	}
}).run({}, function(results){
	console.log(results);
});

