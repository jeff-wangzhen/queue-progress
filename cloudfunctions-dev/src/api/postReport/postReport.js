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



  dataResult = await db.collection('report').add({
    userId: params.userId,
    queueId: params.queueId,
    reportReason: params.reportReason,
    time: Date.now()
  })
  if (dataResult.id) {
    res = { ...dataResult,
      code: 0
    }
  } else {
    res = { ...dataResult,
      code: -1,
      msg: "提交失败，请重试"
    }
  }

  return { ...res,
    params
  }
}
exports.main = watchQueue
