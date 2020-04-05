const db = uniCloud.database();
const dbCmd = db.command

async function main(params) {
  let res = {
    data: [],
    code: -1,
    msg: '提交失败，请重试'
  }
  let dataRes, hasMore = false
  if (params.type === 'ADD') {
    const {
      content,
      creator,
      contactWay
    } = params
    if (content.trim() === '') {
      res.msg = '内容不能为空'
      return res;
    }
    dataRes = await db.collection('feedback').add({
      content,
      creator,
      contactWay,
      time: Date.now()
    })

  } else if (params.type === 'GET') {

    let length = params.length || 5

    dataRes = await db.collection('feedback').aggregate().match({
      time: dbCmd.lt(params.lastTime || Date.now())
    }).project({
      _id: 0,
      contactWay: 0
    }).sort({
      time: -1
    }).limit(length).end()
    if (dataRes.data && dataRes.data.length > 0) {

      let hasMoreData = await db.collection('feedback').where({
        time: dbCmd.lt(dataRes.data[dataRes.data.length - 1].time)
      }).count()
      hasMore = hasMoreData.total > 0
    }
  } else {
    res.msg = "未知操作"
  }

  return {
    data: dataRes.data,
    hasMore,
    // params,
    code: 0
  }
}


exports.main = main
