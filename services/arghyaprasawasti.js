var router= require("express").Router();
const connection = require('../dbconnection/connection');

router.get("/", (req,res)=>{

    var date= req.query.date;
    var month = date.split(" ")[0];
    var year = date.split(" ")[1];
   // req.session.FC_CODE =162;
     var query=`SELECT MEMBERNAME,RITWIK,SWASTANI,ISTAVRITY,PRONAMI,MISC_AMT,MISC_DESC
     from ISD
     where FCCODE=  ${req.session.FC_CODE}
     and MONTH= "${month}"
     and YEAR = "${year}"`
    console.log("query:"+query);
     connection.query(query, function (err3, rows, fields2) {
        if(err3){
            console.log(err3);
            res.render('istavrityconfirmation', { error: err3 });
        }
        else{
            
          console.log(rows);
        //  res.send(result3);
          console.log("Sending...")
          res.render('istavrityconfirmation', {rows: rows});
        }});
   // res.send("Date is:"+date)

  //  res.render('istavrityconfirmation');
})

module.exports=router;