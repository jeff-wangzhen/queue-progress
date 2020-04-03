const {
  validate
} = require('../../utils/validate.js')

const db = uniCloud.database();
async function watchQueue(params) {
  let validateResult = await validate(params)
  if (validateResult.code !== 0) {
    return validateResult
  }

  let res, dataResult

  if (params.type === 'ADD') {

    dataResult = await db.collection('watch').add({
      userId: params.userId,
      queueId: params.queueId,
      watchNotifyNumber: params.watchNotifyNumber,
      time: Date.now(),
      state: 'NOTYET',
      clientId: params.clientId,
      sendable: params.sendable
    })
    if (dataResult.id) {
      res = { ...dataResult,
        code: 0
      }
    }
  } else if (params.type === 'DELETE') {
    dataResult = await db.collection('watch').where({
      userId: params.userId,
      queueId: params.queueId
    }).remove()
    if (dataResult.deleted) {
      res = { ...dataResult,
        code: 0
      }
    }
  } else {
    res = {
      code: -1,
      msg: '未知操作'
    }
  }
  return { ...res,
    // params
  }
}
exports.main = watchQueue
