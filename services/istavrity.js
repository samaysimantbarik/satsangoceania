
var express= require('express')
var router= express.Router();

router.get("/", function(req,res){
    res.render('istavritypage', { username: req.session.username ,  fcnum:req.session.FC_CODE  });
});

const connection = require('../dbconnection/connection');



router.get("/members", function (req, res) {
  console.log("Load Members...");
  console.log("session fc code:"+req.session.FC_CODE);

  if(req.session.username){
   var query3=`SELECT MEMBER_NAME FROM  DEVOTEEMASTER WHERE FC_CODE= ${req.session.FC_CODE}`;
            console.log(query3);
            connection.query(query3, function (err3, result3, fields2) {
                if(err3){
                    console.log(err3);
                    res.render('istavritypage', { error: err3 });
                }
                else{
                  //console.log(result3);
                  res.send(result3);
                }});
    }
    else{
        res.redirect('/');
    }
    
});

router.post("/",function(req,res){

    console.log(req.body);
    //res.send(req.body);
})

module.exports= router;