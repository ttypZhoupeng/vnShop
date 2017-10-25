var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello zhoupeng');
});

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

module.exports = router;
