var express = require('express')
var router = express.Router();
var UserModel = require('../models/users')
var sha1 = require('sha1')

var checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/', checkNotLogin , function(req, res, next){
  res.render('signin')
})

router.post('/',checkNotLogin, function(req, res, next) {
  var name = req.fields.name
  var password = req.fields.password
  console.log('getUserByName ing')
  UserModel.getUserByName(name) 
      .then(function(user){
        console.log('getUserByName success')
        if(!user){
          req.flash('error','用户不存在')
          return res.redirect('back')
          // res.redirect('/')
        }
        if(sha1(password) !== user.password) {
          req.flash('error','用户名或密码错误')
          return res.redirect('back')
          // res.redirect('/')
        }
        req.flash('success','登陆成功')

        delete user.password
        req.session.user = user
        res.redirect('/')
      })
      .catch(next)
});


module.exports = router;