/*
 * @Author: guojia.chenxiaoyang 
 * @Date: 2019-01-08 10:40:53 
 * @Last Modified by: yuyue
 * @Last Modified time: 2019-01-29 15:58:47
 */
const httpHelper = require('./httpHelper')();
module.exports = {
    tmcInfo: async function (req, res) {
        let tmcInfo = {};
        let staffInfo = await this.staffInfo(req, res);
        if (staffInfo === null) {
            return Promise.resolve(null);
        }
        let tmcShortInfoList = staffInfo.entAndTmcShortInfoList[0];
        if (!tmcShortInfoList) {
            return new Promise(resolve => {
                resolve(null);
            });
        }
        tmcInfo = {
            tMCName: tmcShortInfoList.tMCName,
            tMCNumber: tmcShortInfoList.tMCNumber,
            userNo: staffInfo.userNO,
            userName: staffInfo.userName
        };
        if (tmcShortInfoList.enterpriseNum !== null) {
            tmcInfo.enterpriseNum = tmcShortInfoList.enterpriseNum;
            tmcInfo.rootNO = tmcShortInfoList.rootNO;
            tmcInfo.enterpriseName = tmcShortInfoList.entName;
            if (tmcShortInfoList.deptInfoList !== null) {
                let deptInfoList = tmcShortInfoList.deptInfoList[0];
                tmcInfo.deptName = deptInfoList.deptName;
                tmcInfo.deptNO = deptInfoList.deptNO;
                tmcInfo.staffNo = deptInfoList.staffNo;
                tmcInfo.staffName = tmcShortInfoList.staffName;
            }
        }
        return new Promise(resolve => {
            resolve(tmcInfo);
        });
    },
    staffInfo: async(req, res) => {
        if (undefined === req.session.staffInfo || req.session.staffInfo === null) {
            await httpHelper.get(req, res, '', `/tokenInnerApi/getFullUserInfoByToken?token=${req.cookies.token}`, "userInfo").then(function (data) {
                let result = JSON.parse(data);
                if (result.code===0) {
                    req.session.staffInfo = result.data;
                } else {
                    res.status(403).send('Forbidden')
                }
            }, function (error) {
                res.status(403).send('Forbidden')
            });
            return Promise.resolve(req.session.staffInfo);
        } else {
            return Promise.resolve(req.session.staffInfo);
        }
    }
};