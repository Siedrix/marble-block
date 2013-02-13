var Browser = require("zombie"),
	vows    = require('vows'),
	assert  = require("assert");

var browser = new Browser();
var FACEBOOK_PASSWORD = "XXX";

// Creates a new user on facebook
vows.describe('Twitter Log in').addBatch({
    'Click on link': {
        topic: function () {
        	var topic = this;

   			browser.visit("http://faceauth.siedrix.com:3000/", function () {
				browser.clickLink("#log-in a.facebook", function(){
					topic.callback();	
				});
			});
        },
        'User should be redirected to twitter for log in': function () {
			assert.equal(browser.location.host     , "www.facebook.com");
			assert.equal(browser.location.pathname , "/login.php");
        }
    },
})
.addBatch({
	'Fill form' : {
    	topic : function () {
    		var topic = this;

    		browser.fill("email", "siedrix@gmail.com")
			       .fill("pass" , FACEBOOK_PASSWORD);

			console.log( browser.html('login') )
			browser.pressButton("login", function() {
				browser.pressButton("grant_required_clicked", function () {
					console.log(browser.location.href);
					browser.pressButton("grant_clicked", function () {
					 	topic.callback();
				 	});
				})
			});			
    	},
    	'User Should be on app url' : function() {
			assert.equal(browser.location.href, "http://faceauth.siedrix.com:3000/register");
    	}
	}
})
.run({}, function(results){
	console.log(results);
});

