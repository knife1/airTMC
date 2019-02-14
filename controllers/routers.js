/*
 * @Author: guojia.chenxiaoyang
 * @Date: 2019-01-07 16:20:17
 * @Last Modified by: guojia.chenxiaoyang
 * @Last Modified time: 2019-01-09 13:32:22
 */
var express = require("express");
var router = express.Router();
router.use("/sortRuleManage", require("./productManage/sortRuleManageCtrl"));
router.use("/commonData", require("./common/commonDataCtrl"));

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Express"
  });
});

module.exports = router;
