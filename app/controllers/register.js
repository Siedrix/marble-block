define(['lib/controller', 'app/models/user'],function(Controller, User){
	var registerController = Controller({
		path : 'register'
	});

	registerController.get('', function (req, res) {
		if (!req.session.passport.user) { 
			res.redirect('/');
			return;
		}

		if (!req.session.passport.user.isNewUser) {
			res.redirect('/a');
			return;
		}

		res.render('register/index', {
			user : req.session.passport.user
		});
	});

	registerController.get('/merge-connections', function(req, res){
		User.find({id : req.session.oldPassport.user.id}, function (err, doc) {
			if (err) {
				res.send(err);
				return;
			}

			if (!doc) {
				res.send('No user found');
				return;
			}

			var passportUser = req.session.passport.user,
				user = doc[0];

			if(passportUser.strategy === "twitter"){
				delete passportUser.profile.photos;
				delete passportUser.profile._raw;

				user.twitter = {
					token       : passportUser.token,
					tokenSecret : passportUser.tokenSecret,
					profile     : passportUser.profile,
					username    : passportUser.profile.username.toLowerCase()
				}
			}				

			if ( req.session.passport.user.strategy === "facebook" ){
				delete passportUser.profile._raw;

				user.facebook = {
					token         : passportUser.accessToken,
					refreshSecret : passportUser.refreshToken,
					profile       : passportUser.profile,
					username      : passportUser.profile.username.toLowerCase()
				}				
			}

			user.save(function(){
				delete req.session.oldPassport;
				req.session.passport.user = user;

				res.redirect('/a');
				return;
			});
			// body...
		});
	});

	registerController.post('/create-user', function (req, res) {
		if(!req.session.passport.user){
			res.redirect('/');
			return;
		}

		var passportUser = req.session.passport.user;
		var user = {
			username    : req.body.username.toLowerCase(),
			displayName : req.body.displayName,
		}

		if(passportUser.strategy === "twitter"){
			delete passportUser.profile.photos;
			delete passportUser.profile._raw;

			user.twitter = {
				token       : passportUser.token,
				tokenSecret : passportUser.tokenSecret,
				profile     : passportUser.profile,
				username    : passportUser.profile.username.toLowerCase()
			}
		}

		if(passportUser.strategy === "facebook"){
			delete passportUser.profile._raw;

			user.facebook = {
				token         : passportUser.accessToken,
				refreshSecret : passportUser.refreshToken,
				profile       : passportUser.profile,
				username      : passportUser.profile.username.toLowerCase()
			}
		}

		user = new User(user);

		user.save(function (err, doc) {
			if(err){
				res.send(500);
				return;
			}

			req.session.passport.user = doc;

			res.redirect('/a');
		});
	});	

	return registerController;
});