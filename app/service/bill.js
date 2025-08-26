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

  // 账单详情接口
  async detail() {
    const { ctx } = this
    const { id = '' } = ctx.query

    const decode = ctx.state.user.id
    if (!decode) return
    let user_id = decode.id
    if (!id) {
      ctx.response.status = 400
      ctx.body = {
        code: 400,
        msg: '账单id不能为空',
        data: null,
      }
      return
    }
    try {
      const detail = await ctx.service.bill.detail(id, user_id)
      ctx.response.state = 200
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail,
      }
    } catch (error) {
      console.error('🚀 ~ BillService ~ detail ~ error:', error)
      ctx.response.state = 500
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      }
    }
  }
}
module.exports = BillService
