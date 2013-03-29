define(['lib/connection', 'passport','passport-twitter', 'app/models/user', 'conf'],function(Connection, passport, passportTwitter, User, conf){
	var twitter = Connection();

	TwitterStrategy = passportTwitter.Strategy;

	var TWITTER_CONSUMER_KEY    = conf.twitter.consumerKey;
	var TWITTER_CONSUMER_SECRET = conf.twitter.consumerSecret;
	var callbackUrl             = conf.baseUrl + "/auth/twitter/callback"; 

	console.log(callbackUrl);

	var twitterStrategy = new TwitterStrategy({
	    consumerKey: TWITTER_CONSUMER_KEY,
	    consumerSecret: TWITTER_CONSUMER_SECRET,
	    callbackURL: callbackUrl
	},function(token, tokenSecret, profile, done) {
		User.byTwitterUser(profile.username.toLowerCase(), function (err, docs) {
	        if(err){
	            done(err, null);
	            return;
	        }			

	        if(docs.length){
	            done(null, docs[0]);
	            return;
	        }

			done(null, {
				isNewUser   : true,
				strategy    : 'twitter',
				token       : token,
				tokenSecret : tokenSecret,
				profile     : profile
			});
		});
	});

	twitter.setStrategy(twitterStrategy);

	twitter.use('/auth/twitter', Connection.preAuth, passport.authenticate('twitter'));

	twitter.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login?admin' }),
	function(req, res) {
    	if(req.session.oldPassport && req.session.oldPassport.user){
    		res.redirect('/register/merge-connections');
    	}else if(req.session.passport.user.isNewUser){
			res.redirect('/register');
		}else{
	     	res.redirect('/a');
		}
	});	

	return twitter;
});