// 我创建的搜索条件
let myuserId = '1'
let searchMyCreateObj = {
	myuserId: myuserId,
	selectType: '2',
	webStatus: 1,
	currentPage: 1,
	pageSize: 10,
	name: '',
	userAccount: ''
}
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

	var laytpl = layui.laytpl;
	var laypage = layui.laypage;
	getMyCreateData(searchMyCreateObj, laytpl, laypage)


	// 获取分享给我的数据
	let searchObj = {
		myuserId: '1',
		selectType: '2',
		webStatus: 2,
		currentPage: 1,
		pageSize: 10
	}
	myTabAjax('/miyun/sys/UserPwdController/getAccountPwdList', 'get', searchObj).then((res) => {
		console.log(res.data)
		renderTrData(laytpl, res.data.records)
	})

	$('.search-button-click').on('click', function() {
		$('.search-input-account').map(function(key, v) {
			const keyMap = v.getAttribute('data-fields')
			searchMyCreateObj[keyMap] = v.value
		})
		getMyCreateData(searchMyCreateObj, laytpl, laypage)
	})

	// 点击跳转
	$('.using-info').on('click', function() {
		window.location.href = '/newTab/usingInfo.html'
		// window.open('/newTab/usingInfo.html')
	})

	// 新增账号
	$('.add-new-account').on('click', function() {
		window.open('/newTab/addNewAccount.html')
	})

	// 删除账号
	$('.del-account-record').on('click', function() {
		let delParams = []
		$('.my-create-checkbox').map(function(index, value) {
			// 表示选中
			if(value.checked) {
				delParams.push({typeId:parseInt(value.getAttribute('data-id'), 10)})
			}
		})


		myTabAjax('/miyun/sys/UserPwdController/deleteUserPwd', 'post', delParams).then((res) => {
			if(res.code === -1) {
				layer.msg(res.message);
			}else{
				getMyCreateData(searchMyCreateObj, laytpl, laypage)
			}
		})
	})
});


function renderMyCrateData(laytpl, result) {
	var data = { //数据
		list:result
	}
	let getTpl = document.getElementById('myCreateAccountList').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('createDataListResult').innerHTML = html;
		layuiForm.render();
	});
}

function renderTrData(laytpl, result) {
	var data = { //数据
		list:result
	}

	// $('.share-result-td').append(shareListHtml)

	var getTpl = document.getElementById('accountListData').innerHTML

	laytpl(getTpl).render(data, function(html){
		document.getElementById('share-data-list-result').innerHTML = html;
	});
}

function getMyCreateData(searchObj, laytpl, layPage) {
	// 获取我创建的数据
	myTabAjax('/miyun/sys/UserPwdController/getAccountPwdList', 'get', searchObj).then((res) => {
		renderMyCrateData(laytpl, res.data.records)

		//执行一个laypage实例
		layPage.render({
			elem: 'my-create-page' //注意，这里的 test1 是 ID，不用加 # 号
			,count: res.data.total //数据总数，从服务端得到
			,theme: '#1791FF'
			,jump: function(obj, first){
				//首次不执行
				if(!first){
					searchMyCreateObj.currentPage = obj.curr
					getMyCreateData(searchMyCreateObj, laytpl)
				}
			}
		});
	})
}
