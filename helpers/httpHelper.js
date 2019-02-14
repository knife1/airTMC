/*
 * @Author: guojia.chenxiaoyang 
 * @Date: 2019-01-08 15:22:39 
 * @Last Modified by: yuyue
 * @Last Modified time: 2019-01-30 10:20:22
 */
const http = require('http');
const https = require('https');
const URL = require('url');
const _path = require('../config/path');
const moment = require('moment');

function Request() {}
Request.prototype.requst = async function (req, res, serviceWay, method, url, params) {
    let postData = JSON.stringify(params || {});
    let la517_clientInfo = { // 请求头客户端信息
        "pkgname":"com.na517.CLAirTicketTMCWeb",
        "clienttype": 101,    
        "mcode": "CLAirTicketTMCWeb_I357537085635811", 
        "timestamp": moment().format('YYYY-MM-DD HH:mm:ss'),
        "version": "0.0.1"  
    }
    const la517_clientType = 101;
    la517_clientInfo = new Buffer(JSON.stringify(la517_clientInfo)).toString('base64');
    let la517_token = req.cookies.token || URL.parse(url, true).query.token; // 请求头token验证
    let la517_loginUser = {}; // 请求头用户信息
    if (undefined !== req.session.staffInfo) {
        let tmcInfo = {};
        let staffInfo = req.session.staffInfo;
        let tmcShortInfoList = staffInfo.entAndTmcShortInfoList[0];
        if (!tmcShortInfoList) {
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
            la517_loginUser = {
                sid: tmcInfo.staffNo,   // 员工ID
                uid: tmcInfo.userNo,   // 用户UserNo
                uname: tmcInfo.userName,  // 用户name
                entNo: tmcInfo.enterpriseNum, // 企业ID ，用户当前选中的企业
                entName: tmcInfo.enterpriseName,  // 企业名称 
                depNo: tmcInfo.deptNO ? tmcInfo.deptNO : "",  // 部门No ，当前选中企业的部门，有多个默认传第一个，没有的时候传空字符串同理depName
                depName: tmcInfo.deptName ? tmcInfo.deptName : "",  // 部门名称 
                tmcno: tmcInfo.tMCNumber,   // TMC NO
                tmcname: tmcInfo.tMCName   // TMC名称
            }
        }
    }
    la517_loginUser = new Buffer(JSON.stringify(la517_loginUser)).toString('base64');
    url = `${_path._HttpUrlObj[serviceWay]}${url}`; // 请求链接的拼接
    let urlObj = URL.parse(url);
    let protocol = urlObj.protocol;
    let op = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        method: method,
        path: urlObj.path,
        headers: {
            la517_token,
            la517_loginUser,
            la517_clientInfo,
            "Content-Type":"application/json;charset=utf-8",
            la517_clientType
        }
    };
    return new Promise((resolve, reject) => {
        let req = (protocol == 'http:' ? http : https).request(op, (res) => {
            let chunks = [];
            res.on('data', (data) => {
                chunks.push(data);
            });
            res.on('end', () => {
                let buffer = Buffer.concat(chunks);
                resolve(buffer.toString())
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        if (postData != '') {
            req.write(postData);
        }
        req.end();
    })
}

Request.prototype.get = function (req, res, serviceRegister, url, serviceWay='gateway') { // req-request, serviceRegister-注册中心服务名称, url-swagger地址（方法地址）,serviceWay-服务对应域名的值(默认为网关)
    url = _path._ServiceRegister[serviceRegister] ? `${_path._ServiceRegister[serviceRegister]}${url}` : url;
    return this.requst(req, res, serviceWay, "GET", url);
}

Request.prototype.post = function (req, res, serviceRegister, url, params, serviceWay='gateway') { // req-request, serviceRegister-注册中心服务名称, url-swagger地址（方法地址）, params-post入参, serviceWay-服务对应域名的值(默认为网关)
    url = _path._ServiceRegister[serviceRegister] ? `${_path._ServiceRegister[serviceRegister]}${url}` : url;
    return this.requst(req, res, serviceWay, "POST", url, params);
}

module.exports = function () {
    return new Request();
}