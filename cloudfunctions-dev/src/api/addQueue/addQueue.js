const {
  validate
} = require('../../utils/validate.js')

const db = uniCloud.database();
async function main(params) {

  let validateResult = await validate(params)
  if (validateResult.code !== 0) {
    return validateResult
  }
  let time = Date.now()
  let res = {}
  if (params.queue.queueId && params.queue.queueId !== 0) {
    res = await db.collection('queue').where({
      queueId: params.queue.queueId
    }).update({
      ...params.queue,
      createTime: time,
    })
    if (res.updated) {
      //console.log(1)
      res = {
        code: 0
      }
      await db.collection('queue_history').add({
        userId: params.userId,
        queueId: params.queue.queueId,
        type: 'MODIFY',
        time
      })
    }
  } else {
    let data = {
      ...params.queue,
      creatorId: params.userId,
      queueId: time,
      createTime: time,
      state: 'OK',
      number: 0
    }
    // //console.log(2, params, data)

    try {
      res = await db.collection('queue').add(data)
    } catch (e) {
      //console.log('\n\n', typeof data, '\n\n', data === null, data === undefined, 5555555, e)
    }

    //console.log(4, res)
    if (res.id) {
      //console.log(3)
      res = {
        code: 0
      }
      // try {
      await db.collection('queue_history').add({
        userId: params.userId,
        queueId: time,
        type: 'INIT',
        time
      }) 
      //.then((res,rej)=>{ uniCloud.logger.log('11no error', res)}).catch((res,rej)=>{ uniCloud.logger.log('error', res,rej)})
      // } catch (e) {
      //   uniCloud.logger.log('error', e)
      // }
      // uniCloud.logger.log('no error')
    } else {
      res = { ...res,
        code: -1,
        msg: '操作失败'
      }
    }
  }

  return { ...res,
    params
  }
}
exports.main = main
