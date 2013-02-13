define(['lib/controller'],function(Controller){
	var appController = Controller({
		path : "a"
	});

	appController.beforeEach(function(req, res, next){
		if(!req.session.username){
			res.redirect('/');
			return 
		}

		next();
	});

	appController.get('', function (req, res) {
		res.render('app/index',{
			user : req.session.passport.user
		});
	});

	return appController;
});