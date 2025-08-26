'use strict'

const { Controller } = require('egg')

class BillController extends Controller {
  async add() {
    const { ctx } = this
    const {
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark = '',
    } = ctx.request.body

    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.response.status = 400
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      }
      return
    }

    try {
      let user_id
      const decoded = ctx.state.user
      if (!decoded) return
      user_id = decoded.id
      // user_id 默认添加到每个账单项，作为后续获取指定用户账单的标示。
      // 可以理解为，我登录 A 账户，那么所做的操作都得加上 A 账户的 id，后续获取的时候，就过滤出 A 账户 id 的账单信息。
      await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      })
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null,
      }
    } catch (error) {
      console.error('🚀 ~ BillController ~ add ~ error:', error)
      ctx.response.status = 500
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      }
    }
  }
}

module.exports = BillController
