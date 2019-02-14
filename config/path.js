/*
 * @Author: yuyue
 * @Date: 2019-01-18 15:22:39
 * @Last Modified by: yuyue
 * @Last Modified time: 2019-01-18 15:22:39
 */
module.exports = {
  _StaticUrl: "", // 页面静态资源路径
  _HttpUrlObj: {
    // 网关和相关服务地址
    gateway: "http://172.17.42.151:16844/pc", // 机票网关地址
    userInfo: "http://172.17.42.151:10072" // 获取用户信息地址
  },
  _ServiceRegister: { // 注册中心映射地址，本地需要改为映射本地ip后面会接花名 eg CLPRODUCTCENTERSERVICEYUYUE(本地) ---- CLPRODUCTCENTERSERVICE (内网外网)
    CLPRODUCTCENTERSERVICE: "/CLPRODUCTCENTERSERVICE",
    cLBussInfoAdminService: "/cLBussInfoAdminService",
    CLAIRTICKETEXTERNALINTERACTIONSERVICEJINGTIAN: "/CLAIRTICKETEXTERNALINTERACTIONSERVICEJINGTIAN"
  }
};
