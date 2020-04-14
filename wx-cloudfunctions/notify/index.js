const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

function format(a, fmt) {
  var o = {
    "M+": a.getMonth() + 1, //月份
    "d+": a.getDate(), //日
    "h+": a.getHours() + 8, //小时
    "m+": a.getMinutes(), //分
    "s+": a.getSeconds(), //秒
    "q+": Math.floor((a.getMonth() + 3) / 3), //季度
    "S": a.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (a.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
exports.main = async (event, context) => {
  let time = format(new Date(), "yyyy年MM月dd日 hh:mm")
  let a = 1
  const {
    queueId,
    wxJoinNotifyUser,
    wxWatchNotifyUser,
    title
  } = event
  let res = [],
    err = []
  for (let i = 0; i < wxJoinNotifyUser.length; i++) {
    try {
      const data = {
        touser: wxJoinNotifyUser[i].userId,
        page: "pages/queue-information/queue-information/?queueId=" + queueId,
        data: {
          thing1: {
            value: title
          },
          phrase2: {
            value: "人数变动"
          },
          time3: {
            value: time
          },
          thing4: {
            value: "您当前处于第 " + wxJoinNotifyUser[i].joinNotifyNumber + " 位，请及时关注"
          },
          miniprogram_state: "developer"
        },
        templateId: "WXR393UHeqYRLpWstLPH73Yoj9yPtunFx76tt9AYb7Y"
      }
      const result = await cloud.openapi.subscribeMessage.send(data)
      res.push(result)
    } catch (e) {
      err.push(e)
      console.log(e)

    }
  }
  for (let i = 0; i < wxWatchNotifyUser.length; i++) {
    try {
      const data = {
        touser: wxWatchNotifyUser[i].userId,
        page: "pages/queue-information/queue-information/?queueId=" + queueId,
        templateId: "WXR393UHeqYRLpWstLPH73Yoj9yPtunFx76tt9AYb7Y",
        data: {
          thing1: {
            value: title
          },
          phrase2: {
            value: "人数变动"
          },
          time3: {
            value: time
          },
          thing4: {
            value: "当前队列有 " + wxWatchNotifyUser[i].watchNotifyNumber + " 人，请及时关注"
          },
          miniprogram_state: "developer"
        }
      }
      const result = await cloud.openapi.subscribeMessage.send(data)
      console.log(result)
      res.push(result)
      // return result
    } catch (e) {
      err.push(e)
      console.log(e)
    }
  }
  // })
  return {
    res,err
  }
}











// return a
// if (event.wxWatchNotifyUser && event.wxWatchNotifyUser.length > 0) {
//   event. wxWatchNotifyUser.map(item=>{
//     try {
//       const result = await cloud.openapi.subscribeMessage.send({
//         touser: item.userId,

//         data: {
//           name3: {
//             value: '我是玖柒后'
//           },
//           thing4: {
//             value: 'Hello World!'
//           },
//           phrase1: {
//             value: "发送成功！"
//           },
//           date5: {
//             value: "发送成功！"
//           },
//           thing2: {
//             value: "1024 身体健康！"
//           }
//         },
//         templateId: 'WXR393UHeqYRLpWstLPH73Yoj9yPtunFx76tt9AYb7Y'
//       })
//       console.log(result)
//       return result
//     } catch (err) {
//       console.log(err)
//       return err
//     }
//   })


















// 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
// const wxContext = cloud.getWXContext()

// return {
//   event,
//   openid: wxContext.OPENID,
//   appid: wxContext.APPID,
//   unionid: wxContext.UNIONID,
//   env: wxContext.ENV,
// }