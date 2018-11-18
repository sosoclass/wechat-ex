/**
 * Created by 93659 on 2018/11/17.
 */
const rp = require('request-promise-native');
const {writeFile, readFile} = require('fs');
const {appID, appsecret} = require('../config');

class Wechat {

  //获取AccessToken的方法
  async getAccessToken() {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    const result = await rp({method: 'GET', url, json: true});
    result.expires_in = Date.now() + 7200000 - 300000;
    return result;
  }

  //保存AccessToken的方法
  saveAccessToken(filePath, accessToken) {
    return new Promise((resolve, reject) => {
      writeFile(filePath, JSON.stringify(accessToken), err => {
        if (!err) {
          resolve();
        } else {
          reject('saveAccessToken方法除了问题：' + err);
        }
      })
    })
  }

  //读取AccessToken的方法
  readAccessToken(filePath) {
    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        if (!err) {
          resolve(JSON.parse(data.toString()));

        } else {
          reject('readAccessToken：' + err);
        }
      })
    })
  }

  //判断AccessToken是否过期

  isValidAccessToken({expires_in}) {
    return Date.now() < expires_in;
  }

  fetchAccessToken(){
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      console.log('进来了~');
      return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in});
    }
    return this.readAccessToken('./accessToken.txt')
      .then(async res => {
        if (this.isValidAccessToken(res)) {
          return res;
        } else {
          const accessToken = await this.getAccessToken();
          await this.saveAccessToken('./accessToken.txt', accessToken);
          return accessToken;
        }
      })
      .catch(async err => {
        const accessToken = await this.getAccessToken();
        await this.saveAccessToken('./accessToken.txt', accessToken);
        return accessToken;
      })
      .then(res => {
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;

        return Promise.resolve(res);
      })

  }
  async createMenu (menu) {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
      const result = await rp({method: 'POST', url, json: true, body: menu});
      return result;
    } catch (e) {
      return 'createMenu方法出了问题：' + e;
    }
  }
  async deleteMenu () {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`;
      const result = await rp({method: 'GET', url, json: true});

      return result;
    } catch (e) {
      return 'deleteMenu方法出了问题：' + e;
    }
  }

}


(async () => {
  const w = new Wechat();

  let result = await w.deleteMenu();
  console.log(result);
  result = await w.createMenu(require('./menu'));
  console.log(result);

})()
