'use strict'

const { Service } = require('egg')

class BillService extends Service {
  async add(params) {
    const { app } = this
    try {
      const result = await app.mysql.insert('bill', params)
      return result
    } catch (error) {
      return null
    }
  }
}
module.exports = BillService
