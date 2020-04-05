const {
  validate
} = require('../../utils/validate.js')
const {
  wxConfig
} = require('../../utils/constants.js')
const db = uniCloud.database();
const dbCmd = db.command

async function joinQueue(params, queue, wxCloud) {
  if (params.type !== 'ADD') return;

  let number = queue.number + 1
  const isJoinedData = await db.collection('join').where({
    userId: params.joinId || params.userId,
    queueId: params.queueId
  }).orderBy("time", "desc").get()
  if (isJoinedData.data[0] && ['IN', 'DOING'].includes(isJoinedData.data[0].state)) {
    if (isJoinedData.data[0].state === 'IN') {
      return {
        code: -4,
        msg: '已加入'
      }
    } else if (isJoinedData.data[0].state === 'DOING') {


      return {
        code: -1,
        msg: '已经轮到您'
      }
    }
  }


  const nowTime = Date.now()

  let res = await db.collection('join').where({
    userId: params.joinId || params.userId,
    queueId: params.queueId,
  }).update({
    number,
    state: 'IN',
    time: nowTime
  })
  if (!res.updated) {
    res = await db.collection('join').add({
      userId: params.joinId || params.userId,
      queueId: params.queueId,
      state: 'IN',
      number,
      time: nowTime,
      joinNotifyNumber: params.joinNotifyNumber,
      clientId: params.clientId,
      sendable: params.sendable
    })
  }
  if (res.updated || res.id) {

    await db.collection('queue').doc(queue._id).update({
      number: number
    })
    await db.collection('queue_history').add({
      userId: params.joinId || params.userId,
      queueId: params.queueId,
      type: params.type,
      time: nowTime,
      joinNotifyNumber: params.joinNotifyNumber
    })


    let joinUser = await db.collection('user').field({
      'userId': true,
      'avatar': true,
      name: true,
      openid: true
    }).where({
      userId: params.joinId || params.userId,
    }).get()
    let watchUser = await db.collection('watch').aggregate().match({
        queueId: params.queueId,
        state: 'NOTYET'
      }).lookup({
        from: 'user',
        localField: 'userId',
        foreignField: 'userId',
        as: 'user',
      }).project({
        sendable: 1,
        openid: "$user.openid",
        userId: 1,
        queueId: 1,
        watchNotifyNumber: 1
      })
      .sort({
        'time': 1
      })
      .end()
    let joinedUserNum = await db.collection('join').aggregate().match({
      queueId: params.queueId,
      state: 'IN'
    }).count("userId").end()
    let messages = []
    if (params.joinId) {
      messages = [{
        fromId: 'SYSTEM',
        toId: params.joinId,
        content: "您申请加入队列  " + queue.title + " 的请求已通过",
        href: "/pages/queue-information/queue-information?queueId=" + params.queueId,
        time: Date.now(),
      }, {
        fromId: 'SYSTEM',
        toId: params.userId,
        content: "您已批准 " + joinUser.data[0].name + " 加入队列  " + queue.title,
        href: "/pages/queue-information/queue-information?queueId=" + params.queueId,
        time: Date.now(),
      }]

    } else {
      uniCloud.logger.log(params)
      messages = [{
        fromId: 'SYSTEM',
        toId: queue.creatorId,
        content: joinUser.data[0].name + " 加入队列 " + queue.title,
        href: "/pages/queue-information/queue-information?queueId=" + params.queueId,
        time: Date.now(),
      }, {
        fromId: 'SYSTEM',
        toId: params.userId,
        content: "您已加入队列  " + queue.title,
        href: "/pages/queue-information/queue-information?queueId=" + params.queueId,
        time: Date.now(),
      }]
    }
    // watchUser.data.map(item => {
    //   messages.push({
    //     fromId: 'SYSTEM',
    //     toId: item.userId,
    //     content: "您关注的队列 " + queue.title + " 有人加入，当前队列总人数为  " + joinedUserNum.data[0].userId,
    //     href: "/pages/queue-information/queue-information?queueId=" + params.queueId,
    //     time: Date.now(),
    //   })
    // })
    await db.collection('message').add(messages)

    let notifyUser = watchUser
    if (params.joinNotifyNumber === joinedUserNum.data[0].userId) {
      notifyUser.data.unshift({
        openid: joinUser.data[0].openid,
        userId: params.joinId || params.userId,
        joinNotifyNumber: params.joinNotifyNumber,
        sendable: params.sendable
      })
    }
    let notifyRes = await notify(notifyUser.data, joinedUserNum.data[0] && joinedUserNum.data[0].userId || 0, queue.title,
      queue.queueId, wxCloud)
    return { ...res,
      code: 0,
      // joinedUserNum,
      // notifyRes
    }
  } else {
    return {
      ...res,
      code: -1,
      msg: '失败'
    }
  }
}

