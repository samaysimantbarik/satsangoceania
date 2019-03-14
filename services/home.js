
const express = require('express');
const router = express.Router();
const connection = require('../dbconnection/connection');
const path = require('path');
router.use(express.static(path.join(global.__basedir, 'public')));
var session = require('express-session');


router.get("/", function (req, res) {
    session=req.session;
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

    var name= req.body.name;
    var birthcountry = req.body.birthcountry;
    var residencycountry = req.body.residencycountry;
    var email= req.body.email;
    var dob= req.body.dob;
    var password= req.body.password;

    var query= `INSERT INTO FCMASTER (HEADPERSON_NAME, HEADPERSON_DOB, NUM_OF_MEMBERS, EMAIL, PASSWORD) VALUES ('${name}', '${dob}', 1, '${email}', '${password}')`;

   
  // console.log(query);
    connection.query(query, function (err, result, fields) {
        if(err){
            console.log(err);
            res.render('login', { errorRegister: err });
        }
        else{
            //console.log(result);
            var username= name;
            var FC_CODE=result.insertId;
            console.log(username+","+FC_CODE);
            var query2=`INSERT INTO DEVOTEEMASTER  VALUES (${FC_CODE},'${name}','${dob}', '${birthcountry}', '${residencycountry}','passport', '${email}', '8')`;
            //console.log(query2);
            connection.query(query2, function (err2, result2, fields2) {
                if(err2){
                    console.log(err2);
                    res.render('login', { errorRegister: err2 });
                }
                else{
               //     console.log(result2);
                 //   console.log(username+","+FC_CODE);
                    session.FC_CODE=FC_CODE;
                    res.render('userspage', { username: username ,  fcnum:FC_CODE  });
                }});
           
        }
    });


    //res.sendFile(__dirname + "/views/register.html");
});

module.exports = router;