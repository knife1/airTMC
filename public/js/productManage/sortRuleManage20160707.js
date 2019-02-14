define(["render", "jsrenderPagination", "jqueryTools"], function () {
	var op = {
		/**
		 * 列表查询
		 */
		queryList: function () {
			var condition = op.getInfo();
			var test = "tes";
			$.pagination({
				beforeSend: function () {
					layer.load();
				},
				url: "/sortRuleManage/queryList", // 请求url
				templateId: "sortRuleListTemp", // 模版id
				updateId: "sortRuleList", // 表格修改id
				data: {
					param: JSON.stringify(condition)
					// 条件
				},
				callBack: function (data) {
					layer.closeAll("loading");
					if (data) {
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
							data.dataInfo = res;
						} else {
							layer.alert(data.msg);
						}
					}
					return data;
				},
				pagerSuccess: function () {
					$.fn.dealIframeH();
				}
			});
		},
		/**
		 * 删除操作
		 * @param e 当前对象
		 * 
		 */
		delSortRule: function (e) {
			layer.confirm("确认删除?", function () {
				var ID = $(e).parents("tr").find("input[name='groupID']").val();
				var param = {
					groupID: ID
				};
				$.ajax({
					type: "post",
					url: "/sortRuleManage/delSortRule",
					data: {
						param: JSON.stringify(param)
					},
					beforeSend: function () {
						layer.load();
					},
					success: function (data) {
						layer.closeAll();
						if (data) {
							var res = JSON.parse(data);
							if (res.success) {
								if (res.data) {
									layer.msg("删除成功", {
										icon: 1,
										time: 2000
									}, function () {
										op.queryList();
									});
								} else {
									layer.alert("删除失败");
								}
							} else {
								layer.alert(res.msg);
							}
						}
					}
				});
			});


		},
		/**
		 * 获取要操作的信息
		 */
		getInfo: function () {
			var conditionObj = $(".queryTable").find("select,input[type='text'],input[type='hidden']");
			var conditionJson = $(conditionObj).serializeJson();
			return conditionJson;
		}
	};
	var mainMoudle = {
		initData: function () {
			$("#query-btn").click(function () {
				op.queryList();
			});
			$(".delete").live("click", function () {
				op.delSortRule(this);
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