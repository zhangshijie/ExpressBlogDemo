var path = require('path');
var express = require('express');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var pkg = require('./package');
var routes = require('./routers');
var config = require('config-lite')(path.join(__dirname,'config'));
var winston = require('winston')
var expressWinston = require('express-winston')

var app = express();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))



app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url: config.mongodb
  })
}))

app.use(flash())


// 设置模板全局常量
// 使用上的区别在于：app.locals 上通常挂载常量信息（如博客名、描述、作者信息），res.locals 上通常挂载变量信息，即每次请求可能的值都不一样（如请求者信息，res.locals.user = req.session.user）。
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};
// 添加模板必需的三个变量
app.use(function(req, res, next){
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
}))

app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))
routes(app)
app.use(expressWinston.errorLogger({
   transports: [
     new winston.transports.Console({
       json: true,
       colorize: true
     }),
     new winston.transports.File({
       filename: 'logs/error.log'
     })
   ]
}))

app.use(function( err, req, res, next){
  res.render('error', {
    error: err
  })
})

if(module.parent){
  module.exports = app
} else{
  app.listen(config.port, function(){
    console.log(`${pkg.name} listening on port ${config.port}`)
  })
}
