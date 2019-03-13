const express = require("express");
var path = require('path');



const app = express();
var cons = require('consolidate');
const login = require("./services/home");



// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "assets")));
//app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded())
app.use("/",login);

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



app.get("/api/test/", function(req,res){

    res.render('index2');
})

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