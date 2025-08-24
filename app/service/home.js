'use strict'
const { Service } = require('egg')

class HomeService extends Service {
  async user() {
    const { ctx, app } = this
    const QUERY_STR = 'id,name'
    let sql = `select ${QUERY_STR} from list` //获取id的sql语句
    try {
      const result = await app.mysql.query(sql)
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

module.exports = HomeService
