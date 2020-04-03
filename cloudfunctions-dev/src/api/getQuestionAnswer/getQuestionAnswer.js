const {
  validate
} = require('../../utils/validate.js')

const db = uniCloud.database();
const dbCmd = db.command

async function main(params) {
  let validateResult = await validate(params)
  if (validateResult.code !== 0) {
    return validateResult
  }



  let res = await db.collection('answer').doc(
    params.answerId
  ).get()
  let queue = await db.collection('queue').where({
      queueId: res.data[0].queueId
    }

  ).get()
  if (queue.data && queue.data[0].creatorId !== params.userId) {
    res = {
      code: -7,
      msg: '权限错误'
    }
  } else {
    res = { ...res,
      code: 0
    }
  }
  return { ...res,
    params
  }
}


exports.main = main
