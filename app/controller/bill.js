'use strict'

const { Controller } = require('egg')
const moment = require('moment')

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

  // 账单列表
  async list() {
    const { ctx } = this
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query

    try {
      let user_id
      const decoded = ctx.state.user
      if (!decoded) return
      user_id = decoded.id

      const list = await ctx.service.bill.list(user_id)

      const _list = list.filter((item) => {
        if (type_id != 'all') {
          return (
            moment(Number(item.date) * 1000).format('YYYY-MM') == date &&
            type_id == item.type_id
          )
        }
        return moment(Number(item.date) * 1000).format('YYYY-MM') == date
      })

      let listMap = _list
        .reduce((curr, item) => {
          // curr 默认初始值是一个空数组 []
          // 把第一个账单项的时间格式化为 YYYY-MM-DD
          const date = moment(Number(item.date) * 1000).format('YYYY-MM-DD')
          // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组。
          if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date == date) > -1
          ) {
            const index = curr.findIndex((item) => item.date == date)
            curr[index].bills.push(item)
          }
          // 如果在累加的数组中找不到当前项日期的,那再新建一项
          if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date == date) == -1
          ) {
            curr.push({
              date,
              bills: [item],
            })
          }

          if (!curr.length) {
            curr.push({
              date,
              bills: [item],
            })
          }
          return curr
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date))
      // 分页处理，listMap 为我们格式化后的全部数据，还未分页。
      const filterListMap = listMap.slice(
        (page - 1) * page_size,
        page * page_size
      )

      // 计算当月总收入和支出
      // 首先获取当月所有账单列表
      let __list = list.filter(
        (item) => moment(Number(item.date) * 1000).format('YYYY-MM') == date
      )
      // 累加计算支出
      let totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount)
          return curr
        }
        return curr
      }, 0)
      // 累加计算收入
      let totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount)
          return curr
        }
        return curr
      }, 0)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense, // 当月支出
          totalIncome, // 当月收入
          totalPage: Math.ceil(listMap.length / page_size), // 总分页
          list: filterListMap || [], // 格式化后，并且经过分页处理的数据
        },
      }
    } catch (error) {
      console.error('🚀 ~ BillController ~ list ~ error:', error)
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
