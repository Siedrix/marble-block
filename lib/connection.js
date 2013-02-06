define(function () {
	var Connection = function(){
		var self = function(server, passport){
			self.routes.get.forEach(function (action) {
				server.get.apply(server, action);
			});

			self.routes.use.forEach(function (action) {
				server.get.apply(server, action);
			});

			if(self._strategy){
				passport.use(self._strategy);
			}
		};

		self.routes = {
			get : [],
			use : []
		}

		self.get = function() {
			this.routes.get.push(arguments);
		};

		self.setStrategy = function (strategy) {
			self._strategy = strategy;
		}

		self.use = function () {
			this.routes.use.push(arguments);
		}

		return self;
	}

	Connection.preAuth = function (req, res, next) {
		if(req.session.passport){
			req.session.oldPassport = req.session.passport;
		}

		next();
	}

	return Connection;
});