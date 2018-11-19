/**
 * Created by 93659 on 2018/11/17.
 */

const {url} = require('../config');
module.exports = message => {
  let options = {
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
    createTime: Date.now(),
    msgType: 'text'
  };

  let content = '你说嘛呢';

  if (message.MsgType === 'text') {
    if (message.Content === '1') {
      content = '啦啦啦';
    } else if (message.Content === '2') {
      content = '略略略';
    } else if (message.Content.includes('妈')) {
      content = '哈哈哈';
    } else if (message.Content === '3') {
      options.msgType = 'news';
      options.title = '新浪体育';
      options.description = 'ojbk````';
      options.picUrl = 'http://n.sinaimg.cn/sinanews/20214c6d/20181105/TiYubanner220_90.png';
      options.url = 'http://sports.sina.com.cn/';

    }else if(message.Content === '4'){
      content = `<a href="${url}/search">search页面</a>`
    }
  } else if (message.MsgType === 'voice') {
    content = `语音识别结果为: ${message.Recognition}`;

  } else if (message.MsgType === 'location') {
    content = `纬度：${message.Location_X} 经度：${message.Location_Y} 地图的缩放大小：${message.Scale} 位置详情：${message.Label}`;

  } else if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      content = '欢迎您关注公众号';
      if (message.EventKey) {
        content = '欢迎您关注公众号~, 扫了带参数的二维码';

      }
    } else if (message.Event === 'unsubscribe') {
      console.log('无情取关');
    } else if (message.Event === 'LOCATION') {
      content = `纬度：${message.Latitude} 经度：${message.Longitude}`
    } else if (message.Event === 'CLICK') {
      content = `用户点击了：${message.EventKey}`;
    }
  }
  options.content = content;

  return options;

}
