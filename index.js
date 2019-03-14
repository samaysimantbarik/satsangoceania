const express = require("express");
var path = require('path');
var session = require('express-session');


global.__basedir = __dirname;
const app = express();
var cons = require('consolidate');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret"
   // store: store
}));

const login = require("./services/home");
const users = require("./services/users");



// view engine setup

app.use(express.static(path.join(__dirname, 'public')));

app.use('/css/',express.static(path.join(__dirname, 'public/css')));

app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public'));
app.use('*/images',express.static('public/images'));
app.use(session({secret: 'ssshhhhh'}));


app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "assets")));
//app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded())
app.use("/", login);
app.use("/api/members/", users);



//app.use('/stylesheets', express.static(__dirname , "/assets"));
console.log(__dirname);

app.get("/api/test/", function (req, res) {

    res.render('index2');
})



app.listen(80, () => console.log("Listening"));