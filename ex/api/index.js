/**
 * Created by 93659 on 2018/11/19.
 */
const prefix = 'https://api.weixin.qq.com/cgi-bin/';

module.exports = {
  accessToken: `${prefix}token?grant_type=client_credential&`,
  menu: {
    create: `${prefix}menu/create?`,
    delete: `${prefix}menu/delete?`
  },
  tag: {
    create: `${prefix}tags/create?`,
    getUsers: `${prefix}user/tag/get?`,
    batch: `${prefix}tags/members/batchtagging?`
  },
  message: {
    sendall: `${prefix}message/mass/sendall?`
  },
  upload: {
    uploadNews: `${prefix}material/add_news?`,
    uploadimg: `${prefix}media/uploadimg?`,
    uploadOthers: `${prefix}material/add_material?`
  }
}