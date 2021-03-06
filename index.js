const express = require("express");
var path = require('path');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
const app = express();
var cons = require('consolidate');
var redis = require('redis');
var client = redis.createClient();

const sls= require('serverless-http');

var store = new RedisStore({host: 'localhost', port: 6379, client: client, ttl: 260});
global.__basedir = __dirname;

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
    store: store
}));

app.use(function(req,res,next){
   console.log("Middleware:"+req.session);

if(req.session) {
    
    app.render('login');
}
else{
    next();
}

})

const login = require("./services/home");
const users = require("./services/users");
const istavrity= require("./services/istavrity");
const payment= require("./services/payment");
const argyapraswasti= require("./services/arghyaprasawasti");





// view engine setup

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/assets/')));

app.use('/css/',express.static(path.join(__dirname, 'public/css')));

app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));
app.use(session({secret: 'ssshhhhh'}));


//app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "assets")));
//app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded())
app.use("/", login);
app.use("/api/members/", users);
app.use("/api/istavrity/", istavrity);
app.use("/api/payment", payment);
app.use("/api/argyhapraswati", argyapraswasti);



//app.use('/stylesheets', express.static(__dirname , "/assets"));
console.log(__dirname);



//module.exports = app;

//module.exports.server= sls(app);
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => console.log("Listening"));