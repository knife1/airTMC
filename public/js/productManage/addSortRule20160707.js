/**
 * 
 */
define(["productManage/airAndCompany", "jqueryTools"], function ( comm) {
	var total;
	var op = {
		getInfoByID: function (key, type) {
			var param = {
				groupID: key,
				isGetDetail: 1
			};
			$.ajax({
				type: 'get',
				url: "/sortRuleManage/queryList",
				beforeSend: function () {
					layer.load(2);
				},
				data: {
					param: JSON.stringify(param),
					pageIndex: 1
				},
				success: function (data) {
					layer.closeAll();
					if (data) {
						data = JSON.parse(data);
						if (data.success) {
							data = data.data;
							var res = data.dataInfo;
							for (var i = 0; i < res.length; i++) {
								var company = res[i].corpInfos;
								var applyCorpName = "";
								if (company.length) {
									for (var j = 0, len = company.length; j < len; j++) {
										if (j === len - 1) {
											applyCorpName += company[j].corpName;
										} else {
											applyCorpName += company[j].corpName + ",";
										}
									}
									res[i].flightSortGroupInfo.applyCorpName = applyCorpName;
								}
							}
							if (type === "1") {
								op.seeDetial(res);
							}
							if (type === "2") {
								op.edit(res);
							}
						} else {
							layer.alert(data.msg);
						}
					}
				}
			});
		},
		/**
		 * 详情渲染数据
		 */
		seeDetial: function (data) {
			var res = data[0];
			var info = res.flightSortGroupInfo;
			var company = res.corpInfos;
			for (var name in info) {
				$("." + name).html(info[name]);
			}
			var carrierSort = info.carrierSort.split(","),
				len = carrierSort.length,
				html = "";

			for (var i = 0; i < len; i++) {
				html += "<label>" + carrierSort[i] + "</label>";
			}

			$(".data-list-right").html(html);
			$(".total").html(len);

			if (company.length) {
				var html = "";
				for (var i = 0; i < company.length; i++) {
					html += "<label>" + company[i].corpName + "</label>";
				}
				$(".air-list").html(html);
			}

			// $(".carrier").html(res.applyCarrier.replace(new RegExp(/(,)/g),'/'));
		},
		/**
		 * 修改数据渲染
		 */
		edit: function (data) {
			$(".queryTable input[type='checkbox']").removeAttr("checked");
			var res = data[0];
			var info = res.flightSortGroupInfo;
			var air = $("input[name='carrier']");

			$("input[name='groupName']").val(info.groupName);
			$("input[name='info']").val(info.applyCorpName);
			var reservationType = info.reservationType.split(",");
			if (reservationType.length === $("input[name='reservationType']").length - 1) {
				$("input[name='reservationType'][value='0']").attr("checked", "checked");
			}
			for (var i = 0; i < reservationType.length; i++) {
				$("input[name='reservationType'][value='" + reservationType[i] + "']").attr("checked", "checked");
			}

			$("input[name='effectiveTime']").val(info.effectiveTime);
			$("input[name='failureTime']").val(info.failureTime);

			$("input[name='defaultDisplay'][value='" + info.defaultDisplay + "']").attr("checked", "checked");

			for (var i = 0, len = air.length; i < len; i++) {
				var val = $(air[i]).val();
				if ((info.carrierSort).indexOf(val) !== -1) {
					$(air[i]).attr("checked", "checked");
				} else {
					$(air[i]).removeAttr("checked");
				}
			}
			var html = "",
				airList = info.carrierSort.split(","),
				len = airList.length;
			for (var i = 0; i < len; i++) {
				html += "<tr><td  style='width:150px;' class='single-air'>" + airList[i] + "</td><td><a class='top' href='javascript:void(0)'>置顶</a></td><td><a class='over' href='javascript:void(0)'>上移</a></td><td><a class='bottom' href='javascript:void(0)'>下移</a></td><td><a class='del' href='javascript:void(0)'>删除</a></td></tr>";
			}
			$(".show-list").html(html);
			$(".total").html(len);
			this.opBtnShow();
		},
		saveSortRule: function () {
			var param = this.getInfo();

			param.reservationType = this.getparam(0, "reservationType");
			param.carrierSort = this.getparam(1, "single-air");
			var type = $("input[name='type']").val();

			if (param.groupName === "") {
				layer.alert("规则名称不能为空！");
				return false;
			}

			if (!param.reservationType.length) {
				layer.alert("请选择预定类型！");
				return false;
			}
			if (!param.effectiveTime) {
				param.effectiveTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
			}
			if (!param.failureTime) {
				param.failureTime = moment("2999-12-29 23:59:59").format("YYYY-MM-DD HH:mm:ss");
			}
			$.ajax({
				type: "post",
				url: "/sortRuleManage/saveSortRule",
				beforeSend: function () {
					layer.load(2);
				},
				data: {
					param: JSON.stringify(param),
					type: type
				},
				success: function (data) {
					layer.closeAll();
					if (data) {
						data = JSON.parse(data);
						if (data.success) {
							if (data.data) {
								layer.msg("操作成功", {
									icon: 1,
									time: 2000
								}, function () {
									var info = $("input[name='info']").val();
									if (!info) {
										layer.confirm("已保存信息,请尽快分配适用企业", {
											btn: ["分配适用企业", "取消"]
										}, function () {
											var paramEx = "&reservationType=" + param.reservationType + "&defaultDisplay=" + param.defaultDisplay + "";
											if (type === "2") {
												window.location.href = "/sortRuleManage/suitCompany?groupType=3&&groupID=" + param.groupID + paramEx;
											}
											if (type === "0") {
												window.location.href = "/sortRuleManage/suitCompany?groupType=3&&groupID=" + data.data + paramEx;
											}
										}, function () {
											window.history.back();
										});
									} else {
										window.history.back();
									}

								});
							} else {
								layer.alert("操作失败");
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
		 * 全选功能
		 * 
		 * @param name
		 */
		selectAll: function (name) {
			$("input[name='" + name + "']").attr("checked", "checked");
			this.add(null, $("input[name='" + name + "']:checked"));
		},
		/**
		 * 反选功能
		 * 
		 * @param name
		 */
		selectNull: function (name) {
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
		getInfo: function () {
			var conditionObj = $(".queryTable").find("select,input[type='text'],input[type='hidden'],input[type='radio']:checked,input[type='checkbox']:checked");
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
		getparam: function (type, mark) {
			var obj;
			var len;
			var data = "";
			if (type) {
				obj = $("." + mark);
				len = obj.length;
				for (var i = 0; i < len; i++) {
					if (i === len - 1) {
						data += $(obj[i]).html();
					} else {
						data += $(obj[i]).html() + ",";
					}
				}
			} else {
				obj = $("input[name='" + mark + "']:checked");
				len = obj.length;
				for (var i = 0; i < len; i++) {
					if ($(obj[i]).val() !== "0") {
						if (i === len - 1) {
							data += $(obj[i]).val();
						} else {
							data += $(obj[i]).val() + ",";
						}
					}
				}
			}

			return data;
		},
		/**
		 * 添加tr展示
		 */
		add: function (e, arrVal) {
			var val, html = "";

			if (e) {
				val = $(e).val();
				html = "<tr><td  style='width:150px;' class='single-air'>" + val + "</td><td><a class='top' href='javascript:void(0)'>置顶</a></td><td><a class='over' href='javascript:void(0)'>上移</a></td><td><a class='bottom' href='javascript:void(0)'>下移</a></td><td><a class='del' href='javascript:void(0)'>删除</a></td></tr>";
				total = parseInt($(".total").html(), 10) + 1;
			}
			if (arrVal) {
				$(".show-list").html("");
				total = 0;
				for (var i = 0, len = arrVal.length; i < len; i++) {
					html += "<tr><td style='width:150px;' class='single-air'>" + $(arrVal[i]).val() + "</td><td><a class='top href='javascript:void(0)''>置顶</a></td><td><a class='over' href='javascript:void(0)'>上移</a></td><td><a class='bottom' href='javascript:void(0)'>下移</a></td><td><a class='del' href='javascript:void(0)'>删除</a></td></tr>";
				}
				total = arrVal.length;
			}
			$(".show-list").append(html);
			$(".total").html(total);
			this.opBtnShow();
		},
		/**
		 * 删除tr展示
		 */
		delLabel: function (e, val) {
			var trlList = $(".show-list tr");
			if (e) {
				val = $(e).html() || $(e).val();
				var airList = $("input[name='carrier']");
				for (var i = 0, len = airList.length; i < len; i++) {
					if ($(airList[i]).val() === val) {
						$(airList[i]).removeAttr("checked");
					}
				}
				total = parseInt($(".total").html(), 10) - 1;
			}
			if (val) {
				for (var i = 0, len = trlList.length; i < len; i++) {
					if ($(trlList[i]).find(".single-air").html() === val) {
						total = parseInt($(".total").html(), 10) - 1;
						$(trlList[i]).remove();
					}
				}
			}

			if (total <= 0) {
				total = 0;
			}
			$(".total").html(total);
			this.opBtnShow();
		},
		/**
		 * 操作按钮展示
		 */
		opBtnShow: function () {
			var trList, len = $(".show-list tr").length;

			if (len) {
				$(".show-list tr").find(".top").show();
				$(".show-list tr").find(".over").show();
				$(".show-list tr").find(".bottom").show();
				trList = $(".show-list tr:eq(0)");
				if (len === 1) {
					$(trList).find(".top").hide();
					$(trList).find(".over").hide();
					$(trList).find(".bottom").hide();
				} else {
					$(trList).find(".top").hide();
					$(trList).find(".over").hide();
					$(trList).find(".bottom").show();

					var trListBottom = $(".show-list tr:last");
					$(trListBottom).find(".bottom").hide();
				}
			}
		},
		/**
		 * 上移
		 */
		up: function (e) {
			var trThis = $(e).parent("td").parent("tr"),
				tr = $(trThis).prev();
			$(trThis).after(tr);
			this.opBtnShow();
		},
		/**
		 * 下移
		 */
		down: function (e) {
			var trThis = $(e).parent("td").parent("tr"),
				tr = $(trThis).next();
			$(tr).after(trThis);
			this.opBtnShow();
		},
		/**
		 * 置顶
		 */
		top: function (e) {
			var trThis = $(e).parent("td").parent("tr");
			$(".show-list").prepend(trThis);
			this.opBtnShow();
		},
		/**
		 * 添加控件的全选与取消选择事件
		 */
		addSelectEvent: function (name) {
			$("input[name='" + name + "']").live('click', function () {
				var val = $(this).val();
				if (val === "0") {
					if ($(this).attr("checked") === "checked") {
						$("input[name='" + name + "']").attr("checked", "checked");
					} else {
						$("input[name='" + name + "']").removeAttr("checked");
					}
				}
			});
		},
		search: function (val) {
			if (val) {
				var carrierList = $("input[name='carrier']");
				$(".data-list label").hide();
				for (var i = 0, len = carrierList.length; i < len; i++) {
					if ($(carrierList[i]).val() === val) {
						$(carrierList[i]).parents("label").show();
						break;
					}
					if (i === len - 1) {
						layer.alert("没有匹配值");
					}
				}
			} else {
				$(".data-list label").show();
			}
		}
	};
	var mainMoudle = {
		initData: function () {
			//comm.getInfo.getTmcAccount("policyUrl", "pointUrl", "safeUrl");
			// 1.查看详情 2.修改 undefined 新增
			var key = $("input[name='key']").val();
			var type = $("input[name='type']").val();
			if (key && type === "1") {
				op.getInfoByID(key, type);
			}
			if (type !== "1") {
				comm.getInfo.airList("data-list-left", 2, function () {
					op.getInfoByID(key, type);
				});
			}
			// 预定类型
			op.addSelectEvent("reservationType");
			/**
			 * 添加效果
			 */
			$("input[name='carrier']").live('click', function () {
				if ($(this).attr("checked") === "checked") {
					op.add(this);
				} else {
					op.delLabel(this);
				}
			});
			/**
			 * 删除效果
			 */
			$(".del").live('click', function () {
				var e = $(this).parents("tr").find(".single-air");
				op.delLabel(e);
			});
			/**
			 * 上移效果
			 */
			$(".over").live('click', function () {
				op.up(this);
			});
			/**
			 * 下移效果
			 */
			$(".bottom").live('click', function () {
				op.down(this);
			});
			/**
			 * 置顶效果
			 */
			$(".top").live('click', function () {
				op.top(this);
			});

			/**
			 * 保存操作
			 */
			$("#saveSortRule").click(function () {
				op.saveSortRule();
			});
			/**
			 * 查询效果
			 */
			$("#search").click(function () {
				var val = $(this).parents(".search").find("input").val();
				op.search(val);
			});

			/**
			 * 全选or清除航司
			 */
			$("input[name='selectAir']").click(function () {
				var val = $(this).val();
				if (val === "1") {
					op.selectAll("carrier");
				} else {
					op.selectNull("carrier");
				}
			});
			/**
			 * 返回操作
			 */
			$(".cancelBtn").click(function () {
				$.fn.goBack();
			});
		},

		/**
		 * 入口函数
		 */
		main: function () {
			this.initData();
		}
	};
	/**
	 * 页面加载完成执行初始化操作
	 */
	$(function () {
		mainMoudle.main();
		$.fn.dealIframeH();
	});
});