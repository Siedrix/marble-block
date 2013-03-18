define(['lib/controller', 'app/models/post'],function(Controller, Post){
	var postController = Controller({
		path : "post"
	});

	postController.post('/new', function (req, res) {
		var post = new Post({
			title   : req.body.title,
			content : req.body.content,
			owner  : req.user._id
		});

		post.save(function (err) {
			if (err){
				console.log(err);
				res.send(500);
				return;
			}

			res.redirect('/a/user/'+ req.user.username);
		});
	});

	return postController;
});