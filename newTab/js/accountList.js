// 当前的currentTabId
var currentTabId = 1
// 我创建的搜索条件
let myuserId = window.localStorage.getItem("userid")
let accountId = window.localStorage.getItem('accountId')
let searchMyCreateObj = {
	selectType: '2',
	webStatus: 1,
	currentPage: 1,
	pageSize: 10
}
let total = 0
var layuiForm


layui.use(['layer', 'form', 'element', 'laytpl', 'laypage'], function(){
	// 获取小慧二维码
	layuiForm = layui.form;
	/*
	myTabAjax('/miyun/sys/UserLoginApiController/getQRCode?width=140&height=140', 'post', {width: 140, height: 140}).then((res) => {
		$('.xh-login-scan-image')[0].src = 'data:image/png;base64,' + res.data.QRCode

		// 生成扫码登录socket
		let socket = new WebSocket("wss://appcc.pispower.com/connection/wait?key=8" + res.data.k)
		socket.onmessage = (msg) => {
			let scanReturn = JSON.parse(msg.data)
			console.log(scanReturn)
			if(scanReturn.action === 'login'){
				let auth = scanReturn.data.auth
			}
		}

	})*/

	layuiForm.on("checkbox(allCheck)", function(data){
        console.log(data);
        console.log(data.elem.checked);
        if (data.elem.checked) {
            //动态设置全选按钮颜色，不可以这里设置，这里设置后，前端选然后不会有效果的，
            //猜测原因是，form.render("checkbox"); 导致的，设置后layui又渲染了，把我自己设置的颜色覆盖了。所以设置需要在渲染后再设置，就等于是用我的css覆盖了layui的css
            $(".my-create-checkbox").each(function(){
                $(this).prop('checked', true);
            });
        } else {
            $(".my-create-checkbox").each(function(){
                $(this).prop('checked',  false);
            });
        }
        layuiForm.render("checkbox");
	});

	var element = layui.element;
	//监听Tab切换，以改变地址hash值
	element.on('tab(docDemoTabBrief1)', function(data){
		console.log(this); //当前Tab标题所在的原始DOM元素
		console.log(data.index); //得到当前Tab的所在下标
		console.log(data.elem); //得到当前的Tab大容器
		currentTabId = data.index + 1
		if(data.index){
			//分享给我的查询
			$(".button-controler-list").attr("style","display:none;")
			$("#search1").attr("style","display:none;")
			$("#search2").attr("style","")
			$(".search-button-click").attr("data-id","2")
		}else{
			//我创建的
			$(".button-controler-list").attr("style","")
			$("#search1").attr("style","")
			$("#search2").attr("style","display:none;")
			$(".search-button-click").attr("data-id","1")
		}
	});

	var laytpl = layui.laytpl;
	var laypage = layui.laypage;

	renderUserInfo(laytpl, {
		chatServerName: window.localStorage.getItem('chatServerName') || '',
		nickName: window.localStorage.getItem('nickname') || '',
		avatar: window.localStorage.getItem('avatar') || '',
	})

	getAccountPwdList(searchMyCreateObj, laytpl, laypage , 1)

	getAccountPwdList(searchMyCreateObj, laytpl, laypage , 2)


	$('.search-button-click').on('click', function(item) {
		$('.search-input-account').map(function(key, v) {
			const keyMap = v.getAttribute('data-fields')
			searchMyCreateObj[keyMap] = v.value
		})

		currentTabId = item.target.dataset.id
		if(item.target.dataset.id === '1'){
			//我创建的
			console.log("查询我创建的")
			getAccountPwdList(searchMyCreateObj, laytpl, laypage , 1)
		}else {
			//分享给我的
			console.log("查询分享给我的")
			getAccountPwdList(searchMyCreateObj, laytpl, laypage, 2)
		}

	})

	// 点击跳转
	$('.using-info').on('click', function() {
		window.location.href = '/newTab/usingInfo.html'
		// window.open('/newTab/usingInfo.html')
	})

	// 新增账号
	$('.add-new-account').on('click', function() {
		window.location.href = '/newTab/addNewAccount.html'
	})

	// 删除账号
	$('.del-account-record').on('click', function() {
		let checkedArr = []
		$('.my-create-checkbox').map(function(index, value) {
			// 表示选中
			if(value.checked) {
				checkedArr.push({typeId:parseInt(value.getAttribute('data-id'), 10)})
			}
		})
		if(checkedArr.length === 0) {
			layer.msg('请至少选择一条记录')
			return
		}
		layer.confirm('是否删除?', function(index){
			let delParams = {
				typeId:[]
			}
			$('.my-create-checkbox').map(function(index, value) {
				// 表示选中
				if(value.checked) {
					delParams.typeId.push({typeId:parseInt(value.getAttribute('data-id'), 10)})
				}
			})
			console.log("delParams>>>>",delParams)
			myTabAjax('/miyun/sys/UserPwdController/deleteUserPwd', 'post', delParams, myuserId).then((res) => {
				if(res.code === 10000) {
					layer.msg('删除成功');
					layer.close(index);

					// 最后一条被删除
					if(total % 10 === 1) {
						searchMyCreateObj.currentPage--
					}
					getAccountPwdList(searchMyCreateObj, laytpl, laypage , currentTabId)
					// window.location.reload()
				}else{
					layer.msg(res.message);
				}
			})

		});

	})

	$(".account-verify-close-image").on('click', function() {
		$(".auto-login-back-wall").attr('style','display:none;')
		$(".account-verify-modal").attr('style','display:none;')
	})

});

