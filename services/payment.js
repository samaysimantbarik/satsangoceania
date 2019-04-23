var keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const connection = require('../dbconnection/connection');
const express = require("express");
var router = express.Router();

var Pin = require('pinjs');
var request = require('request');
var config= require('config');




router.get("/", (req, res) => {
  console.log(req);
 // keyPublishable = "pk_bHxGiU8kge6A6CdMUkJ_0A";
 keyPublishable= config.get("payment.keypublishable");
  console.log(keyPublishable);
  res.render("paymentpage.pug", { keyPublishable })
 

});



router.post("/charge", (req, res) => {


  //var key = "XdICJCocfCKbmPnpvVm_2w";
  key= config.get("payment.secretkey");
  var cardToken = req.body.card_token;

  var token = Buffer.from(key).toString('base64');

  var formdata = {
    'amount': req.session.istavrityobject.finaltotal * 100
    , "currency": "AUD"
    , "description": `Istavrity for Family Code: ${req.session.FC_CODE} and Period: ${req.session.istavrityobject.istavrityDate}`
    , "email": req.session.email
    , "card_token": `${cardToken}`
  }
  var clientServerOptions = {
    uri: config.get("payment.url"),
    form: formdata,
    method: 'POST',
    headers: {
      'Authorization': `Basic ${token}`
    }
  }
  request(clientServerOptions, function (error, response) {
    if (response.statusCode === 201) {
      //res.send("Success")
      processIstavrity(req,res);
    }
    else {
    
      var errorMsg = JSON.parse(response.body).error_description;
      console.log(errorMsg);
      res.render("paymentpage.pug", { keyPublishable: keyPublishable, errorMsg: errorMsg })
    }
  })




});

async function processIstavrity(req,res) {
  var noerrorfound=true;
  var requestbody = req.session.istavrityobject;
  var month = requestbody.istavrityDate.split(" ")[0];
  var year = requestbody.istavrityDate.split(" ")[1];

  var num_records = requestbody.swastyani.length;
  console.log("Month/year/rec:" + month + "-" + year + "-" + num_records);
  console.log("------------------------------------");
  console.log("Request body in payment:"+JSON.stringify(requestbody));
  for (record = 0; record < num_records; record++) {

    var membername = requestbody.membername[record];
    console.log("Proceesing for :" + membername);
    var ritwikname = requestbody.ritwikname[record];
    var swastayani = requestbody.swastyani[record];
    var istavrity = requestbody.istavrity[record];
    var pronami = requestbody.pronami[record];
    var miscellenous = requestbody.misc[record];
    var miscellenousdesc = requestbody.miscdesc[record];
    var total = parseFloat(swastayani) + parseFloat(istavrity) + parseFloat(pronami) + parseFloat(miscellenous);
    console.log("Totals:" + total);
    var query4 = `INSERT INTO  ISD VALUES (
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
    var query5 = `INSERT INTO ISM VALUES(${req.session.FC_CODE}, 
      "${month}", 
      "${year}" , ${parseFloat(total)}) ON DUPLICATE KEY UPDATE    
          AMOUNT=AMOUNT+${parseFloat(total)};`

    console.log(query4);
    console.log("bfr-Boolean(noerrorfound):" + Boolean(noerrorfound));
    try {
      let response = await connection.query(query4);
      console.log(query5);
      try {
        let response2 = await connection.query(query5);
        console.log("query 5 executed");
      }
      catch (e2) {
        console.log("exception:" + e2)
        noerrorfound = false;
        record = num_records;
        res.render('istavritypage', { errorMsg: e2.sqlMessage });
      }
      // res.send("Success");
    }
    catch (e) {
      console.log("-----------exception--------------")
      noerrorfound = false;
      var errorMessage;
      console.log(e);
      if (e.message.includes("Duplicate")) {
        errorMessage = "Istavrity Already submitted for this month-year. Please contact Admin";
      }
      else {
        errorMessage = e.message;
      }
      record = num_records;
      res.render('istavritypage', { errorMsg: errorMessage });

    }

  }//for loop end
  console.log("Boolean(noerrorfound):" + Boolean(noerrorfound));

  if (Boolean(noerrorfound) == true) {
   // res.render('istavrityconfirmation');
    res.redirect(`/api/argyhapraswati?date=${requestbody.istavrityDate}`)
  }

}

router.get("/testconf", (req,res)=>{
  res.redirect(`/api/argyhapraswati?date=${requestbody.istavrityDate}`)
 //- res.render('istavrityconfirmation');
})

module.exports = router;