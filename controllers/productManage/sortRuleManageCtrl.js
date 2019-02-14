/*
 * @Author: guojia.chenxiaoyang 
 * @Date: 2019-01-08 10:38:29 
 * @Last Modified by: yuyue
 * @Last Modified time: 2019-01-29 16:41:29
 */
/* /sortRuleManage */
const express = require('express');
const router = express.Router();
const userInfo = require('../../helpers/userInfoHelper')
const httpHelper = require('../../helpers/httpHelper')();


/**
 * 查询列表
 */
router.get('/', function (req, res, next) {
    res.render('./productManage/sortRuleManage/ruleList', {
        title: '排序规则管理'
    });
});

/**
 * 新增规则
 */
router.get('/add', function (req, res, next) {
    res.render("./productManage/sortRuleManage/addRule", {
        title: '新增排序规则',
        key: req.query.key,
        type: req.query.type
    });
});

/**
 * 保存规则
 */
router.post('/saveSortRule', async function (req, res, next) {
    let staffInfo = await userInfo.staffInfo(req, res);
    let tmcInfo = await userInfo.tmcInfo(req, res);
    if (tmcInfo === null || staffInfo === null) {
        res.send(309);
    } else {
        let param = JSON.parse(req.body.param);
        let type = req.body.type;
        let result = "";
        param.modifier = staffInfo.userName;
        param.ModifyTime =  new Date().toISOString();
        param.effectiveTime = new Date(param.effectiveTime).toISOString();
        param.failureTime = new Date(param.failureTime).toISOString();
        param.tmcNo = tmcInfo.tMCNumber;
        if (type === "0") {
            result = await httpHelper.post(req, res, 'CLPRODUCTCENTERSERVICE', `/tradeRuleSettingPublicApi/addFlightSortGroup`, param);
        } else {
            result = await httpHelper.post(req, res, 'CLPRODUCTCENTERSERVICE', `/tradeRuleSettingPublicApi/updateFlightSortGroup`, param);
        }
        res.send(result);
    }
});

/**
 * 查询规则列表
 */
router.get('/queryList', async function (req, res, next) {
    let result = "";
    let param = JSON.parse(req.query.param);
    param.pageIndex = req.query.pageIndex;
    param.pageSize = 20;
    let tmcInfo = await userInfo.tmcInfo(req, res);
    if (tmcInfo === null) {
        res.send(309);
    } else {
        param.tmcNo = tmcInfo.tMCNumber;
        result = await httpHelper.post(req, res, 'CLPRODUCTCENTERSERVICE', `/tradeRuleSettingPublicApi/getFlightSortGroupPage`, param);
        res.send(result);
    }
});

/**
 * 规则详情页面
 */
router.get('/sortRuleDetail', function (req, res, next) {
    let key = req.query.key
    res.render('./productManage/sortRuleManage/sortRuleDetail', {
        key
    })
});

/**
 * 删除规则
 */
router.post('/delSortRule', async function (req, res, next) {
    let param = JSON.parse(req.body.param);
    let result = "";
    result = await httpHelper.post(req, res, 'CLPRODUCTCENTERSERVICE', `/tradeRuleSettingPublicApi/deleteGroup`, param);
    res.send(result);
});

/**
 * 跳转适用企业页面
 */
router.get("/suitCompany", function (req, res, next) {
    let groupType = req.query.groupType;
    let groupID = req.query.groupID;
    res.render('./productManage/sortRuleManage/suitCompany', {
        title: '适用企业',
        groupType,
        groupID
    });
});


/**
 * 保存适用企业修改
 */
router.post("/saveSuitCompany", async function (req, res, next) {
    let result = "{\"Success\":true,\"Result\":true}";
    let tmcInfo = await userInfo.tmcInfo(req, res);
    if (tmcInfo === null) {
        res.send(309);
    } else {
        let corpGroupRelaInfos = JSON.parse(req.body.param);
        const tmcNo = tmcInfo.tMCNumber;
        let exParam = JSON.parse(req.body.exParam);
        for (CorpGroupRelaInfo of corpGroupRelaInfos) {
            CorpGroupRelaInfo.tmcNumber = tmcNo;
        }
        exParam.corpGroupRelaInfos = corpGroupRelaInfos;
        result = await httpHelper.post(req, res, 'CLPRODUCTCENTERSERVICE', `/tradeRuleSettingPublicApi/mergeCorpGroupRela`, exParam);
        res.send(result);
    }
})

module.exports = router;