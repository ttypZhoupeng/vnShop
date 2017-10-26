var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello zhoupeng');
});

// 登录接口
router.post('/login',function(req,res,next){
  let param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  console.log(param);
  User.findOne(param,function(err,doc){
    console.log(err);
    if(err){
      res.json({'status':'1',msg:'用户名和密码错误'})
    }else{
      console.log('doc',doc);
      if(!doc){
        res.json({'status':'1',msg:'用户名和密码错误'})
      }
      res.cookie('userId',doc.userId,{
        psth:'/',
        maxAge:1000*60*60
      })
      res.cookie('username',doc.userName,{
        path:'/',
        maxAge:1000*60*60
      })

      if(doc){
        res.json({
          status:0,
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
})


// 刷新页面检查是否登录
router.post('/checkLogin',function(req,res,next){
     // 使用cookies读取 cookies
     if(req.cookies.userId){
       res.json({
         status:'0',
         result:req.cookies.username
       })
     }else{
       res.json({
         status:1,
         msg:'未登录',
         result:''
       })
     }
})

router.post('/logout',function(req,res,next){
  // 清楚cookie
  // 把userId的值变为空
  res.cookie("userId","",{
    path:'/',
    maxAge:-1    //把时间变为负数
  })

  res.json({
    status: 0,
    msg:'',
    result:'退出成功'
  })
  
})

// 购物车列表
router.post("/cartList", function(req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, function(err, doc) {
      if (err) { res.json({ status: '1', msg: err.message, result: '' }) } else {
          res.json({
              status: 0,
              msg: '',
              result: doc.cartList
          })
      }
  })
})


module.exports = router;
