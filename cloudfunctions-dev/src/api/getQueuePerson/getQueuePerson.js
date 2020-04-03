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
  let res = {
    current: {},
    data: [],
    code: -1,
    msg: '获取队列成员失败，请重试'
  }
  let lastTime = 0
  if (params.lastTime) lastTime = params.lastTime
  let userRes = await db.collection('join').where({

    queueId: params.queueId,
    state: dbCmd.or(dbCmd.eq('IN'), dbCmd.eq('DOING')),
    time: dbCmd.gt(params.lastTime)
  }).orderBy("time", "asc").get()

  let i = 0;
  for (i = 0; i < userRes.data.length; i++) {


    if (userRes.data[i].state === 'DOING') {
      res.current = (await db.collection('user').field({
        'userId': true,
        'avatar': true,
        name: true
      }).where({
        userId: userRes.data[i].userId

      }).get()).data[0]
      let timeData = await db.collection('queue_history').where({
        userId: userRes.data[i].userId,
        queueId: params.queueId,
        type: "DOING"
      }).orderBy("time", "desc").get()
      res.current.doingTime = timeData.data[0].time
    } else {
      let user = await db.collection('user').field({
        'userId': true,
        'avatar': true,
        name: true
      }).where({
        userId: userRes.data[i].userId
      }).get()

      res.data[i] = Object.assign(user.data[0], {
        number: userRes.data[i].number,
        time: userRes.data[i].time,
      })
    }

  }
  res.data = res.data.filter(item => item !== null);
  return { ...res,
    // a: 2,
    // userRes,
    // params,
    code: 0
  }
}


exports.main = main
