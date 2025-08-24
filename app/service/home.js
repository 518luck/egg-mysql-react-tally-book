'use strict'
const { Service } = require('egg')

class HomeService extends Service {
  async user() {
    const { ctx, app } = this
    const QUERY_STR = 'id,name'
    let sql = `select ${QUERY_STR} from list` //获取id的sql语句
    try {
      const result = await app.mysql.query(sql) //执行sql语句
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
  async addUser(name) {
    const { ctx, app } = this
    try {
      const result = await app.mysql.insert('list', { name }) // 给 list 表，新增一条数据
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
  async editUser(id, name) {
    const { ctx, app } = this
    try {
      let result = await app.mysql.update(
        'list',
        { name },
        {
          where: {
            id,
          },
        }
      )
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
  async deleteUser(id) {
    const { ctx, app } = this
    try {
      let result = await app.mysql.delete('list', {
        id,
      })
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

module.exports = HomeService
