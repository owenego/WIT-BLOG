var express = require("express");
var Blog = require("../modules/blog");

var router = express.Router();



router.get('/',function(req,res){

    var {category} = req.query;
    var Objective = {};
    if(category){
        var reg = new RegExp('^'+category+'$');
        Objective = {category:reg}
    }
    Blog.find(Objective,function(err,blogs){
        res.json({
            success:true,
            data:blogs
        })
    })
})

router.post('/',function(req,res){
    var {title,body,author,tags,hidden,category} = req.body;
    console.log(title);
    if(title.length<3){
        res.json({
            success:false,
            message:"The length of title should more than 3"
        })
        return
    }

    var tagsArray = tags.split(",");
    var tags1 = [];
    tagsArray.forEach(function(v){
        tags1.push({title:v});
    })

    var blog = new Blog({
        title,
        body,
        author,
        tags:tags1,
        hidden,
        category
    });

    blog.save(function(err){
        if(err){
            res.json({success:false,message:"Fail to publish"})
        };
        res.json({success:true,message:"Succeed to publish"})
    })
})

router.put('/',function(req,res){
    var {title,newTitle,body,newBody,author,newAuthor} = req.body;
    if(newTitle.length<3){
        res.json({
            success:false,
            message:"The length of title should more than 3"
        })
    }
    Blog.update({
        title:title,
        body:body,
        author:author
    },{
        title:newTitle,
        body:newBody,
        author:newAuthor
    },function(err,blog){
        if(err){
            res.json({
                success:false,
                message:"Fail to update"
            })
        }
    });
    res.json({
        success:true,
        message:"Succeed to update"
    })

})


router.delete('/',function(req,res){
    var {title} = req.body;

    Blog.remove({
        title:title,
    },function(err){
        if(err){
            res.json({
                success:false,messge:"Fail to delete"
            })
        }
    })
    res.json({success:true,message:"Succeed to delete"})
})

module.exports = router;