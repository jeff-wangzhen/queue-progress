const {
  validate
} = require('../../utils/validate.js')

const db = uniCloud.database();

async function main(params) {

  let validateResult = await validate(params)
  if (validateResult.code !== 0) {
    return validateResult
  }
  const res = await db.collection('answer').add({
    userId: params.userId,
    queueId: params.queueId,
    answers: params.answers,
    state: 'PENDING',
    joinNotifyNumber: params.joinNotifyNumber
  })
  if (res.id) {
    let queue = await db.collection('queue').where({
      queueId: params.queueId
    }).get()
    await db.collection('message').add({
      fromId: "SYSTEM",
      toId: queue.data[0].creatorId,
      content: params.name + " 申请加入队列 " + queue.data[0].title,
      href: "/pages/check/check?answerId=" + res.id,
      time: Date.now()
    })
    return {
      code: 0
    }
  } else {
    return { ...res,
      code: -1,
      msg: '提交失败'
    }
  }
}

exports.main = main
