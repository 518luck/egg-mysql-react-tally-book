'use strict'
module.exports = (secret) => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization // 若是没有 token，返回的是 null 字符串
    let decoded
    if (token != 'null' && token) {
      try {
        decoded = ctx.app.jwt.verify(token, secret) //验证token
        console.log('🚀 ~ jwtErr ~ decoded:', decoded)
        await next()
      } catch (error) {
        ctx.response.status = 401
        ctx.body = {
          code: 401,
          msg: 'token已过期,请重新登录',
          data: null,
        }
        return
      }
    } else {
      ctx.response.status = 401
      ctx.body = {
        code: 401,
        msg: 'token不存在,请重新登录',
        data: null,
      }
      return
    }
  }
}