async function quit(params, queue, wxCloud) {


  const isJoinedData = await db.collection('join').where({
    userId: params.type === 'QUIT' ? params.userId : params.joinId,
    queueId: params.queueId
  }).get()
  if (!isJoinedData.data[0]) {
    return {
      code: -6,
      msg: '未入队'
    }
  }

  if (['QUIT', 'LEAVE', 'DELETE'].includes(isJoinedData.data[0].state)) {
    return {
      code: -5,
      msg: '已出队'
    }
  }





  const nowTime = Date.now()
  let doingPerson
  let joinRes
  if (params.type === 'LEAVE') {
    doingPerson = await db.collection('join').where({
      state: 'DOING',
      queueId: params.queueId,
    }).get()
    if (doingPerson.data.length > 0) {
      joinRes =
        await db.collection('join').where({
          userId: doingPerson.data[0].userId,
          queueId: params.queueId,
        }).update({
          time: nowTime,
          state: "LEAVE"
        })

    }
  } else {
    joinRes = await db.collection('join').where({
      userId: params.type === 'QUIT' ? params.userId : params.joinId,
      queueId: params.queueId
    }).update({
      time: nowTime,
      state: params.type
    })



  }
  let joinUser
  let notifyRes = {}
  if (joinRes.updated) {
    await db.collection('queue_history').add({
      userId: params.type === "QUIT" ? params.userId : params.joinId,
      queueId: params.queueId,
      type: params.type,
      time: nowTime
    })


    let totalJoinUser = await db.collection('join').aggregate().match({
      queueId: params.queueId,
      state: 'IN'
    }).count("userId").end()
    joinUser = await db.collection('join').aggregate().match({
        queueId: params.queueId,
        state: 'IN',
        time: dbCmd.gt(isJoinedData.data[0].time)
      }).project({
        sendable: 1,
        openid: 1,
        userId: 1,
        queueId: 1,
        state: 1,
        joinNotifyNumber: 1
      })
      .sort({
        'time': 1
      }).end()
    let watchUser = await db.collection('watch').aggregate().match({
        queueId: params.queueId,
        state: 'NOTYET'
      }).lookup({
        from: 'user',
        localField: 'userId',
        foreignField: 'userId',
        as: 'user',
      }).project({
        sendable: 1,
        openid: "$user.openid",
        userId: 1,
        queueId: 1,
        watchNotifyNumber: 1
      })
      .sort({
        'time': 1
      })
      .end()

    let notifyUser = joinUser.data.concat(watchUser.data)
    let totalNumber = joinUser.data.length

    let messages = notifyUser.map((item, index) => {
      let content
      if (index < totalNumber && item.state) {
        content = "您加入的队列  " + queue.title + " 前方有人出队，您前面还有 " + index + " 人，请及时关注队列动态"
      } else {
        content = "您关注的队列  " + queue.title +
          " 人数有变动，当前队列总人数为 " + totalNumber + " 人"
      }
      return {
        fromId: 'SYSTEM',
        toId: item.userId,
        content,
        href: "/pages/queue-information/queue-information?queueId=" + params.queueId,
        time: Date.now()
      }
    })

    if (messages.length > 0) {
      await db.collection('message').add(messages)
      if (params.type !== 'DOING') {
        notifyRes = await notify(notifyUser, totalJoinUser.data[0] && totalJoinUser.data[0].userId || 0, queue.title,
          queue.queueId, wxCloud)
      }

    }
    joinRes = { ...joinRes,
      // notifyRes,
      // joinUser,
      // len: joinUser.length,
      // notifyUser,
      code: 0
    }
  } else {
    joinRes = {
      msg: '失败',
      ddd: 999,
      code: -1
    }
  }



  return { ...joinRes,
    ss: 2,
    // joinRes,
    // doingPerson,
    // notifyRes


  }
}

