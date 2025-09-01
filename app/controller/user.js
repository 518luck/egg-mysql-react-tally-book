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

  async login() {
    const { ctx, app } = this
    const { username, password } = ctx.request.body
    const userInfo = await ctx.service.user.getUserByName(username)

    if (!userInfo || !userInfo.id) {
      // ctx.response.status = 404
      ctx.body = {
        code: 404,
        msg: '账号不存在',
        data: null,
      }
      return
    }
    if (userInfo && password != userInfo.password) {
      ctx.response.status = 409
      ctx.body = {
        code: 409,
        msg: '密码错误',
        data: null,
      }
      return
    }

    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 7,
      },
      app.config.jwt.secret
    )
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token,
      },
    }
  }

  async test() {
    const { ctx, app } = this
    const token = ctx.request.header.authorization
    const decoded = await app.jwt.verify(token, app.config.jwt.secret)
    ctx.body = {
      code: 200,
      message: '获取成功',
      data: {
        ...decoded,
      },
    }
  }

  async getUserInfo() {
    const { ctx } = this
    const user = ctx.state.user
    const userInfo = await ctx.service.user.getUserByName(user.username)
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar || '',
      },
    }
  }

  async editUserInfo() {
    const { ctx } = this
    const { signature = '', avatar = '' } = ctx.request.body

    try {
      let user_id
      const decoded = ctx.state.user
      if (!decoded) return
      user_id = decoded.id

      const userInfo = await ctx.service.user.getUserByName(decoded.username)
      await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      })

      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id: user_id,
          signature,
          username: userInfo.username,
        },
      }
    } catch (error) {}
  }
}
module.exports = UserController
