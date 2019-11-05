var express = require("express");
var User = require("../modules/user");

var router = express.Router();

router.get('/',function(req,res){

    var admin = new User({
        name:'Owen',
        password:'980828',
        admin:true
    })

    admin.save(function(err){
        if(err){
            res.json({
                success:false,
                message:'Failure of creating administrator'
            });
        }
        res.json({success:true,message:"Success of creating administrator"})

    })         //Judge if succeed to connect database
})

module.exports = router;