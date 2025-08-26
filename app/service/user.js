'use strict'

const { Service } = require('egg')

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this
    try {
      const result = await app.mysql.get('user', { username })
      return result
    } catch (error) {
      return null
    }
  }

  async register(params) {
    const { app } = this
    try {
      const result = await app.mysql.insert('user', params)
      return result
    } catch (error) {
      return null
    }
  }

  // 修改用户信息
  async editUserInfo(params) {
    const { app } = this
    try {
      let result = await app.mysql.update(
        'user',
        {
          ...params,
        },
        {
          id: params.id,
        }
      )
      return result
    } catch (error) {
      return null
    }
  }
}

module.exports = UserService
