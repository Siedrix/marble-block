var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require
});

requirejs(["express",
	"consolidate",
	"swig",
	"passport",
	"app/connections/twitter",
	"app/connections/facebook",
	"app/models/user",
	"conf"],
function (express, cons, swig, passport, twitterConnection, facebookConnection, User, conf) {
	var RedisStore = require('connect-redis')(express),
		server  = express();	

	// Swig configuration
	swig.init({
		root: './app/views',
		cache : false
	});

	// Static assets
	server.use(express.static('./public'));

	// Add post, cookie and session support
	server.use(express.bodyParser());
	server.use(express.cookieParser());

	// server.use(express.session({ secret: "keyboard cat" }));
	server.use(express.session({
		secret : conf.redis.secret,
		store  : new RedisStore({
			host : conf.redis.host,
			port : conf.redis.port,
			user : conf.redis.user,
			pass : conf.redis.pass			
		})
	}));


	// Passport configuration for Express
	server.configure(function() {
	    server.use(express.logger());
	    server.use(express.methodOverride());
	    server.use(passport.initialize());
	    server.use(passport.session());
	});

	passport.serializeUser(function(user, done) {
	    done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	    done(null, obj);
	});

	twitterConnection(server, passport);
	facebookConnection(server, passport);

	// View engine
	server.engine('.html', cons.swig);
	server.set('view engine', 'html');
	server.set('views', './app/views');

	server.get('/', function (req, res) {
		if(req.session.username){
			res.redirect('/a');
		}

		res.render('index/index');
	});

	server.get('/register', function (req, res) {
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

	server.post('/register/create-user', function (req, res) {
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

	server.get('/a', function (req, res) {
		res.render('app/index',{
			user : req.session.passport.user
		});
	});

	server.get('/log-out', function (req, res) {
		delete req.session.passport.user;

		res.redirect('/');
	});

	server.post('/user/post-to-wall', function (req, res) {
		var querystring= require('querystring');

		var o = {message : req.body.wall};
		o.privacy = '{"value" : "EVERYONE"}';

		facebookConnection._strategy._oauth2._request('POST', 'https://graph.facebook.com/me/feed', {
       		'Content-Type': 'application/x-www-form-urlencoded'
   		}, querystring.stringify(o) , req.session.passport.user.facebook.token, function(err, data){
   			console.log(err, data)
   			if(err){
   				res.send(err);
   				return;
   			}

			res.redirect('http://facebook.com');
   		})
		// function (method, url, headers, post_body, access_token, callback) {
	});

	server.post('/user/tweet', function (req, res) {
		var user = req.session.passport.user;

		twitterConnection._strategy._oauth.post('https://api.twitter.com/1.1/statuses/update.json', user.twitter.token, user.twitter.tokenSecret, {
            status : req.body.tweet
        }, null, function (err, body, respone) {
        	if(err){
        		res.send(500);
        		return;
        	}

        	res.redirect('http://twitter.com/'+user.twitter.username);
        });
	});

	server.get('/conf', function (req, res) {
		res.send(conf);
	});

	server.listen(3000);
	console.log('Server started at http://127.0.0.1:3000');
});
