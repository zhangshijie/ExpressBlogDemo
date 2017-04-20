var Post = require('../lib/mongo').Post
var marked = require('marked')

module.exports = {
  create: function create(post) {
    return Post.create(post).exec()
  },

  getPostById: function getPostById(postId) {
    return Post 
      .findOne({ _id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  getPosts: function getPosts(author) {
    var query = {};
    if(author) {
      query.author = author
    }
    return Post 
      .find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  incPv: function incPv(postId){
    return Post
         .update({_id: postId}, {$inc: {pv: 1}})
         .exec()
  }
}

Post.plugin('contentToHtml', {
  aftefFind: function(posts) {
    return postMessages.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})
