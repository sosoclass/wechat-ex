/**
 * Created by 93659 on 2018/11/16.
 */
const {parseString} = require('xml2js');
const {writeFile, readFile} = require('fs');

module.exports = {
  getUserDataAsync(req){
    return new Promise(resolve => {
      let result = '';
      req
        .on('data', data => {
          console.log(data.toString());
          result += data.toString();
        })
        .on('end', () => {
          console.log('用户数据接受完毕');
          resolve(result);
        })
    })
  },
  parseXMLDataAsync(xmlData){
    return new Promise((resolve, reject) => {
      parseString(xmlData, {trim: true}, (err, data) => {
        if (!err) {
          resolve(data);

        } else {
          reject('parseXMLDataAsync方法出了问题：' + err);
        }
      })
    })
  },
  formatMessage({xml}){
    let result = {};
    for (let key in xml) {
      let value = xml[key];
      result[key] = value[0];
    }
    return result;
  },
  writeFileAsync(filePath, data){
    return new Promise((resolve, reject) => {
      writeFile(filePath, JSON.stringify(data), err => {
        if (!err) {
          resolve()
        } else {
          reject('writeFile方法出了问题' + err)
        }
      })
    })
  },
  readFileAsync(filePath){
    return new Promise((resolve, reject) => {
      readFileAsync(filePath, (err, data) => {
        if (!err) {
          resolve(JSON.parse(data.toString()));
        } else {
          reject('readFile方法出了问题' + err)
        }
      })
    })
  }
}
