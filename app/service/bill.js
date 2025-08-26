'use strict'

const { Service } = require('egg')

class BillService extends Service {
  async add(params) {
    const { app } = this
    try {
      const result = await app.mysql.insert('bill', params)
      return result
    } catch (error) {
      console.error('🚀 ~ BillService ~ add ~ error:', error)
      return null
    }
  }

  // 获取账单列表
  async list(id) {
    const { app } = this
    const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark'
    let sql = `select ${QUERY_STR} from bill where user_id = ${id}`
    try {
      const result = await app.mysql.query(sql)
      return result
    } catch (error) {
      console.error('🚀 ~ BillService ~ list ~ error:', error)
      return null
    }
  }

  async detail(id, user_id) {
    const { app } = this
    try {
      const result = await app.mysql.get('bill', { id, user_id })
      return result
    } catch (error) {
      console.error('🚀 ~ BillService ~ detail ~ error:', error)
      return null
    }
  }
}
module.exports = BillService
