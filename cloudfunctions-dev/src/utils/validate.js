const {
  validateToken
} = require('./validateToken.js')
async function validate(params) {

  let validateResult
  try {
    validateResult = await validateToken(params.token)
  } catch (e) {
    return {
      e,
      params,
      code: -2,
      status: -2,
      msg: '请登录'
    }
  }
  if (validateResult.status !== 0) {
    return {
      params,
      ...validateResult,
      code: -1
    }
  }

  let openid = validateResult.openid

  if (openid && params.userId !== openid) return {
    params,
    code: -2,
    msg: '请登录'
  }
  return {
    params,
    code: 0
  }
}
module.exports = {
  validate
}
