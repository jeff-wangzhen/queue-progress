const db = uniCloud.database();

const dbCmd = db.command
async function main(params) {
  let length = params.length || 5
  let lastTime = Date.now()
  if (params.lastTime) {
    lastTime = params.lastTime
  }
  let res = await db.collection('queue_history').aggregate().match({

    queueId: params.queueId,
    time: dbCmd.lt(lastTime)
  }).sort({
    time: -1
  }).limit(length).end()
  let hasMoreData, hasMore
  if (res.data.length > 0) {


    hasMoreData = await db.collection('queue_history').where({

      queueId: params.queueId,
      time: dbCmd.lt(res.data[res.data.length - 1].time)
    }).count()
    hasMore = hasMoreData.total > 0
  }
  let i = 0;
  for (i = 0; i < res.data.length; i++) {
    let user = await db.collection('user').aggregate()
      .match({
        userId: res.data[i].userId
      }).project({
        userId: 1,
        name: 1,
        avatar: 1
      })
      .end()
    res.data[i].username = user.data[0].name
  }
  //console.log(4444444444444444, length)
  return { ...res,
    hasMore,
    code: 0,
    // length,
    // hasMore: hasMoreData.data && hasMoreData.data[0] && hasMoreData.data[0].time>0,
    // params
  }
}


exports.main = main
