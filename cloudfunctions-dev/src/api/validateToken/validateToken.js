const {
  validateToken
} = require('../../utils/validateToken.js')

const db = uniCloud.database()
async function report(event) {
  try {
    return await validateToken(event.token)
  } catch (e) {
    //TODO handle the exception
    return {
      e,
      status: -2,
      errCode: 'TOKEN_INVALID',
      msg: '请登录'
    }
  }
};

exports.main = report
