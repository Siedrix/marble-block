define(['conf', 'mongoose'], function (conf, mongoose) {
	mongoose.connect('localhost', conf.mongoDb.db);

	return mongoose;
});