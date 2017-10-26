var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Goods = require('../models/goods');
var User = require('../models/user');
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

// v1:输出所有数据
// router.get('/list',function(req,res,next){
//     Goods.find({},function(err,doc){
//         if(err){
//             res.json({ status:'1', msg:err.message})
//         }else{
//             res.json({ status:'0', msg:'', result:doc })
//         }
//     })
// })

router.get('/list',function(req,res,next){
    // 根据前端穿过来的数值，判断价格区间，然后去数据库里面查询
    let priceLevel = req.param('priceLevel');
    let currentPage = parseInt(req.param('page')) > 0 ? parseInt(req.param('page')) : 1;
    let pageSize = parseInt(req.param('pageSize'))> 0 ? parseInt(req.param('pageSize')) : 1;

    let skip = (currentPage - 1)*pageSize;

    let sort = req.param('sort');
    let priceGt = '',
        letpriceLte = '';
    let param = '';
    if(priceLevel != 'all'){
        // switch(priceLevel){
        //     case'0':
        //         priceGt = 0;
        //         priceLte = 100;
        //         break;
        //     case'1':
        //         priceGt = 100;
        //         priceLte = 500;
        //         break;
        //     case'2':
        //         priceGt = 500;
        //         priceLte = 1000;
        //         break;
        //     case'3':
        //         priceGt = 1000;
        //         priceLte = 2000;
        //         break;
        // }

        let priceItem = [
            [0,100],
            [100,500],
            [500,1000],
            [1000,2000]
        ];
        
        param = {
            salePrice:{
                // $gt: priceGt,
                // $lte: priceLte
                $gt:priceItem[priceLevel][0],
                $lte:priceItem[priceLevel][1]
            }
        }
    }



    let goodsModel = Goods.find(param);
    goodsModel.sort({'salePrice':sort}).skip(skip).limit(pageSize);
    goodsModel.exec({},function(err,doc){
        if(err){
            res.json({ status:'1', msg:err.message})
        }else{
            res.json({ status:'0', msg:'', result:doc })
        }
    })
})

router.post('/addCart',function(req,res,next){
    var productId = req.body.productId;
    console.log(productId);

    var userId = 100000077;

    User.findOne({userId:userId},function(err,userDoc){
        let goodItem = '';
        userDoc.cartList.forEach(function(item){
            if(item.productId == productId){
                goodItem = item;
                item.productNum++
            }
        })

        if(goodItem){
            userDoc.save(function(err2,doc2){
                if(err2){
                    res.json({status:'1',msg:err2.message})
                }else{
                    res.json({status:'0',msg:'',result:'商品数量添加成功'})
                }
            })
        }else{
            Goods.findOne({'productId':productId},function(err,goodsDoc){
                goodsDoc.productNum = 1;

                userDoc.cartList.push(goodsDoc);
                userDoc.save(function(err2,doc2){
                    res.json({
                        status:'0',
                        msg:'',
                        result:'加入购物车成功'
                    })
                })
            })
        }
    })
})

module.exports = router;