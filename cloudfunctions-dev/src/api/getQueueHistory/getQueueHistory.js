const db = uniCloud.database();

const dbCmd = db.command
const $ = db.command.aggregate
async function main(params) {
  let length = params.length || 5
  let lastTime = Date.now()
  if (params.lastTime) {
    lastTime = params.lastTime
  }
  let res = await db.collection('queue_history').aggregate().match({

    queueId: params.queueId,
    time: dbCmd.lt(lastTime),

  }).lookup({
    from: 'user',
    localField: 'userId',
    foreignField: 'userId',
    as: 'user',
  }).project({
    queueId: 1,
    time: 1,
    type: 1,
    userId: "$user.userId",
    username: "$user.name",
    isDeleted: $.eq(["$type", "DELETED"])
  }).unwind("$userId").unwind("$username").sort({
    time: -1
  }).limit(length).end()
  let i = 0;
  res.data.map(item => {
    if (item.isDeleted) {
      res.data = [];
      return;
    }
  })
  let hasMoreData, hasMore
  if (res.data.length > 0) {
    hasMoreData = await db.collection('queue_history').where({
      queueId: params.queueId,
      time: dbCmd.lt(res.data[res.data.length - 1].time)
    }).count()
    hasMore = hasMoreData.total > 0
  }
  return { ...res,
    hasMore,
    code: 0,
  }
}


exports.main = main
