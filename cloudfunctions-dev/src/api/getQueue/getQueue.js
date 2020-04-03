const {
  validate
} = require('../../utils/validate.js')

const db = uniCloud.database();
const dbCmd = db.command
const $ = db.command.aggregate
let length = 5



async function getJoined(queryParams, hasMore) {

  let queues = await db.collection('join').aggregate().match({
      state: dbCmd.or(dbCmd.eq('IN'), dbCmd.eq('DOING'), dbCmd.eq('LEAVE')),
      time: dbCmd.lt(queryParams.lastTime || Date.now()),
      userId: queryParams.userId
    }).lookup({
      from: 'queue',
      localField: 'queueId',
      foreignField: 'queueId',
      as: 'queue',
    }).project({
      queue: 1,
      number: "$queue.number",
      maxPeopleCount: "$queue.maxPeopleCount",
      queueId: 1,
      joinState: "$state",
      time: 1,
      queueState: "$queue.state",
      title: "$queue.title"
    })


    .sort({
      time: -1
    }).limit(queryParams.length).end();
  queues = queues.data
  queues = queues && queues.map(item => {
    item.title = item.title[0]
    item.queueState = item.queueState[0]
    item.number = item.number[0]
    item.maxPeopleCount = item.maxPeopleCount[0]
    return item
  })


  for (let i = 0; i < (queues && queues.length) || 0; i++) {
    let joinTime = queues[i].time


    let rank = await db.collection('join').where({
      queueId: queues[i].queueId,
      time: dbCmd.lte(joinTime),
      state: dbCmd.or(dbCmd.eq('IN'), dbCmd.eq('DOING')),
    }).count();
    if (!rank.code) {
      queues[i].rank = rank.total
    }
  }
  let lastJoinTime = Date.now();
  if (queues.length > 0) {
    try {
      lastJoinTime = queues[queues.length - 1].time
    } catch (e) {
      queues.err = e
    }
    let hasMoreData = await db.collection('join').where({
      state: dbCmd.eq('IN'),
      time: dbCmd.lt(lastJoinTime),
      userId: queryParams.userId
    }).count();

    if (hasMoreData.total > 0) {
      hasMore = true
    }
  }
  return {
    queues,
    hasMore
  }
}
async function getWatched(queryParams, hasMore) {
  let queues = await db.collection('watch').aggregate().match({
    state: dbCmd.or([dbCmd.eq('NOTYET'), dbCmd.eq('END')]),
    time: dbCmd.lt(queryParams.lastTime || Date.now()),
    userId: queryParams.userId
  }).lookup({
    from: 'queue',
    localField: 'queueId',
    foreignField: 'queueId',
    as: 'queue',
  }).project({
    number: "$queue.number",
    maxPeopleCount: "$queue.maxPeopleCount",
    queueId: 1,
    joinState: "$state",
    time: 1,
    queueState: "$queue.state",
    title: "$queue.title"
  }).sort({
    time: -1
  }).limit(queryParams.length).end();

  queues = await getPersonNum(queues, true)

  let lastWatchTime = Date.now();
  if (queues.length > 0) {
    try {
      lastWatchTime = queues[queues.length - 1].time
    } catch (e) {
      queues.err = e
    }
    let hasMoreData = await db.collection('watch').where({
      state: dbCmd.or([dbCmd.eq('NOTYET'), dbCmd.eq('END')]),
      time: dbCmd.lt(lastWatchTime),
      userId: queryParams.userId
    }).count();



    if (hasMoreData.total > 0) {
      hasMore = true
    }
  }
  return {
    queues,
    hasMore
  }
}

async function getCreated(queryParams, hasMore) {

  let queues = await db.collection('queue').aggregate().match({
    queueId: dbCmd.lt(queryParams.lastId || Date.now()),
    creatorId: queryParams.userId,
    state: dbCmd.neq('DELETED'),
  }).lookup({
    from: 'queue',
    localField: 'queueId',
    foreignField: 'queueId',
    as: 'queue',
  }).project({
    number: "$queue.number",
    maxPeopleCount: "$queue.maxPeopleCount",
    isCreator: 1,
    queueId: 1,
    joinState: "$state",
    time: 1,
    queueState: "$queue.state",
    title: "$queue.title"
  }).sort({
    queueId: -1
  }).limit(queryParams.length).end();
  queues = await getPersonNum(queues, true)


  let lastQueueId = Date.now();
  if (queues.length !== 0) {
    try {
      lastQueueId = queues[queues.length - 1].queueId
    } catch (e) {
      queues.err = e
    }
    let hasMoreData = await db.collection('queue').where({
      state: dbCmd.neq('DELETED'),
      queueId: dbCmd.lt(lastQueueId),
      creatorId: queryParams.userId
    }).count();
    // hasMoreData.personNum = personNum
    if (hasMoreData.total > 0) {
      hasMore = true
    }
  }
  return {
    queues,
    hasMore
  }
}

