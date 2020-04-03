const wxConfig = {
  appid: "", //微信小程序AppId
  appSecret: "", //微信小程序AppSecret
  mchid: "", // 商户号
  partnerKey: "", // key为商户平台设置的密钥key
};
const uniappConfig = {
  AppID: "",
  AppSecret: "",
  AppKey: "",
  MasterSecret: "",
};
const passSecret = ""; //用于用户数据库密码加密的密钥，使用一个比较长的随机字符串即可

//上面的字段非常重要！！！

const tokenExp = 7200000;

module.exports = {
  wxConfig,
  passSecret,
  uniappConfig,
  tokenExp,
};
