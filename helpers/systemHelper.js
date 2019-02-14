/*
 * @Author: guojia.chenxiaoyang 
 * @Date: 2019-01-08 10:40:47 
 * @Last Modified by: yuyue
 * @Last Modified time: 2019-01-29 15:58:29
 */
const httpHelper = require('./httpHelper')();
module.exports = {
    /**
     * 
     * @param {string} sysId 系统参数
     */
    getSystemParamInfo: async function (req, sysId) {
        let paramString = "";
        paramString = await httpHelper.post(req, res, 'CLPRODUCTCENTERSERVICE', `/sysParamPublicApi/getSysParam`, {sysId});
        return paramString;
    },
    /**
     * 
     * @param {string} sysId 字典参数
     */
    getDictionaryParam: async function (req, sysId) {
        let paramString = "";
        paramString = await httpHelper.post(req, res,'CLPRODUCTCENTERSERVICE', `/sysParamPublicApi/getDicParam`, {sysId});
        return paramString;
    }
};