/*
 * @Author: guojia.chenxiaoyang 
 * @Date: 2019-01-29 14:04:01 
 * @Last Modified by: yuyue
 * @Last Modified time: 2019-01-29 16:23:45
 */
const userInfo = require('../helpers/userInfoHelper');
async function authorize(req, res, next) {
    if (undefined === req.session.staffInfo || null === req.session.staffInfo) {
        await userInfo.staffInfo(req, res);
    }
    next();
}
module.exports = authorize;