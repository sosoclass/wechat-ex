/**
 * Created by 93659 on 2018/11/17.
 */
const rp = require('request-promise-native');
const {writeFile, readFile, createReadStream} = require('fs');
const {appID, appsecret} = require('../config');
const api = require('../api');
const {writeFileAsync, readFileAsync} = require('../utils/tools');

class Wechat {

  //获取AccessToken的方法
  async getAccessToken() {
    const url = `${api.accessToken}appid=${appID}&secret=${appsecret}`;
    const result = await rp({method: 'GET', url, json: true});
    result.expires_in = Date.now() + 7200000 - 300000;
    return result;
  }

  //保存AccessToken的方法
  saveAccessToken(filePath, accessToken) {
    return writeFileAsync(filePath, accessToken);
  }

  //读取AccessToken的方法
  readAccessToken(filePath) {
    return readFileAsync(filePath);
  }

  //判断AccessToken是否过期

  isValidAccessToken({expires_in}) {
    return Date.now() < expires_in;
  }

  fetchAccessToken() {
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


  //获取ticket

  async getTicket() {
    const {access_token} = await this.fetchAccessToken();
    const url = `${api.ticket}access_token${access_token}`;
    const result = rp({method: 'GET', url, json: true});
    return {
      ticket: result.ticket,
      ticket_expires_in: Date.now() + 7200000 - 300000
    };
  }

  //保存Ticket的方法
  saveTicket(filePath, ticket) {
    return writeFileAsync(filePath, ticket);
  }

  //读取Ticket的方法
  readTicket(filePath) {
    return readFileAsync(filePath);
  }

  //判断Ticket是否过期

  isValidTicket({expires_in}) {
    return Date.now() < ticket_expires_in;
  }

  fetchTicket() {
    if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
      console.log('进来了~');
      return Promise.resolve({ticket: this.ticket, ticket_expires_in: this.ticket_expires_in});
    }
    return this.readTicket('./ticket.txt')
      .then(async res => {
        if (this.isValidTicket(res)) {
          return res;
        } else {
          const ticket = await this.getTicket();
          await this.saveTicket('./ticket.txt', ticket);
          return ticket;
        }
      })
      .catch(async err => {
        const ticket = await this.getTicket();
        await this.saveTicket('./ticket.txt', ticket);
        return ticket;
      })
      .then(res => {
        this.ticket = res.ticket;
        this.expires_in = res.expires_in;

        return Promise.resolve(res);
      })

  }


  async createMenu(menu) {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.menu.create}access_token=${access_token}`;
      const result = await rp({method: 'POST', url, json: true, body: menu});
      return result;
    } catch (e) {
      return 'createMenu方法出了问题：' + e;
    }
  }

  async deleteMenu() {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.menu.delete}access_token=${access_token}`;
      const result = await rp({method: 'GET', url, json: true});

      return result;
    } catch (e) {
      return 'deleteMenu方法出了问题：' + e;
    }
  }

  //创建标签
  async createTag(name) {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.tag.create}access_token=${access_token}`;
      const result = await rp({method: 'POST', url, json: true, body: {tag: {name}}});
      return result;
    } catch (e) {
      return 'createTag方法出了问题' + e;
    }
  }

  async getTagUsers(tagid, next_openid = '') {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.tag.getUsers}access_token=${access_token}`;
      return await rp({method: 'POST', url, json: true, body: {tagid, next_openid}});

    } catch (e) {
      return 'getTagUsers方法出了问题' + e;
    }
  }

  async batchUsersTag(openid_list, tagid) {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.tag.batch}access_token=${access_token}`;
      return await rp({method: 'POST', url, json: true, body: {tagid, openid_list}});
    } catch (e) {
      return 'batchUsersTag方法出了问题' + e;
    }
  }

  async sendAllByTag(options) {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.message.sendall}access_token=${access_token}`;
      return await rp({method: 'POST', url, json: true, body: options});
    } catch (e) {
      return 'sendAllByTag方法出了问题' + e
    }
  }

  async uploadMaterial(type, material, body) {
    try {
      const {access_token} = await this.fetchAccessToken();
      let url = '';
      let options = {method: 'POST', json: true};

      if (type === 'news') {
        url = `${api.upload.uploadNews}access_token=${access_token}`;
        options.body = material;
      } else if (type === 'pic') {
        url = `${api.upload.uploadimg}access_token=${access_token}`;
        options.formData = {
          media: createReadStream(material)
        }
      } else {
        url = `${api.upload.uploadOthers}access_token=${access_token}&type=${type}`;
        options.formData = {
          media: createReadStream(material)
        };
        if (type === 'video') {
          options.body = body;
        }
      }
      options.url = url;
      return await rp(options);

    } catch (e) {
      return 'uploadMaterial方法出了问题' + e;
    }
  }
}


(async () => {
  const w = new Wechat();
  // let result1 = await w.createTag('NO.1');
  // console.log(result1);
  // let result2 = await w.batchUsersTag([
  //   'oC3d91f5XuDzNgmijmKAC6Y5HGY8'
  // ], result1.tag.id);
  // console.log(result2);
  // let result3 = await w.getTagUsers(result1.tag.id);
  // console.log(result3);

})();
module.exports = Wechat;