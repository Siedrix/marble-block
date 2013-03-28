define(['conf', 'mongoose'], function (conf, mongoose) {
	if(conf.mongoDb.url){
		mongoose.connect(conf.mongoDb.url);
	}else if(conf.mongoDb.db){
		mongoose.connect('localhost', conf.mongoDb.db);
	}else{
		throw "No DB connection";
	}

	mongoose.conf = conf;

	return mongoose;
});