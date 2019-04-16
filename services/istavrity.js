
var express= require('express')
var router= express.Router();

router.get("/", function(req,res){
    if(req.session.username){
        var errdesc= req.query.err;
        var query3=`SELECT MEMBER_NAME,RITWIKNAME FROM  DEVOTEEMASTER WHERE FC_CODE= ${req.session.FC_CODE}`;
        console.log(query3);
        connection.query(query3, function (err3, result3, fields2) {
            if(err3){
                console.log(err3);
                res.render('istavritypage', { error: err3 });
            }
            else{
              //console.log(result3);
            //  res.send(result3);
              res.render('istavritypage', { username: req.session.username ,  fcnum:req.session.FC_CODE ,rows:result3,errorMsg: errdesc });
            }});
 //res.render('istavritypage', { username: req.session.username ,  fcnum:req.session.FC_CODE  });
    }
    else{
        res.redirect('/');
    }
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

router.post("/",async function(req,res){
    var noerrorfound=true;
    console.log("Request Body:"+req.body);
    req.session.istavrityobject= req.body;
    console.log("--------------------------");
    let response;
    var month= req.body.istavrityDate.split(" ")[0];
    var year = req.body.istavrityDate.split(" ")[1];
    var query= `SELECT COUNT(*) COUNT FROM ISM
    WHERE FCCODE=${req.session.FC_CODE} 
    AND MONTH= '${month}'
    AND YEAR = ${year} ;`
    try{
    let response= await connection.query(query);
    let count=response[0][0].COUNT;
    if(count>0){
        res.redirect(`/api/istavrity/?err='You have already submitted Istavrity for this period'`);
    }
    console.log("value count:"+response[0][0].COUNT);
    }
    catch(e){
      console.log(e);
    }
    
    res.redirect('/api/payment');

})




module.exports= router;