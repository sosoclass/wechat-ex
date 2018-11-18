/**
 * Created by 93659 on 2018/11/17.
 */
const sha1 = require('sha1');

const {getUserDataAsync, parseXMLDataAsync, formatMessage} = require('../utils/tools');
const reply = require('./reply');
const template = require('./template');
const {token} = require('../config');

module.exports = () => {
  return async (req, res, next) => {
    const {signature, echostr, timestamp, nonce} = req.query;
    const str = sha1([timestamp, nonce, token].sort().join(''));

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
      const xmlData = await getUserDataAsync(req);
      // console.log(xmlData);

      const jsData = await parseXMLDataAsync(xmlData);

      const message = formatMessage(jsData);
      const options = reply(message);
      const replyMessage = template(options);
      console.log(replyMessage);
      res.send(replyMessage);

    } else {
      res.end('error')
    }
  }
}