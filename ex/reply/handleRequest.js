/**
 * Created by 93659 on 2018/11/17.
 */
const sha1 = require('sha1');

const {getUserDataAsyne, parseXMLDataAsync, formatMessage} = require('../utils/tools');
const reply = require('../reply/reply');
const template = require('../reply/template');
const {token} = require('../config');

module.exports = () => {
  return async (req, res, next) => {
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

      const jsData = await parseXMLDataAsync(xmlData);

      const message = formatMessage(jsData);


      const options = reply(message);
      const replyMessage = template(options);

      res.send(replyMessage);


    } else {
      res.end('error')
    }
  }
}