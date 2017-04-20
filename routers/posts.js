var express = require('express')
var router = express.Router()

var checkLogin = require('../middlewares/check').checkLogin

router.get('/', function(req, res, next) {
   res.send(req.flash())
});

//POST /post 发表一篇文章
router.post('/', function(req, res, next) {
   res.send(req.flash())
});

router.get('/create' , checkLogin, function(req, res, next) {
   res.send(req.flash())
});

router.get('/:postId', function(req, res, next) {
   res.send(req.flash())
});

router.get('/:postId/edit',checkLogin, function(req, res, next) {
   res.send(req.flash())
});

router.post('/:postId/edit',checkLogin, function(req, res, next) {
   res.send(req.flash())
});

router.get('/:postId/remove',checkLogin, function(req, res, next) {
   res.send(req.flash())
});

router.post('/:postId/comment',checkLogin, function(req, res, next) {
   res.send(req.flash())
});


router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
   res.send(req.flash())
})

module.exports = router