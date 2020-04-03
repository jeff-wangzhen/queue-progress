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
  let res;

  res = await db.collection('queue').where({
    queueId: params.queueId,
    creatorId: params.userId
  }).update({
    state: params.state
  })
  if (params.type === 'DELETED') {
    await db.collection('watch').where({
      queueId: params.queueId
    }).update({
      state: "DELETED"
    })
    await db.collection('join').where({
      queueId: params.queueId
    }).update({
      state: "DELETED"
    })
  }


  await db.collection('queue_history').add({
    userId: params.userId,
    queueId: params.queueId,
    type: params.state,
    time: Date.now()
  })
  return { ...res,
    code: 0,
    params
  }

}


exports.main = main
