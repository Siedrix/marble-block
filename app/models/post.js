define(['lib/model'], function(models){
	var Schema = models.Schema;

	var postSchema = Schema({ 
		title       : 'string',
		content     : 'string',
		timestamp   : { type: Date, default: Date.now },
		owner      : { type: Schema.Types.ObjectId, ref: 'user' }
	});

	var Post = models.model('post', postSchema);

	Post.prototype.url = function(req) {
		return models.conf.baseUrl + '/a/user/'+ this.owner.username +'/post/' + this.id;
	};
	
	return Post;	
});