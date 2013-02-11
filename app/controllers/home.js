define(['lib/controller'],function(Controller){
	var homeController = Controller();

	homeController.get('', function (req, res) {
		if(req.session.username){
			res.redirect('/a');
		}

		res.render('index/index');
	});

	return homeController;
});