var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Goods = require('../models/goods');
// 连接数据可
mongoose.connect('mongodb://localhost:27017/shop');

// 连接成功
mongoose.connection.on('connected',function(){
    console.log('Mongodb connected success');
});

// 连接发生错误
mongoose.connection.on('error',function(){
    console.log('Mongodb connected fail');
})

// 关闭连接数据数据库
mongoose.connection.on('disconnected',function(){
    console.log('Mongodb connected disconnected');
})

router.get('/',function(req,res,next){
    res.json({ data:'您现在访问的是goods api' })
})

router.get('/list',function(req,res,next){
    Goods.find({},function(err,doc){
        if(err){
            res.json({ status:'1', msg:err.message})
        }else{
            res.json({ status:'0', msg:'', result:doc })
        }
    })
})

module.exports = router;