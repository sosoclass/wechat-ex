/**
 * Created by 93659 on 2018/11/16.
 */
const express = require('express');
const sha1 = require('sha1');

const {getUserDataAsyne, parseXMLDataAsync, formatMessage} = require('./utils/tools');


const app = express();

const config = {
  appID: 'wx33ce7475d420b603',
  appsecret: '40c00b568599e51f929501edf357773e',
  token: 'sun0810_666'
}

app.use(async(req, res, next) => {
  // console.log(req.query);

  // { signature: '1f09d135ab70c9836c29bdbd679fe5fdeb48636f',
  //   echostr: '247698109963960318',
  //   timestamp: '1542352276',
  //   nonce: '799840738' }


  const {signature, echostr, timestamp, nonce} = req.query;
  const {token} = config;


  const arr = [timestamp, nonce, token].sort();
  // console.log(arr);
  const str = sha1(arr.join(''));
  // console.log(str);


  if (req.method === 'GET') {
    if (signature === str) {
      res.end(echostr);
    } else {
      res.end('error');
    }
  } else if (req.method === 'POST') {
    if (signature !== str) {
      res.end('error');
      return;
    }
    const xmlData = await getUserDataAsyne(req);
    // console.log(xmlData);

    const  jsData = await parseXMLDataAsync(xmlData);
    // console.log(jsData);


    const message = formatMessage(jsData);
    // console.log(message);

    let content = '你说嘛呢';
    if(message.Content === '1'){
      content = '啦啦啦';
    }else if(message.Content ==='2'){
      content = '略略略';
    }else if(message.Content ==='3'){
      content = '哈哈哈';
    }
    let replyMessage = `<xml>
            <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
            <CreateTime>${Date.now()}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${content}]]></Content>
          </xml>`;

      res.send(replyMessage);

  }else {
    res.end('error')
  }
});


app.listen(3000, err => {
  if (!err) console.log('服务器连接成功');
  else console.log(err);


})