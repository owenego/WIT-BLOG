var express = require('express');
var Category = require('../modules/category')
var router = express.Router();

// Add Category
router.post('/',function(req,res){
    var title = req.body.title;
    console.log(req);
    var category = new Category({
        title:title
    })
    category.save(function(err){
        if(err){
            res.json({
                success:false,
                message:"Fail to add category"
            })
        }
    })
    res.json({success:true,message:"success to add category"})
})

// View all categories
router.get('/',function(req,res){
    Category.find({},function(err,categories){
        res.json({
            success:true,
            data:categories
        })
    })
})

// Update a category
router.put('/',function(req,res){

    var {title,newtitle} = req.body;
    Category.findOneAndUpdate({title:title},{title:newtitle},function(err,category){
        if(err){
            res.json({
                success:false,message:"Fail to update category"
            })
        }
    })
    res.json({success:true,message:"Success to update category"})
})

// Delete a category
router.delete('/',function(req,res){
    console.log('delete category');


    var {title} = req.body;

    Category.remove({title:title},function(err){
        if(err){
            res.json({
                success:false,message:"Fail to delete category"
            })
        }
    })
    res.json({success:true,message:"Success to delete category"})
})

module.exports = router;