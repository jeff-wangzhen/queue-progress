export function goPage({
  url = '',
  type = 'navigate'
}) {
 
  if (type === "redirect") {
    uni.redirectTo({
      url,
    });
  } else {
    uni.navigateTo({
      url,
    });
  }
}

export function setUser(user) {
  let that = this;
  //console.log('user', user);
  this.$store.commit('user/saveUserInfo', user);
  uni.setStorage({
    key: 'user',
    data: user,
    success: function() {
      //console.log('success', that.$store);
    },
  });
}
export async function getQueueList(queryParams) {
  if (this.$store.state.user.userId === '' && !["GETLIST", "GETBYID"].includes(queryParams.type)) {
    return {

      result: {
        code: -1,
        msg: '请登录',
        hasMore:true
      }
    }
  }
  let that = this; let queues
  that.status = 'LOADING';
  let res = await uniCloud.callFunction({
    name: 'getQueue',
    data: queryParams,
  });
  //console.log(9, res);
  if (res.result.code !== 0) {
    if (res.result.msg && res.result.msg.includes("登录")) {
      that.$setUser({
        userId: "",
        name: "",
        avatar: ""
      })
    }
    return res
  }
  return {
    result: { ...res.result,res,queues,
      data: res.result.data
    }
  };
}

export function padLeft(num) {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num.toString();
  }
}
export function formatDateTime(
  time,
  pattern = 'yyyy/MM/DD hh:mm:ss'
) {
  const date = new Date(time);
  const year = padLeft(date.getFullYear());
  const month = padLeft(date.getMonth() + 1);
  const day = padLeft(date.getDate());
  const hour = padLeft(date.getHours());
  const minute = padLeft(date.getMinutes());
  const second = padLeft(date.getSeconds());
  return pattern
    .replace(/y+/i, year)
    .replace(/M+/, month)
    .replace(/D+/, day)
    .replace(/h+/, hour)
    .replace(/m+/, minute)
    .replace(/s+/, second);
}
