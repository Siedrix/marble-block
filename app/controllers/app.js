define([
	'lib/controller', 
	'app/controllers/post',
	'app/controllers/user',
	'app/models/user',
	'app/models/post'
],function(Controller, PostController, UserController, User, Post){
	var appController = Controller({
		path : "a"
	});

	appController.attach(PostController);
	appController.attach(UserController);

	appController.beforeEach(function(req, res, next){
		if(!req.session.passport.user){
			res.redirect('/');
			return 
		}

		User.findOne({
			username : req.user.username
		}, function(err, user){
			if(err){
				console.log(err);
				res.send(500);
				return;
			}

			req.user = user;

			next();
		});

	});

	appController.get('', function (req, res) {
		Post.find({})
		 .populate('owner')
		 .exec(function(err, posts){
			if(err){
				console.log(err);
				res.send(500);
				return;
			}

			res.render('app/index',{
				user  : req.session.passport.user,
				posts : posts
			});
		});
	});

	return appController;
});