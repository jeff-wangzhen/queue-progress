const jwt = require('jwt-simple')

const db = uniCloud.database()
async function validateToken(token) {
  const userFromToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

  const userInDB = await db.collection('user').where(userFromToken).get()

  if (userInDB.data.length !== 1) {
    return {
      userInDB,
      token,
      status: -1,
      msg: '查无此人'
    }
  }
  const userInfoDB = userInDB.data[0]
  let userInfoDecode

  userInfoDecode = jwt.decode(token, userInfoDB.tokenSecret)

  function checkUser(userFromToken, userInfoDB) {
    return Object.keys(userFromToken).every(function(item) {
      return userFromToken[item] === userInfoDB[item] && userFromToken[item] === userInfoDecode[item]
    })
  }


  if (userInfoDB.exp > Date.now() && checkUser(userFromToken, userInfoDB)) {
    return {
      code: 0,
      status: 0,
      openid: userInfoDB.openid,
      userId: userInfoDB.userId,
      msg: 'token验证成功'
    }
  }

  if (userInfoDB.exp < Date.now()) {
    return {
      status: -3,
      msg: 'token已失效，请重新登录'
    }
  }

  return {
    status: -2,
    msg: '请登录'
  }

}

module.exports = {
  validateToken
}
