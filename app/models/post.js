define(['lib/model'], function(models){
	var Schema = models.Schema;

	var postSchema = Schema({ 
		title       : 'string',
		content     : 'string',
		timestamp   : { type: Date, default: Date.now },
		owner      : { type: Schema.Types.ObjectId, ref: 'user' }
	});

	var Post = models.model('post', postSchema);
	
	return Post;	
});