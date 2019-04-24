
const express = require('express');
const router = express.Router();
const connection = require('../dbconnection/connection');
const path = require('path');
router.use(express.static(path.join(global.__basedir, 'public')));

const config= require('config');
const emailer=require("../mailer/email");



router.get("/api/test/", function (req, res) {
   
    res.render("istavrityconfirmation");
})


router.get("/", function (req, res) {
     var message=req.query.message;
  
    res.render('login', { message: message });



})


router.post("/api/signin/", function (req, res) {
    console.log("Inside signin");
   
    var username = req.body.username;
    var password = req.body.pwd;
    var queryString = `SELECT FC_CODE,HEADPERSON_NAME FROM FCMASTER where email='${username}' and password ='${password}'`;
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
                console.log("FC_CODE before:"+ req.session.FC_CODE);
                req.session.FC_CODE=result[0].FC_CODE;
                req.session.email=username;
                req.session.username=result[0].HEADPERSON_NAME
                console.log("FC_CODE after:"+ req.session.FC_CODE);
                res.redirect('/api/members');
            
            }
        }




    })

})

router.get("/forgotpassword",function(req,res){
    console.log(req.query);
    var email= req.query.username;
    var fccode= req.query.fccode;
    console.log("email:"+email);
    console.log("fccode:"+fccode)



    if(email.trim() == '' & fccode.trim()==''){
        res.render('login', { error: "Enter atleast one value(email or family code number) to retrieve your password" });
    }
    else{

            if(email.length>0){

                var query= `SELECT FC_CODE, HEADPERSON_NAME, PASSWORD FROM FCMASTER where EMAIL='${email}'`;
                console.log("Query is:"+query)
                connection.query(query, function (err, rows, fields) {
                    var result= rows;
                    if(result.length === 0){
                        res.render('login', { error: "No entries found for the email specified" });
                    }
                    else{
                        var html=`<h2>Please find your account details below:</h2>
                                         <p><h3>Family Code : ${result[0].FC_CODE}</h3></p>
                                         <p><h3>Name : ${result[0].HEADPERSON_NAME}</h3></p>
                                         <p><h3>Password : ${result[0].PASSWORD}</h3></p>`
                        emailer(email,`Satsang Oceania: Password Recovery Request-New`,html, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                       
                            res.redirect(`/?message=Your Password Details has been emailed to your mail id: ${email}`);
                        }
                           })

                      

                          }

        
               
                  });
            }else{
               if(fccode.length>0){
                var query= `SELECT FC_CODE,EMAIL, HEADPERSON_NAME, PASSWORD FROM FCMASTER where FC_CODE='${fccode}'`;

                connection.query(query, function (err, rows, fields) {
                    var result= rows;
                    if(result.length === 0){
                        res.render('login', { error: "No entries found for the Family Code specified. Try using email id recovery option" });
                    }
                    else{
                        email=result[0].EMAIL;
                        html=`<h2>Please find your account details below:</h2>
                                         <p><h3>Family Code : ${result[0].FC_CODE}</h3></p>
                                         <p><h3>Name : ${result[0].HEADPERSON_NAME}</h3></p>
                                         <p><h3>Password : ${result[0].PASSWORD}</h3></p>`
                        emailer(email,`Satsang Oceania: Password Recovery Request-New`,html, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                            //res.render('login', { error: `Your Password Details has been emailed to your mail id: ${result[0].EMAIL}`});
                            res.redirect(`/?message=Your Password Details has been emailed to your mail id: ${email}`);
                        }
                           })

                          }

           
               
                  });
                 }
                }
            }



})





router.post("/api/registeruser/", function (req, res) {
   console.log(req.body);
    
    var name= req.body.name;
    var ritwikname=req.body.ritwikname
   
    var email= req.body.email;
    
    var password= req.body.password;
    var repassword= req.body.repassword;
    if(password !== repassword){
        res.render('login', { error: "Password doesnt match with Confirm Password" });
        return;
    }

    var query= `INSERT INTO FCMASTER (HEADPERSON_NAME, RITWIKNAME, NUM_OF_MEMBERS, EMAIL, PASSWORD) VALUES ('${name}', '${ritwikname}', 1, '${email}', '${password}')`;

   
  // console.log(query);
    connection.query(query, function (err, result, fields) {
        if(err){
            console.log(err);
            console.log(typeof(err.sqlMessage))
            var sqlmessage=err.sqlMessage;
            console.log("sqlmessage:"+sqlmessage)
            console.log("index:"+sqlmessage.indexOf("Duplicate entry"));
            if(err.sqlMessage.indexOf('Duplicate entry')!= -1){
                errmsg=`Email Id: ${email} has already been used. Try a new email id to register` ; 
              }
              else{
                  errmsg=err; 
              }
            res.render('login', { errorRegister: errmsg });
        }
        else{
            //console.log(result);
            var username= name;
            var FC_CODE=result.insertId;
            console.log(username+","+FC_CODE);
            var query2=`INSERT INTO DEVOTEEMASTER  VALUES (${FC_CODE},'${name}','${ritwikname}')`;
            //console.log(query2);
            connection.query(query2, function (err2, result2, fields2) {
                if(err2){
                    console.log(err2);
                   
                    res.render('login', { errorRegister: err2 });
                }
                else{
               //     console.log(result2);
                 //   console.log(username+","+FC_CODE);
                 req.session.FC_CODE=FC_CODE;
                 req.session.username=username;
                 req.session.email=email;
                 console.log("FC_CODE after:"+ req.session.FC_CODE);

                   var html= `<h1>Welcome to Satsang Oceania</h1>
                            <br>
                           <h2>Please find your account details below:</h2>
                            <p><h3>Family Code : ${FC_CODE}</h3></p>
                            <p><h3>Name : ${name}</h3></p>
                            <p><h3>Password : ${password}</h3></p>`
                           
                    emailer(email,'Satsang Oceania: Account Creation',html, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                            })



                 res.redirect('/api/members');
                
                }});
           
        }
    
    });


   
});


router.get("/logout/",function(req,res){
   req.session.destroy();
   res.clearCookie('user_sid');
    res.render('login');

})

module.exports = router;