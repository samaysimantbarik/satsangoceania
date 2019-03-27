
var express= require('express')
var router= express.Router();

router.get("/", function(req,res){
    if(req.session.username){
    res.render('istavritypage', { username: req.session.username ,  fcnum:req.session.FC_CODE  });
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
    
    res.redirect('/api/payment');
/*
  if(req.session.username){
   
            var month= req.body.istavrityDate.split(" ")[0];
            var year = req.body.istavrityDate.split(" ")[1];

            var num_records= req.body.swastyani.length;
            console.log("Month/year/rec:"+month+"-"+ year+"-"+ num_records);
            console.log("------------------------------------");

      for(record=0; record<num_records; record++){

        var membername=req.body.membername[record];
            console.log("Proceesing for :"+membername);
            var ritwikname= req.body.ritwikname[record];
            var swastayani= req.body.swastyani[record];
            var istavrity= req.body.istavrity[record];
            var pronami= req.body.pronami[record];
            var miscellenous= req.body.misc[record];
            var miscellenousdesc= req.body.miscdesc[record];
            var total=parseFloat(swastayani)+parseFloat(istavrity)+parseFloat(pronami)+parseFloat(miscellenous);
            console.log("Totals:"+total);
        var query4=`INSERT INTO  ISD VALUES (
                        ${req.session.FC_CODE}, 
                        "${month}", 
                        "${year}",
                        "${membername}",
                        "${ritwikname}", 
                        ${swastayani}, 
                        ${istavrity},
                        ${pronami}, 
                        ${miscellenous}, 
                        "${miscellenousdesc}"
                        )`;
            var query5= `INSERT INTO ISM VALUES(${req.session.FC_CODE}, 
                "${month}", 
                "${year}" , ${parseFloat(total)}) ON DUPLICATE KEY UPDATE    
                    AMOUNT=AMOUNT+${parseFloat(total)};`

        console.log(query4);
        console.log("bfr-Boolean(noerrorfound):"+Boolean(noerrorfound));
        try{
            let response= await connection.query(query4);
            console.log(query5);
            try{
            let response2= await connection.query(query5);
            console.log("query 5 executed");
            }
            catch(e2){
                console.log("exception:"+e2)
                noerrorfound=false;
                record=num_records;
                res.render('istavritypage', { errorMsg: e2.sqlMessage });
            }
           // res.send("Success");
        }
        catch(e){
            console.log("-----------exception--------------")
            noerrorfound=false;
            var errorMessage;
            console.log(e);
            if(e.message.includes("Duplicate")){
                errorMessage="Istavrity Already submitted for this month-year. Please contact Admin";
            }
            else{
                errorMessage= e.message;
            }
            record=num_records;
            res.render('istavritypage', { errorMsg: errorMessage });
            
        }
         
      }//for loop end
      console.log("Boolean(noerrorfound):"+Boolean(noerrorfound));
     
      if(Boolean(noerrorfound)==true){
      res.render('istavrityconfirmation');
                                    }
   

    }
        else{
            res.redirect('/');
        }
    */
})


router.post("/test", async function(req,res){
    var noerrorfound=true;
    console.log("Test Req");
    console.log("Request Body:"+req.body);
    
    console.log("--------------------------");
    let response;
  
   
            var month= req.body.istavrityDate.split(" ")[0];
            var year = req.body.istavrityDate.split(" ")[1];

          
            // res.send("Month/year/rec:"+month+"-"+ year+"-");
    //         console.log("------------------------------------");

     


            var membername=req.body.membername;
            console.log("Proceesing for :"+membername);
            var ritwikname= req.body.ritwikname;
            var swastayani= req.body.swastyani;
            var istavrity= req.body.istavrity;
            var pronami= req.body.pronami;
            var miscellenous= req.body.misc;
            var miscellenousdesc= req.body.miscdesc;
            var total=parseFloat(swastayani)+parseFloat(istavrity)+parseFloat(pronami)+parseFloat(miscellenous);
            console.log("----"+parseFloat(swastayani)+parseFloat(istavrity))
            console.log("Totals:"+total);
            //res.send("Total:"+total);
            var query4=`INSERT INTO  ISD VALUES (
                162, 
                "${month}", 
                "${year}",
                "${membername}",
                "${ritwikname}", 
                ${swastayani}, 
                ${istavrity},
                ${pronami}, 
                ${miscellenous}, 
                "${miscellenousdesc}"
                )`;

             var query5= `INSERT INTO ISM VALUES(162, 
                    "${month}", 
                    "${year}" , ${parseFloat(total)}) ON DUPLICATE KEY UPDATE    
                        AMOUNT=AMOUNT+${parseFloat(total)};`
        
        console.log(query5);

         console.log(query4);
    //     console.log("bfr-Boolean(noerrorfound):"+Boolean(noerrorfound));
        try{
            let response= await connection.query(query4);
            let response2= await connection.query(query5);
           // response.then(function(){
                res.status(200).send("Success");
           // })
            console.log("-----------RESP--------------");
            console.log(response);
            res.status(201).send(response);
            console.log("-----------RESP--------------");
        }
        catch(e){
             console.log("-----------exception--------------")
            // noerrorfound=false;
            // var errorMessage;
            // console.log(e);
            // if(e.sqlMessage.includes("Duplicate")){
            //     errorMessage="Istavrity Already submitted for this month-year. Please contact Admin";
            // }
           
            res.status(422).send(e.message);
        }
         
   
    //   console.log("Boolean(noerrorfound):"+Boolean(noerrorfound));
     
    //   if(Boolean(noerrorfound)==true){
    //   res.send("<h1>Istavrity Submitted Successfully</h1>");
    //                                 }
   

    
})

module.exports= router;