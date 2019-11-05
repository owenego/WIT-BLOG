var express = require('express');
var app = express();//定义app
var User = require("../modules/user")

var jwt = require('jsonwebtoken');
var config = require('../../config');
app.set('FirstPassword', config.secret);

var router = express.Router();

router.post('/login',function(req,res){
    User.findOne({
        name:req.body.name
    },function(err,user){   //Login authentication
        if(err){
            res.json({success:false,message:"Authentication failed"});
        };

        if(!user){
            res.json({success:false,message:"Authentication failed for no this user"});
        }else if(user){
            if(user.password != req.body.password){
                res.json({success:false,message:"Authentication failed for wrong password"});
            }else{
                var token = jwt.sign({name:'Owen'},app.get('FirstPassword'));
                res.json({
                    success:true,
                    message:"Authentication succeed",
                    token:token
                })
            }
        }
    })
})

module.exports = router;