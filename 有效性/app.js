/**
 * Created by 93659 on 2018/11/16.
 */
const express = require('express');
const sha1 = require('sha1');
const app = express();

const config = {
  appID:'wx33ce7475d420b603',
  appsecret:'40c00b568599e51f929501edf357773e',
  token:'sun0810_666'
}

app.use((req,res,next)=>{
  console.log(req.query);

  // { signature: '1f09d135ab70c9836c29bdbd679fe5fdeb48636f',
  //   echostr: '247698109963960318',
  //   timestamp: '1542352276',
  //   nonce: '799840738' }


  const {signature,echostr,timestamp,nonce}=req.query;
  const {token} = config;


  const arr = [timestamp,nonce,token].sort();
  console.log(arr);
  const str = sha1(arr.join(''));
  console.log(str);

  if(signature === str){
    res.end(echostr);
  }else {
    res.end('error')
  }
})



app.listen(3000,err=>{
  if(!err)console.log('服务器连接成功');
  else console.log(err);


})