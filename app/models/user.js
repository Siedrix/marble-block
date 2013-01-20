define(['lib/model'], function(models){
	var User = models.define('user', function () {
		//Properties
		this.string('username');
		this.string('email');

		// Social profiles
		this.object('twitter');
		this.object('facebook');

		this.filter('byTwitterUser',{include_docs:true}, {
			map : function(doc) {
				if (doc.resource === "User" && doc.twitter) {
					emit( doc.twitter.username, null );
				}
			}
		});

		this.filter('byFacebookUser',{include_docs:true}, {
			map : function(doc) {
				if (doc.resource === "User" && doc.facebook) {
					emit( doc.facebook.username, null );
				}
			}
		});

	});

	return User;	
});