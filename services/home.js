
const express = require('express');
const router = express.Router();
const connection = require('../dbconnection/connection');
const path = require('path');
router.use(express.static(path.join(global.__basedir, 'public')));
var nodemailer = require('nodemailer');



router.get("/api/test/", function (req, res) {
   
    res.render("istavrityconfirmation");
})


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
                console.log("FC_CODE before:"+ req.session.FC_CODE);
                req.session.FC_CODE=result[0].FC_CODE;
                req.session.username=username;
                console.log("FC_CODE after:"+ req.session.FC_CODE);
                res.redirect('/api/members');
               // res.render('userspage', { username: username ,  fcnum: result[0].FC_CODE });
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

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'samay.techm@gmail.com',
          pass: 'Samta@2505'
        }
      });

    if(email.trim() == '' & fccode.trim()==''){
        res.render('login', { error: "Enter atleast one value(email or family code number) to retrieve your password" });
    }
    else{

        var mailOptions = {
            from: 'donotreply@gmail.com',
            to: 'samaysimant@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'Account Info',
            html: '<h1>That was easy123!</h1><p><h3>Welcome</h3></p>'
          };
          
        

            if(email.length>0){
              //  res.send("Email is:"+email);
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            }else{
               if(fccode.length>0){
               //   res.send("fccode is:"+fccode);
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                 }
                }
            }

            res.render('login', { error: "Your Password Details have been emailed to your mail id" });
    // console.log(req);
    // var userid=req.query.id;
    // var queryString = `SELECT * FROM FCMASTER where FC_CODE='${userid}' `;
    // console.log(queryString);
    // connection.query(queryString, function (err, rows, fields) {
    //      console.log(rows);
    //      res.send(rows);
    //             })

})





router.post("/api/registeruser/", function (req, res) {
   console.log(req.body);
    
    var name= req.body.name;
    var ritwikname=req.body.ritwikname
   // var birthcountry = req.body.birthcountry;
    //var residencycountry = req.body.residencycountry;
    var email= req.body.email;
    //var dob= req.body.dob;
    var password= req.body.password;
    var repassword= req.body.repassword;
    if(password !== repassword){
        res.render('login', { err: "Password doesnt match with Confirm Password" });
        return;
    }

    var query= `INSERT INTO FCMASTER (HEADPERSON_NAME, RITWIKNAME, NUM_OF_MEMBERS, EMAIL, PASSWORD) VALUES ('${name}', '${ritwikname}', 1, '${email}', '${password}')`;

   
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
                 console.log("FC_CODE after:"+ req.session.FC_CODE);
                 res.redirect('/api/members');
                 //res.redirect('/userspage');
                }});
           
        }
    
    });


    //res.sendFile(__dirname + "/views/register.html");
});


router.get("/logout/",function(req,res){
   req.session.destroy();
   res.clearCookie('user_sid');
    res.render('login');

})

module.exports = router;