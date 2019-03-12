const express = require("express");
var path = require('path');
var session = require('express-session');
const mongoose = require('mongoose');


const app = express();
var cons = require('consolidate');

app.use(session({secret: 'ssshhhhh'}));

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, "assets")));
//app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded())

//app.use('/stylesheets', express.static(__dirname , "/assets"));
console.log(__dirname);

const users = [
    {
        "id": 1,
        "name": "samay"
    },
    {
        "id": 2,
        "name": "samay"
    },
    {
        "id": 3,
        "name": "robert"
    }]

app.get("/", function (req, res) {
    res.sendfile("views/login.html");
})

app.post("/api/signin/",function(req,res){

    sess=req.session;
    console.log("Session is : "+sess.username);
    var username= req.body.username;
    
    res.render(__dirname+"/views/userspage.html" ,{"name":username});
})

app.get("/api/users/:id", function (req, res) {

    let user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) {
        res.status(400).send("The course is not available");
    }
    res.send(user);
});

async function createDevotee(req){
    const devoteemasterschema = new mongoose.Schema({
      //  __id: mongoose.Schema.Types.ObjectId,
        Name : String,
        BirthCountry : String,
        ResidencyCountry: String,
        DOB: Date,
        email: String,
        Password: String,
        RegistrationDate: {type: Date, default: Date.now}
 });

 const Devotee= mongoose.model('devoteemaster',devoteemasterschema );
 const devotee = new Devotee({
     Name: req.body.name,
     BirthCountry:req.body.birthcountry,
     ResidencyCountry:req.body.residencycountry,
     DOB:req.body.dob,
     email:req.body.email,
     Password:req.body.password
 });



 const result = await devotee.save();
 //console.log(result;
}


async function getCurrentFamilyCodeValue(){
    const fcschema = new mongoose.Schema({
          __id: mongoose.Schema.Types.ObjectId,
          currval: Number
   });
    const fcnum= mongoose.model("familycodenumber",fcschema);
    var values= fcnum.find({currval:100});
    console.log(values);
    //console.log(values);
   }

app.post("/api/registeruser/", function(req, res){
    console.log(req.body.birthcountry);
    const uri = "mongodb+srv://satsang:Samta@2505@cluster0-bdugo.mongodb.net/satsang?retryWrites=true";
    mongoose.connect(uri, { useNewUrlParser: true }).then(()=> console.log("Connected")).catch(err => console.error("Could not connect"));
    getCurrentFamilyCodeValue();
    //createDevotee(req);
    res.sendFile(__dirname+"/views/register.html");
});

app.get("/api/users/", function (req, res) {

    //let user=retieveUser(req);

    //console.log(user);

    // console.log(req.query.name);
    // console.log("A" === "A");

    // console.log(users.findAll(c => c.name ==  req.query.name));
    //    let user=  users.find(c => c.name ==  req.query.name);
    //   if(!user){
    //       res.status(400).send("The user is not available");
    //   }
    res.send(users);
});

//   function retieveUser(req){
//     var resultArray=[];

//     users.forEach(element => {
//         if(element.name===req.query.name){
//           resultArray.push(element);
//         }})
//         return resultArray;
//     };

app.listen(80, () => console.log("Listening"));