const express = require("express");
const router=  express.Router();

router.get("/api/users/:id", function (req, res) {

    let user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) {
        res.status(400).send("The course is not available");
    }
    res.send(user);
});


router.get("/api/users/", function (req, res) {

    res.send(users);
    
});
module.exports= router;