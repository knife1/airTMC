/*
 * @Author: guojia.chenxiaoyang 
 * @Date: 2019-01-08 10:40:05 
 * @Last Modified by: yuyue
 * @Last Modified time: 2019-01-29 15:57:52
 */
/* commonData*/
const express = require('express');
const router = express.Router();
const systemHelper = require('../../helpers/systemHelper');
const userInfo = require('../../helpers/userInfoHelper');
const httpHelper = require('../../helpers/httpHelper')();


/**
 * 获取航司数据
 */
router.get('/getAirList', async function (req, res) {
    let result = await systemHelper.getSystemParamInfo(req, "wxcp_CL_ProductMgeCarriers");
    res.send(result);
});

/**
 * 获取适用企业列表
 */

router.post("/getSuitCompany", async function (req, res, next) {
    let companyName = req.body.companyName;
    let tmcInfo = await userInfo.tmcInfo(req, res);
    let page = {};
    if (tmcInfo === null) {
        res.send(309);
    } else {
        if (companyName !== "" && companyName !== null && companyName !== undefined) {
            let compamy = {};
            compamy.companyName = companyName;
            page.exactMatchQuery = false;
            page.object = compamy;
        } else {
            page.exactMatchQuery = true;
        }
        page.pageIndex = 1;
        page.pageSize = 10000;
        let param = {
            page,
            tMCNumber: tmcInfo.tMCNumber
        };
        let result = "";
        result = await httpHelper.post(req, res, 'CLAIRTICKETEXTERNALINTERACTIONSERVICEJINGTIAN', `/cLBussInfoAdminPublicApi/queryEnterprisePage`, param);
        res.send(result);
    }
});

module.exports = router;