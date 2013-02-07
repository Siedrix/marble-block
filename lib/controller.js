define(function () {
	var Controller = function(config){
		config = config || {};

		console.log('creating controller', config)

		var self = function (server) {
			self._routes.get.forEach(function (route) {
				server.get.apply(server, route);
			})
		}

		self._routes = {
			get : []
		};

		self.config = function(config){
			this.path = config.path || "";
		}

		self.get = function (path, callback) {
			arguments[0] = '/' + self.path + arguments[0];

			self._routes.get.push(arguments);
		}

		self.config(config);

		return self;
	}

	return Controller
});