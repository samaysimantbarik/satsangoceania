
const express= require('express');
const router= express.Router();



router.get("/", function (req, res) {
    res.render('login');


  
})


router.post("/api/signin/",function(req,res){
     console.log("Inside signin");
    var username= req.body.username;
    
    res.render('userspage' ,{username:username});
})

module.exports = router;