async function getPersonNum(queues, needMap) {
  queues = queues.data
  if (needMap) {
    queues = queues && queues.map(item => {
      item.title = item.title[0]
      item.queueState = item.queueState[0]
      item.number = item.number[0]
      item.maxPeopleCount = item.maxPeopleCount[0]
      return item
    })
  }

  let queuesId = queues && queues.map(item => item.queueId)

  let personNum = await db.collection('join').aggregate().match({
    queueId: dbCmd.in(queuesId),
    state: dbCmd.or(dbCmd.eq('IN'), dbCmd.eq('DOING')),
  }).project({
    queueId: 1
  }).group({
    _id: '$queueId',
    personNum: $.sum(1)
  }).project({
    queueId: 1,
    personNum: 1
  }).end();

  queues && queues.map(item => {
    item.personNum = 0
    for (let i = 0; i < personNum.data.length; i++) {
      if (item.queueId === personNum.data[i]._id) {
        item.personNum = personNum.data[i].personNum;
        break;
      }
    }
  })
  return queues
}

async function getQueue(queryParams) {
  const dbCmd = db.command

  let conditions = {},
    queues,
    hasMore = false,
    hasMoreData = {}
  let project = {
    creator: {
      name: 1,
      avatar: 1,
      userId: 1
    },
    queueId: 1,
    description: 1,
    joinCondition: 1,
    createTime: 1,
    imgList: 1,
    maxPeopleCount: 1,
    number: 1,
    startTime: 1,
    state: 1,
    userId: 1,
    title: 1,
    watch: 1,
    join: 1,
    isJoined: $.filter({
      input: '$join',
      as: 'item',
      cond: $.and([
        $.eq(['$$item.userId', queryParams.userId]),
        $.or([$.eq(['$$item.state', 'IN']), $.eq(['$$item.state', 'DOING'])])
      ])
    }),
    isWatched: $.filter({
      input: '$watch',
      as: 'item',
      cond: $.and([
        $.eq(['$$item.userId', queryParams.userId])
      ])
    })
  }
  queryParams.length = queryParams.length || 5
  if (queryParams.type === "GETBYID") {
    conditions = {
      queueId: queryParams.queueId
    }
  } else if (queryParams.type === "GETCREATED") {
    let validateResult = await validate(queryParams)
    if (validateResult.code !== 0) {
      return validateResult
    }

    let resData = await getCreated(queryParams, hasMore)

    queues = resData.queues
    hasMore = resData.hasMore
    hasMoreData = resData.hasMoreData
  } else if (queryParams.type === "GETJOINED") {
    let validateResult = await validate(queryParams)
    if (validateResult.code !== 0) {
      return validateResult
    }
    let resData = await getJoined(queryParams, hasMore)
    queues = resData.queues
    hasMore = resData.hasMore
    hasMoreData = resData.hasMoreData
  } else if (queryParams.type === "GETWATCHED") {
    let validateResult = await validate(queryParams)
    if (validateResult.code !== 0) {
      return validateResult
    }
    let resData = await getWatched(queryParams, hasMore)
    queues = resData.queues
    hasMore = resData.hasMore
  } else if (queryParams.type === "GETLIST") {

    if (queryParams.keyword) {

      // let resData = await getListByKeywords(queryParams, hasMore, project)
      // let resData = {queues:{data:{}}}
      conditions = dbCmd.or([{
          state: dbCmd.neq('DELETED'),
          title: new RegExp(queryParams.keyword),
          queueId: dbCmd.lt(queryParams.lastId || Date.now()),
        },
        {
          state: dbCmd.neq('DELETED'),
          queueId: parseInt(queryParams.keyword)
        }
      ])
      // queues = resData.queues
      // hasMore = resData.hasMore
    } else {
      let lastQueueId = queryParams.lastId || Date.now()
      conditions = {
        queueId: dbCmd.lt(queryParams.lastId || Date.now()),
        onlySearch: false

      }
    }
  }
  if (JSON.stringify(conditions) !== "{}") {
    conditions.state = dbCmd.neq('DELETED')
    queues = await db.collection('queue').aggregate().match(conditions).lookup({
        from: 'user',
        localField: 'creatorId',
        foreignField: 'userId',
        as: 'creator',
      }).lookup({
        from: 'watch',
        localField: 'queueId',
        foreignField: 'queueId',
        as: 'watch',
      }).lookup({
        from: 'join',
        localField: 'queueId',
        foreignField: 'queueId',
        as: 'join',
      })
      .project(project)
      .sort({
        queueId: -1
      }).limit(queryParams.length).end();

    queues.data && queues.data.map(item => {
      item.creator = item.creator[0]
      if (item.isJoined.length > 0) {
        item.isJoined = true
      } else {
        item.isJoined = false
      }
      if (item.isWatched.length > 0) {
        item.isWatched = true
      } else {
        item.isWatched = false
      }
    })

    queues = await getPersonNum(queues, false)

    let lastQueueId = Date.now();
    // hasMoreData.query11 = queryParams
    // hasMoreData.has = hasMore
    if (queryParams.type !== 'GETBYID' && queues.length > 0) {
      try {
        lastQueueId = queues[queues.length - 1].queueId
      } catch (e) {
        queues.err = e
      }
      hasMoreData = await db.collection('queue').where({

        ...conditions,
        queueId: dbCmd.lt(lastQueueId)
      }).count()

      hasMore = hasMoreData.total > 0
    }

    queues.as = conditions
  }
  //console.log(hasMoreData)
  return {

    // queryParams,
    // queues,
    data: queues && queues.data || queues,

    hasMore,
    // hasMoreData,
    code: 0
  }


}
exports.main = getQueue
