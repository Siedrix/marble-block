define(['lib/model'], function(models){
	var Schema = models.Schema;

	var userSchema = models.Schema({ 
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
	
	return User;	
});