function renderUserInfo(laytpl, result) {
	let data = result
	let getTpl = document.getElementById('auto-login-my-user-info-tpl').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('auto-login-my-user-info').innerHTML = html;
	});
}

function renderMyCrateData(laytpl, result) {
	var data = { //数据
		list:result
	}
	// 若为空 则加入 暂无数据提示
	if(result.length === 0) {
		if($('.my-create-table')[0].innerHTML.toString().indexOf('暂无数据') === -1){
			$('.my-create-table').append('<div class="no-record">暂无数据</div>')
		}
	}

	let getTpl = document.getElementById('myCreateAccountList').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('createDataListResult').innerHTML = html;
		layuiForm.render();
	});

	$(".my-create-account").map(function(element, index, array) {
		$(index).on('click',function(item){
			window.location.href = './addNewAccount.html?typeId='+item.target.dataset.typeid+"&IsSorC="+item.target.dataset.issorc
			//二次验证
			// $(".auto-login-back-wall").attr('style','')
			// $(".account-verify-modal").attr('style','')
		})
	});
}

function renderTrData(laytpl, result) {
	var data = { //分享给我的数据
		list:result
	}

	// 若为空 则加入 暂无数据提示
	if(result.length === 0) {
		if($('.my-share-table')[0].innerHTML.toString().indexOf('暂无数据') === -1) {
			$('.my-share-table').append('<div class="no-record">暂无数据</div>')
		}
	}

	// $('.share-result-td').append(shareListHtml)

	var getTpl = document.getElementById('accountListData').innerHTML

	laytpl(getTpl).render(data, function(html){
		document.getElementById('share-data-list-result').innerHTML = html;
	});
}

// 获取分享给我的数据
function getAccountPwdList (searchObj, laytpl, layPage ,type) {
	const params = Object.assign({}, searchObj)
	params.webStatus = type
	params.pageSize = searchMyCreateObj.pageSize

	myTabAjax('/miyun/sys/UserPwdController/getAccountPwdList', 'get', params, myuserId).then((res) => {
		console.log('查询数据', res.data)
		if(res.code === 10000){
			total = res.data.total
			console.log('res.data', res.data)
			if(type === 1){
				renderMyCrateData(laytpl, res.data.records)
			}else{
				renderTrData(laytpl, res.data.records)
			}
			//执行一个laypage实例
			layPage.render({
				elem: type === 1 ? 'my-create-page' : 'my-share-page' //注意，这里的 test1 是 ID，不用加 # 号
				,count: res.data.total //数据总数，从服务端得到
				,theme: '#1791FF'
				,limit: searchMyCreateObj.pageSize
				,limits: [10,20,30,40]
				,curr: searchMyCreateObj.currentPage
				,layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
				,jump: function(obj, first){
					console.log('跳转', obj)
					//首次不执行
					if(!first){
						searchMyCreateObj.currentPage = obj.curr
						searchMyCreateObj.pageSize = obj.limit
						getAccountPwdList(searchMyCreateObj, laytpl, layPage , type)
					}
				}
			});

		}else{
			if(type === 1){
				renderMyCrateData(laytpl, [])
			}else{
				renderTrData(laytpl, [])
			}

			if(searchMyCreateObj.currentPage === 1){
				//执行一个laypage实例
				layPage.render({
					elem: type === 1 ? 'my-create-page' : 'my-share-page' //注意，这里的 test1 是 ID，不用加 # 号
					,count: 0 //数据总数，从服务端得到
					,theme: '#1791FF'
					,limit: searchMyCreateObj.pageSize
					,limits: [10,20,30,40]
					,curr: 1
					,layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
					,jump: function(obj, first){
						//首次不执行
						if(!first){
							searchMyCreateObj.currentPage = obj.curr
							searchMyCreateObj.pageSize = obj.limit
							getAccountPwdList(searchMyCreateObj, laytpl, layPage , type)
						}
					}
				});
			}
		}

	})
}

