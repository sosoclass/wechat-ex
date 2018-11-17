/**
 * Created by 93659 on 2018/11/17.
 */
const rp = require('request-promise-native');
const {writeFile,readFile} = require('fs');
const {appID,appsecret} = require('../config');

class Wechat {
  
  //获取AccessToken的方法
  async getAccessToken() {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    const result = await rp({method:'GET',url,json:true});
    result.expires_in = Date.now() +7200000-300000;
    return result;
  }
  //保存AccessToken的方法
  saveAccessToken(filePath,accessToken){
    return new Promise((resolve,reject)=>{
      writeFile(filePath,JSON.stringify(accessToken),err=>{
        if(!err){
          resolve();
        }else {
          reject('saveAccessToken方法除了问题：'+err);
        }
      })
    })
  }
  //读取AccessToken的方法
  readAccessToken(filePath){
    return new Promise((resolve,reject)=>{
      readFile(filePath,(err,data)=>{
        if(!err){
          resolve(JSON.parse(data.toString()));
          
        }else {
          reject('readAccessToken：'+err);
        }
      })
    })
  }

  //判断AccessToken是否过期

  isValidAccessToken({expirse_in}){
    return Date.now()<expirse_in;
  }
}


(async()=>{
  const w = new Wechat();
  w.readAccessToken('./acessToken.txt')
    .then(async res=>{
      if(w.isValidAccessToken(res)){
        console.log(res);
        console.log('没有过期');
      }else {
        const accessToken =await w.getAccessToken();
        await w.saveAccessToken('./accessToken.txt',accessToken);

      }
    })
    .catch(async err=>{
      const accessToken = await w.getAccessToken();
      await w.saveAccessToken('./accessToken.txt',accessToken);
    })
})();
