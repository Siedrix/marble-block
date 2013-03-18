define([
	'lib/controller', 
	'app/models/user',
	'app/models/post',
],function(Controller, User, Post){
	var userController = Controller({
		path : "user/:username"
	});

	userController.get('', function (req, res) {

		User.findOne({ username: req.params.username }, function (err, user) {
			if (err){
				res.send(500);
				console.log(err);
				return;
			};

			Post.find({ owner: user._id })
			 .sort('-timestamp')
			 .exec(function (err, posts) {
				if (err){
					res.send(500);
					console.log(err);
					return;
				};

				res.render('user/index',{
					currentUser  : user,
					posts : posts
				});
			});

		});
	});

	userController.get('/post/:postId', function(req, res){
		Post.findOne({ "_id" : req.params.postId })
		 .populate('owner')
		 .exec(function(err, post){
			if(err){
				console.log(err);
				res.send(500);
				return;
			}

			res.render('user/post-single',{
				user : req.session.passport.user,
				post : post
			});
		});

	});

	return userController;
});