define([
	'lib/model',
	'app/models/post',
	'querystring',
	"app/connections/twitter",
	"app/connections/facebook"	
], function(models, Post, querystring, twitterConnection, facebookConnection){
	var Schema = models.Schema;

	var userSchema = Schema({ 
		username    : 'string',
		email       : 'string',
		displayName : 'string',
		twitter     : Schema.Types.Mixed,
		facebook    : Schema.Types.Mixed
	});

	var User = models.model('user', userSchema);

	User.byTwitterUser = function(twitterUsername, done){
		User.find({
			"twitter.username" : twitterUsername
		}, function(err, user){
			done(err, user);
		});
	};

	User.byFacebookUser = function(facebookUsername, done){
		User.find({
			"facebook.username" : facebookUsername
		}, function(err, user){
			done(err, user);
		});
	};


	User.prototype.shareToTwitter = function(data, callback) {
		var twitterConnection = require("app/connections/twitter");

		var user = this;

		twitterConnection._strategy._oauth.post('https://api.twitter.com/1.1/statuses/update.json', user.twitter.token, user.twitter.tokenSecret, {
            status : data.message +' '+data.url
        }, null, function (err, body, respone) {
        	if(err){
        		console.log('Error on share to Twitter');
        		
	        	if(callback){
	        		callback({error: err}, null);
	        	}
        		return;
        	}

        	if(callback){
        		callback(null, body);
        	}
        });		
	};

	User.prototype.shareToFacebook = function(data, callback) {
		var facebookConnection = require("app/connections/facebook"),
			querystring       = require("querystring");

		debugger;
		var user = this;

		var o = {message : data.message +' '+data.url};
		o.privacy = '{"value" : "EVERYONE"}';

		facebookConnection._strategy._oauth2._request('POST', 'https://graph.facebook.com/me/feed', {
       		'Content-Type': 'application/x-www-form-urlencoded'
   		}, querystring.stringify(o) , user.facebook.token, function(err, data){
        	if(err){
        		console.log('Error on share to Facebook');
        		
	        	if(callback){
	        		callback({error: err}, null);
	        	}
        		return;
        	}

        	if(callback){
        		callback(null, body);
        	}
   		});	
	};	

	console.log('returning User', typeof User)

	return User;	
});