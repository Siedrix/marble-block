define( function () {
	var fs = require('fs');
 	var enviroment;

	var readConf = function (filePath) {
		var conf = fs.readFileSync(filePath).toString();

		return JSON.parse(conf);
	}

 	if( process.env.NODE_ENV === 'production' ){
 		enviroment = readConf('./conf/prod.json');
 		enviroment.env = "production";
 	}else{
 		enviroment = readConf('./conf/dev.json');
 		enviroment.env = "development";
 	}

	return enviroment
});