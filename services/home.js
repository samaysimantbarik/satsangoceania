
const express = require('express');
const router = express.Router();
const connection = require('../dbconnection/connection');



router.get("/", function (req, res) {
    res.render('login');



})


router.post("/api/signin/", function (req, res) {
    console.log("Inside signin");
    var username = req.body.username;
    var password = req.body.pwd;
    var queryString = `SELECT FC_CODE FROM FCMASTER where email='${username}' and password ='${password}'`;
    console.log(queryString);
    connection.query(queryString, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.render('login', { error: err });
        }
        else {
            console.log("Type of :"+ typeof(rows));
            console.log(rows);
            console.log("length:"+rows.length);
            var result= rows;
           // var result = JSON.parse(rows);
            if (result.length === 0) {
                console.log("Invalid Credentials..")
                res.render('login', { error: "Invalid Credentials!" });
            }
            else if (result.length > 1) {
                console.log("Duplicate..")
                res.render('login', { error: "Duplicate Entries detecetd. Contact Admin" });
            }
            else {
                console.log("User Page displaying..")
                res.render('userspage', { username: username ,  fcnum: result[0].FC_CODE });
            }
        }




    })

})


router.post("/api/registeruser/", function (req, res) {
    console.log(req.body.birthcountry);
    const uri = "mongodb+srv://satsang:Samta@2505@cluster0-bdugo.mongodb.net/satsang?retryWrites=true";
    mongoose.connect(uri, { useNewUrlParser: true }).then(() => console.log("Connected")).catch(err => console.error("Could not connect"));
    getCurrentFamilyCodeValue();
    //createDevotee(req);
    res.sendFile(__dirname + "/views/register.html");
});

module.exports = router;