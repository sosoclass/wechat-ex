/**
 * Created by 93659 on 2018/11/16.
 */
const express = require('express');
const sha1 = require('sha1');
const handleRequest = require('./reply/handleRequest');
const Wechat = require('./wechat/wechat');
const {url, appID} = require('./config');

const wechat = new Wechat();
const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

app.get('/search', async (req, res) => {
  const {ticket} = await wechat.fetchTicket();
  const noncestr = Math.random().toString().split('.')[1];
  const timestamp = parseInt(Date.now() / 1000);
  const arr = [
    `noncestr=${noncestr}`,
    `jsapi_ticket=${ticket}`,
    `timestamp=${timestamp}`,
    `url=${url}/search`
  ]

  const signature  = sha1(arr.sort().join('&'));
  res.render('search', {
    signature,
    timestamp,
    noncestr,
    appID
  });
});


app.use(handleRequest());


app.listen(3000, err => {
  if (!err) console.log('服务器连接成功');
  else console.log(err);


});