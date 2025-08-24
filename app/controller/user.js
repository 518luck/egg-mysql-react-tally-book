'use strict'

const { Controller } = require('egg')

class UserController extends Controller {
  async register() {
    const { ctx } = this
    const { username, password } = ctx.request.body
    if (!username || !password) {
      ctx.response.status = 401
      ctx.body = {
        code: 401,
        msg: '账号密码不能为空',
        data: null,
      }
      return
    }
    const userInfo = await ctx.service.user.getUserByName(username)
    if (userInfo && userInfo.id) {
      ctx.response.status = 409
      ctx.body = {
        code: 409,
        msg: '您的名字重复,请换一个吧~',
        data: null,
      }
      return
    }
    const defaultAvatar =
      'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '我是一个用户',
      avatar: defaultAvatar,
    })
    if (result) {
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      }
    } else {
      ctx.response.status = 400
      ctx.body = {
        code: 400,
        msg: '注册失败',
        data: null,
      }
    }
  }
}
module.exports = UserController
