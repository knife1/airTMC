define(["productManage/airAndCompany", "jqueryTools"], function(comm) {
  // var comm = require("airAndCompany");
  var oldCompany = [];
  var total;
  var groupParam = {
    "1": [
      "serviceFeeWay",
      "reservationType",
      "chargeWay",
      "productType",
      "reservationWay"
    ],
    "2": ["reservationType", "productType", "bundleDisplay", "bundleWay"],
    "3": ["reservationType", "defaultDisplay"]
  };
  var op = {
    getInfoByID: function(key, url) {
      var param = {
        groupID: key,
        isGetDetail: 1
      };
      $.ajax({
        type: "get",
        url: url,
        data: {
          param: JSON.stringify(param),
          pageIndex: 1
        },
        success: function(data) {
          layer.closeAll();
          if (data) {
            data = JSON.parse(data);
            if (data.success) {
              data = data.data;
              var res = data.dataInfo[0];
              var company = res.corpInfos;
              if (company.length) {
                op.edit(company);
                oldCompany = company;
              }
            }
          }
        }
      });
    },
    /**
     * 修改数据渲染
     */
    edit: function(data) {
      var company = data;
      var companyList = $("input[name='suitCompany']");
      var selectedCompany = "";
      var selectedCompanyName = "";
      for (var i = 0; i < company.length; i++) {
        if (i === company.length - 1) {
          selectedCompany += company[i].corpNumber;
          selectedCompanyName += company[i].corpName;
        } else {
          selectedCompany += company[i].corpNumber + ",";
          selectedCompanyName += company[i].corpName + ",";
        }
      }
      for (var i = 0, len = companyList.length; i < len; i++) {
        var val = $(companyList[i]).val();
        if (selectedCompany.indexOf(val) !== -1) {
          $(companyList[i]).attr("checked", "checked");
        } else {
          $(companyList[i]).removeAttr("checked");
        }
      }

      var html = "",
        suitList = selectedCompanyName.split(","),
        suitIDList = selectedCompany.split(","),
        len = suitList.length;
      for (var i = 0; i < len; i++) {
        html +=
          "<tr><td style='text-align: left' class='single-air' suitID='" +
          suitIDList[i] +
          "'>" +
          suitList[i] +
          "</td><td><a class='del' href='javascript:void(0)'>删除</a></td></tr>";
      }
      $(".show-list").html(html);
      $(".total").html(len);
    },
    saveSuitCompany: function() {
      var company = $("input[name='suitCompany']:checked"),
        param = [],
        groupType = $("input[name='groupType']").val(),
        groupID = $("input[name='groupID']").val(),
        addCompany = [],
        delCompany = [],
        tempCompany = [],
        oldCompanyIds = "",
        tempCompanyIds = "",
        oldLen = oldCompany.length;

      if (oldLen) {
        for (var i = 0; i < oldLen; i++) {
          if (i === oldLen - 1) {
            oldCompanyIds += oldCompany[i].corpNumber;
          } else {
            oldCompanyIds += oldCompany[i].corpNumber + ",";
          }
        }
      }

      for (var i = 0; i < company.length; i++) {
        if (oldLen) {
          if (oldCompanyIds.indexOf($(company[i]).val()) === -1) {
            addCompany.push(company[i]);
          } else {
            tempCompany.push(company[i]);
          }
        } else {
          addCompany.push(company[i]);
        }
      }

      if (tempCompany.length) {
        for (var i = 0; i < tempCompany.length; i++) {
          if (i === tempCompany.length - 1) {
            tempCompanyIds += $(tempCompany[i]).val();
          } else {
            tempCompanyIds += $(tempCompany[i]).val() + ",";
          }
        }

        for (var i = 0; i < oldLen; i++) {
          if (tempCompanyIds.indexOf(oldCompany[i].corpNumber) === -1) {
            delCompany.push(oldCompany[i]);
          }
        }
      } else {
        delCompany = oldCompany;
      }

      for (var i = 0, addLen = addCompany.length; i < addLen; i++) {
        var corpGroupRelaInfos = {};
        corpGroupRelaInfos.corpNumber = $(addCompany[i]).val();
        corpGroupRelaInfos.corpName = $(addCompany[i])
          .parents("label")
          .text();
        corpGroupRelaInfos.groupType = groupType;
        corpGroupRelaInfos.groupID = groupID;
        corpGroupRelaInfos.isDelete = 0;
        param.push(corpGroupRelaInfos);
      }
      for (var i = 0, delLen = delCompany.length; i < delLen; i++) {
        var corpGroupRelaInfos = {};
        corpGroupRelaInfos.keyID = delCompany[i].keyID;
        corpGroupRelaInfos.corpNumber = delCompany[i].corpNumber;
        corpGroupRelaInfos.corpName = delCompany[i].corpName;
        corpGroupRelaInfos.groupType = groupType;
        corpGroupRelaInfos.groupID = groupID;
        corpGroupRelaInfos.isDelete = 1;
        param.push(corpGroupRelaInfos);
      }
      if (!addCompany.length && !delCompany.length) {
        layer.alert("请先修改企业再保存！");
        return false;
      }

      var exParam = {};
      for (var i = 0; i < groupParam["" + groupType].length; i++) {
        var tmpVal = groupParam["" + groupType][i];
        exParam["" + tmpVal] = $.queryString(tmpVal);
      }

      $.ajax({
        type: "post",
        url: "/sortRuleManage/saveSuitCompany",
        beforeSend: function() {
          layer.load(2);
        },
        data: {
          param: JSON.stringify(param),
          exParam: JSON.stringify(exParam)
        },
        success: function(data) {
          layer.closeAll();
          if (data) {
            data = JSON.parse(data);
            if (data.success) {
              if (data.data) {
                layer.msg(
                  "操作成功",
                  {
                    icon: 1,
                    time: 2000
                  },
                  function() {
                    // 1.服务费 2.搭售规则 3.排序规则
                    var groupType = $("input[name='groupType']").val();
                    var url = "";
                    if (groupType === "3") {
                      url = "/sortRuleManage";
                    }
                    window.location.href = url;
                  }
                );
              }
            } else {
              layer.alert(data.msg);
            }
          } else {
            layer.alert("系统错误!");
          }
        }
      });
    },
    /**
     * 取消添加适用企业
     */
    cancelBtn: function() {
      var groupType = $("input[name='groupType']").val();
      var url = "";
      if (groupType === "3") {
        url = "/sortRuleManage";
      }
      window.location.href = url;
    },
    /**
     * 全选功能
     *
     * @param name
     */
    selectAll: function(name) {
      $("input[name='" + name + "']").attr("checked", "checked");
      this.add(null, $("input[name='" + name + "']:checked"));
    },
    /**
     * 反选功能
     *
     * @param name
     */
    selectNull: function(name) {
      var arrCarrier = $("input[name='" + name + "']");
      for (var i = 0, len = arrCarrier.length; i < len; i++) {
        if ($(arrCarrier[i]).attr("checked") === "checked") {
          $(arrCarrier[i]).removeAttr("checked");
        } else {
          $(arrCarrier[i]).attr("checked", "checked");
        }
      }
      this.add(null, $("input[name='" + name + "']:checked"));
    },
    /**
     * 获取要操作的信息
     */
    getInfo: function() {
      var conditionObj = $(".queryTable").find(
        "select,input[type='text'],input[type='hidden'],input[type='radio']:checked,input[type='checkbox']:checked"
      );
      var conditionJson = $(conditionObj).serializeJson();
      return conditionJson;
    },
    /**
     * 组装批量id信息
     *
     * @param type
     *            0.获取值用val() 1.获取值用html()
     * @param mark
     *            隐藏域控件name属性或者type为0的class
     * @returns 结果
     */
    getparam: function(type, mark) {
      var obj;
      var len;
      var data = "";
      if (type) {
        obj = $("." + mark);
      } else {
        obj = $("input[name='" + mark + "']:checked");
      }
      len = obj.length;
      for (var i = 0; i < len; i++) {
        if (i === len - 1) {
          data += $(obj[i]).val() ? $(obj[i]).val() : $(obj[i]).html();
        } else {
          data += $(obj[i]).val() ? $(obj[i]).val() : $(obj[i]).html() + ",";
        }
      }
      return data;
    },
    /**
     * 添加tr展示
     */
    add: function(e, arrVal) {
      var val,
        html = "",
        id = "";

      if (e) {
        val = $(e)
          .parents("label")
          .text();
        id = $(e).val();
        html =
          "<tr><td style='text-align: left' class='single-air' suitID='" +
          id +
          "'>" +
          val +
          "</td><td><a class='del' href='javascript:void(0)'>删除</a></td></tr>";

        total = parseInt($(".total").html(), 10) + 1;
      }
      if (arrVal) {
        $(".show-list").html("");
        total = 0;
        for (var i = 0, len = arrVal.length; i < len; i++) {
          html +=
            "<tr><td style='text-align: left' class='single-air' suitID='" +
            $(arrVal[i]).val() +
            "'>" +
            $(arrVal[i])
              .parents("label")
              .text() +
            "</td><td><a class='del' href='javascript:void(0)'>删除</a></td></tr>";
        }
        total = arrVal.length;
      }
      $(".show-list").append(html);

      $(".total").html(total);
    },
    /**
     * 删除tr展示
     */
    delLabel: function(e, val) {
      var trlList = $(".show-list tr");
      if (e) {
        val = $(e).attr("suitID");
        var companyList = $("input[name='suitCompany']");
        for (var i = 0, len = companyList.length; i < len; i++) {
          if ($(companyList[i]).attr("suitID") === val) {
            $(companyList[i]).removeAttr("checked");

            break;
          }
        }
        total = parseInt($(".total").html(), 10) - 1;
      }
      if (val) {
        for (var i = 0, len = trlList.length; i < len; i++) {
          if (
            $(trlList[i])
              .find(".single-air")
              .attr("suitID") === val
          ) {
            total = parseInt($(".total").html(), 10) - 1;
            $(trlList[i]).remove();
          }
        }
      }

      if (total <= 0) {
        total = 0;
      }
      $(".total").html(total);
    },
    search: function(val) {
      if (val) {
        var companyList = $("input[name='suitCompany']");
        $(".data-list label").hide();
        comm.getInfo.companyList(
          0,
          "",
          "",
          function(data) {
            var companyIds = "";
            if (data.length) {
              for (var i = 0; i < data.length; i++) {
                if (i === data.length - 1) {
                  companyIds += data[i].companyNO;
                } else {
                  companyIds += data[i].companyNO + ",";
                }
              }
              for (var i = 0, len = companyList.length; i < len; i++) {
                if (companyIds.indexOf($(companyList[i]).val()) !== -1) {
                  $(companyList[i])
                    .parents("label")
                    .show();
                }
              }
            } else {
              layer.alert("没有匹配值");
            }
          },
          val
        );
      } else {
        $(".data-list label").show();
      }
    }
  };
  var mainMoudle = {
    initData: function() {
      //comm.getInfo.getTmcAccount("", "", "safeUrl");
      // 1.查看详情 2.修改 undefined 新增
      var key = $("input[name='groupID']").val();
      // var type = $("input[name='type']").val();
      // 1.服务费 2.搭售规则 3.排序规则
      var groupType = $("input[name='groupType']").val();
      var url = "";

      comm.getInfo.companyList(1, "data-list-left", 2, function() {
        if (key) {
          if (groupType === "3") {
            url = "/sortRuleManage/queryList";
          }
          op.getInfoByID(key, url);
        }
      });

      /**
       * 添加效果
       */
      $("input[name='suitCompany']").live("click", function() {
        if ($(this).attr("checked") === "checked") {
          op.add(this);
        } else {
          op.delLabel($(this));
        }
      });
      /**
       * 删除效果
       */
      $(".del").live("click", function() {
        var e = $(this)
          .parent("td")
          .prev();
        op.delLabel(e);
      });

      /**
       * 保存操作
       */
      $("#saveSuitCompany").click(function() {
        op.saveSuitCompany();
      });
      /**
       * 取消操作
       */
      $("#cancelBtn").click(function() {
        op.cancelBtn();
      });

      /**
       * 全选or清除企业
       */
      $("input[name='selectAir']").click(function() {
        var val = $(this).val();
        if (val === "1") {
          op.selectAll("suitCompany");
        } else {
          op.selectNull("suitCompany");
        }
      });

      /**
       * 查询效果
       */
      $("#search").click(function() {
        var val = $(this)
          .parents(".search")
          .find("input")
          .val();
        op.search(val);
      });
    },

    /**
     * 入口函数
     */
    main: function() {
      this.initData();
    }
  };
  /**
   * 页面加载完成执行初始化操作
   */
  $(function() {
    mainMoudle.main();
    $.fn.dealIframeH();
  });
});
