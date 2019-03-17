const express = require("express");
const router=  express.Router();
const connection = require('../dbconnection/connection');



router.get("/", function (req, res) {
  console.log("Load Members...");
  console.log("session fc code:"+req.session.FC_CODE);

  if(req.session.username){
   var query3=`SELECT * FROM  DEVOTEEMASTER WHERE FC_CODE= ${req.session.FC_CODE}`;
            console.log(query3);
            connection.query(query3, function (err3, result3, fields2) {
                if(err3){
                    console.log(er32);
                    res.render('login', { errorRegister: err3 });
                }
                else{
                    console.log(result3);
                  res.send(result3);
                }});
    }
    else{
        res.redirect('/');
    }
    
});
 

router.post("/", function (req, res) {
    console.log("Inside add member");
    var name= req.body.name;
    var birthcountry = req.body.birthcountry;
    var residencycountry = req.body.residencycountry;
    var email= req.body.email;
    var dob= req.body.dob;
    var password= req.body.password;
    var username= name;
    var FC_CODE=req.session.FC_CODE;
    //var FC_CODE= 
    if(req.session.username){
    console.log("...FC code.."+FC_CODE);
    var query2=`INSERT INTO DEVOTEEMASTER  VALUES (${FC_CODE},'${name}','${dob}', '${birthcountry}', '${residencycountry}','passport', '${email}', '8')`;
            console.log(query2);
            connection.query(query2, function (err2, result2, fields2) {
                if(err2){
                    console.log(err2);
                    res.render('login', { errorRegister: err2 });
                }
                else{
                    console.log(result2);
                    console.log(username+","+FC_CODE);
                   // req.session.FC_CODE=FC_CODE;
                    res.render('userspage', { username: username ,  fcnum:FC_CODE  });
                }});
            }
            else{
                res.render('login');
            }
    
});
module.exports= router;