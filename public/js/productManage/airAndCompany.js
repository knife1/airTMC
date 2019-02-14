/**
 * 获取航司和企业
 */
define(function () {
	return {
		getInfo: {
			/**
			 * @param ele
			 *            渲染控件的id或者class
			 * @param renderType
			 *            渲染方式 1.查询条件渲染 2.新增列表渲染
			 */
			airList: function (ele, renderType, callBack) {
				$.ajax({
					type: 'get',
					beforeSend: function () {
						layer.load(2);
					},
					url: "/commonData/getAirList",
					success: function (data) {
						layer.closeAll('loading');
						data = JSON.parse(data);
						if (data.success) {
							data = data.data;
							var html = "";
							if (renderType === 1) {
								html = "<option value=''>所有</option>";
							}
							if (data) {
								data = data.split(",");
								for (var i = 0, len = data.length; i < len; i++) {
									if (renderType === 1) {
										html += "<option value=" + data[i] + ">" + data[i] + "</option>";
									} else {
										html += " <label><input type='checkbox' class='' value='" + data[i] + "' name='carrier'>" + data[i] + "</label>";
									}
								}
								if (renderType === 1) {
									$("#" + ele).html(html);
								} else {
									$("." + ele).html(html);
								}
							}
							if (typeof (callBack) !== "undefined") {
								callBack();
							}
						}
					}
				});
			},
			/**
			 * @param isRender
			 *            是否渲染 0.不渲染 1 渲染
			 * @param ele
			 *            渲染控件的id或者class
			 * @param renderType
			 *            渲染方式 1.查询条件渲染 2.新增列表渲染
			 * @param callBack
			 *            回调函数
			 * @param companyName
			 *            公司名称
			 */
			companyList: function (isRender, ele, renderType, callBack, companyName) {
				$.ajax({
					type: 'post',
					url: "/commonData/getSuitCompany",
					beforeSend: function () {
						layer.load(2);
					},
					data: {
						companyName: companyName
					},
					success: function (data) {
						layer.closeAll('loading');
						var html = "";
						if (data) {
							data = JSON.parse(data);
							if (data.success) {
								var res = data.data.dataInfo;
								if (isRender) {
									for (var i = 0, len = res.length; i < len; i++) {
										if (renderType === 1) {
											html += "<option suitID='"+ res[i].companyNO +"'  value='" + res[i].companyNO + "'>" + res[i].companyName + "</option>";
										} else {
											html += " <label><input type='checkbox' class='' suitID='"+ res[i].companyNO +"' value='" + res[i].companyNO + "' name='suitCompany'>" + res[i].companyName + "</label>";
										}
									}
									if (renderType === 1) {
										$("#" + ele).html(html);
									} else {
										$("." + ele).html(html);
									}
									if (typeof (callBack) !== "undefined") {
										callBack();
									}
								} else {
									if (typeof (callBack) !== "undefined") {
										callBack(res);
									}
								}
							} else {
								layer.closeAll();
								layer.alert(data.message);
							}

						}

					}
				});
			},
			/**
			 * @param c1
			 *            政策链接
			 * @param c2
			 *            扣点链接
			 * @param c3
			 *            保险链接
			 */
			getTmcAccount: function (c1, c2, c3) {
				$.ajax({
					type: 'post',
					url: "/homeTicket/getTmcAccount",
					success: function (data) {
						if (data) {
							data = JSON.parse(data);
							if (data.code === 1) {
								var res = data.content;
								$.ajax({
									type: 'post',
									url: "/homeTicket/getURL",
									data: {
										name: res.platAccountNum,
										pwd: res.platPassWord
									},
									success: function (data) {
										var c = [c1, c2, c3];
										if (data) {
											var url = data.split(",");
											for (var i = 0; i < url.length; i++) {
												$("#" + c[i]).attr("href", url[i]);
											}
										}
									}
								});
							}
						}
					}
				});
			}
		}
	};
});