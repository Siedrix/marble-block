define(function () {
	var Controller = function(config){
		config = config || {};

		var self = function (server) {
			self._routes.get.forEach(function (route) {
				server.get.apply(server, route);
			});

			self._routes.post.forEach(function (route) {
				server.post.apply(server, route);
			});			
		}

		self._routes = {
			get  : [],
			post : []
		};

		self.config = function(config){
			this.path = config.path || "";
		}

		self.get = function () {
			arguments[0] = '/' + self.path + arguments[0];

			self._routes.get.push(arguments);
		}

		self.post = function () {
			arguments[0] = '/' + self.path + arguments[0];

			self._routes.post.push(arguments);
		}

		self.config(config);

		return self;
	}

	return Controller
});