async function notify(notifyUser, joinNumber, title, queueId, wxCloud) {
  let wxJoinNotifyUser = [],
    wxWatchNotifyUser = [],
    unipushJoinNotifyUser = [],
    unipushWatchNotifyUser = [],
    len = notifyUser.length,
    as = 0,
    res = {}
  joinNumber = joinNumber || 0
  uniCloud.logger.log(notifyUser, joinNumber, title, queueId, wxCloud)
  notifyUser.map((item, index) => {
    as++
    if (typeof item.joinNotifyNumber === 'number' && item.joinNotifyNumber === joinNumber) {
      if (item.clientId) {
        unipushJoinNotifyUser.push({
          clientId: item.clientId,
          joinNotifyNumber: item.joinNotifyNumber
        })
      } else if (item.openid && item.sendable) {
        wxJoinNotifyUser.push({
          userId: item.userId,
          joinNotifyNumber: item.joinNotifyNumber
        })
      }

    } else if (typeof item.watchNotifyNumber === 'number' && item.watchNotifyNumber === joinNumber) {

      if (item.clientId) {
        unipushWatchNotifyUser.push({
          clientId: item.clientId,
          watchNotifyNumber: item.watchNotifyNumber
        })
      } else if (item.openid && item.sendable) {
        wxWatchNotifyUser.push({
          userId: item.userId,
          watchNotifyNumber: item.watchNotifyNumber
        })
      }
    }
  })
  if (wxWatchNotifyUser.length > 0) {
    let arrWatch = wxWatchNotifyUser.map(item => item.userId)
    let arrJoin = wxJoinNotifyUser.map(item => item.userId)
    await db.collection('watch').where({
      userId: dbCmd.in(arrWatch),
      queueId,
      state: 'NOTYET',
      sendable: false
    }).update({
      state: 'END'
    })
    // await db.collection('join').where({
    //   userId: dbCmd.in(arrJoin),
    //   queueId,sendable:false
    // }).update({
    //   state: 'END'
    // })
  }
  if (wxJoinNotifyUser.length + wxWatchNotifyUser.length > 0) {



    const access_tokenAjax = await uniCloud.httpclient.request(
      "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + wxConfig.appid + "&secret=" +
      wxConfig.appSecret, {
        method: 'GET',
        data: {
          test: 'testValue'
        },
        dataType: 'json'
      })


    // 
    res = await uniCloud.httpclient.request(
      "https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=" + access_tokenAjax.data.access_token +
      "&env=queue-program-data-zp59j&name=notify", {
        method: 'POST',
        data: {
          title: title.slice(0, 20),
          wxJoinNotifyUser,
          wxWatchNotifyUser,
        },
        contentType: 'json',
        dataType: 'json'
      })


    uniCloud.logger.log(8888888888888888888888, wxJoinNotifyUser,
      wxWatchNotifyUser,
      notifyUser)

  }
  wxCloud = {
    // notifyUser,
    // wxJoinNotifyUser,
    // wxWatchNotifyUser,
    acceptNotifyUser: res,
    // notify: res2,

    // joinNumber
  }
  return wxCloud
}

async function main(params) {
  let wxCloud = {}
  let validateResult = await validate(params)
  if (validateResult.code !== 0) {
    return validateResult
  }
  let res, queue, queryResult
  queryResult = await db.collection('queue').where({
    queueId: params.queueId
  }).get()
  queue = queryResult.data[0]
  if (params.type === 'ADD') {

    if (queue.state === "STOP") {
      res = {
        code: -1,
        msg: '已停止排队'
      }
    } else if (queue.state === "DELETED") {
      res = {
        code: -1,
        msg: '队列已删除'
      }
    } else if (queue.number === queue.maxPeopleCount) {
      res = {
        code: -1,
        msg: '取号数达到上限'
      }
    } else if (queue.startTime > Date.now()) {
      res = {
        code: -1,
        msg: '时间未到'
      }
    } else if (queue.joinCondition.type === "NO") {
      res = await joinQueue(params, queue, wxCloud)
    } else if (queue.joinCondition.type === "CHECK") {
      if (params.userId === queue.creatorId) {
        if (params.decision === "OK") {

          res = await joinQueue(params, queue, wxCloud)
          if (res.code === 0) {
            await db.collection('answer').doc(params.answerId).update({
              state: 'RESOLVED'
            })

          }
        } else {
          res = {
            code: 0
          }
          await db.collection('answer').doc(params.answerId).update({
            state: 'REJECTED'
          })
          await db.collection('message').add({
            fromId: 'SYSTEM',
            toId: params.joinId,
            content: "您申请加入队列  " + queue.title + " 的请求已被拒绝",
            href: "/pages/queue-information/queue-information?queueId=" + params.queueId,
            time: Date.now()
          })
        }

      } else {
        res = {
          code: -1,
          msg: '需要验证信息'
        }
      }

    }
  } else if (['QUIT', 'DOING', 'DELETE', 'LEAVE'].includes(params.type)) {
    res = await quit(params, queue, wxCloud)
  } else {
    res = {
      msg: '未知操作',
      code: -2
    }
  }

  return { ...res,

    // wxCloud,
    // params,
    // queryResult
  }
}
exports.main = main
