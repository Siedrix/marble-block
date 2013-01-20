define(['lib/connection', 'passport','passport-facebook', 'app/models/user', 'conf'],function(Connection, passport, passportFacebook, User, conf){
	var facebook = Connection();

	var FacebookStrategy = passportFacebook.Strategy;

	var FACEBOOK_APP_ID     = conf.facebook.appId;
	var FACEBOOK_APP_SECRET = conf.facebook.appSecret;

	var facebookStrategy = new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: conf.facebook.callbackUrl
	},function(accessToken, refreshToken, profile, done) {
		User.byFacebookUser(profile.username.toLowerCase(), function (err, docs) {
	        if(err){
	            done(err, null);
	            return;
	        }			

	        if(docs.length){
	            done(null, docs[0]);
	            return;
	        }

			done(null, {
				isNewUser    : true,
				strategy     : 'facebook',
				accessToken  : accessToken,
				refreshToken : refreshToken,
				profile      : profile
			});
		});
	});

	facebook.setStrategy(facebookStrategy);

	facebook.get('/auth/facebook', function(req, res, next){
		if(req.session.passport.user){
			req.session.currentUser = req.session.passport.user;
		}

		next();
	},passport.authenticate('facebook',{ scope: ['read_stream', 'publish_actions'] }) );

	facebook.get('/auth/facebook/callback', passport.authenticate('facebook', { 
        failureRedirect: '/login' 
    }),	function(req, res) {
		if(req.session.passport.user.isNewUser){
			res.redirect('/register');
		}else{
	     	res.redirect('/a');
		}
	});

	return facebook;
});