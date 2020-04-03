const {
  validate
} = require('../../utils/validate.js')

const db = uniCloud.database();
const dbCmd = db.command

async function main(params) {
  let messages, fromUser = {}
  let length = params.length || 5,
    res = {
      data: []
    }
  let hasMore = false
  let validateResult = await validate(params)
  if (validateResult.code !== 0) {
    return validateResult
  }

  //console.log(params)
  if (params.type === 'GETLIST') {
    messages = await db.collection('message').aggregate().match({
        toId: params.userId
      }).lookup({
        from: 'user',
        localField: 'fromId',
        foreignField: 'userId',
        as: 'fromUser',
      }).project({
        "_id": 0,
        "fromUser._id": 0,
        "fromUser.tokenSecret": 0,
        "fromUser.password": 0,
        "fromUser.exp": 0,

      }).sort({
        time: -1
      }).limit(1)
      .end()

    //console.log(messages)

  } else {
    messages = await db.collection('message').aggregate().match({
        toId: params.userId,
        fromId: params.fromId,
        time: dbCmd.lt(params.lastTime || Date.now())
      }).sort({
        time: -1
      }).limit(length)
      .end()
    await db.collection('message').where(messages.data[0]).update({
      read: true
    })
    if (!params.lastTime) {
      let fromUserData = await db.collection('user').aggregate().match({
        userId: params.fromId
      }).project({
        name: 1,
        avatar: 1,
        userId: 1
      }).end()
      fromUser = fromUserData.data[0]
    }
  }
  length = messages.data.length
  if (length > 0) {


    let hasMoreData = await db.collection('message').aggregate().match({
      toId: params.userId,
      fromId: params.fromId,
      time: dbCmd.lt(messages.data[length - 1].time)
    }).count("time").end()
    if (hasMoreData.data[0] && hasMoreData.data[0].time > 0) {
      hasMore = true
    }
  }
  res = {
    fromUser,
    data: messages.data,
    hasMore
  }




  res = { ...res,
    // messages,
    code: 0
  }

  return { ...res,
    params
  }
}


exports.main = main
