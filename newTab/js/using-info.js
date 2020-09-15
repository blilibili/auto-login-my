// 获取我创建的数据
let searchObj = {
	currentPage: 1,
	pageSize: 10
}
const myuserId = window.localStorage.getItem("userid")
layui.use(['laypage', 'laytpl'], function(){
	var laytpl = layui.laytpl;
	var laypage = layui.laypage;
	getUsingInfoList(searchObj,laytpl, laypage)
	// 渲染userInfo
	renderUserInfo(laytpl, {
		chatServerName: window.localStorage.getItem('chatServerName') || '',
		nickName: window.localStorage.getItem('nickname') || '',
		avatar: window.localStorage.getItem('avatar') || '',
	})

});

// 点击跳转
$('#backBtn').on('click', function() {
	history.back(-1)
})

function renderUserInfo(laytpl, result) {
	let data = result
	let getTpl = document.getElementById('auto-login-my-user-info-tpl').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('auto-login-my-user-info').innerHTML = html;
	});
}

function renderUsingInfoData(laytpl, result) {
	var oftenData = { //数据
		list:result
	}
	let getTpl = document.getElementById('myUsingInfoList').innerHTML
	laytpl(getTpl).render(oftenData, function(html){
		document.getElementById('using-info-table-result').innerHTML = html;
		result.map(function(val, key) {
			if(val.accountStatus === 4) {
				$('.problem-info')[key].style.color = '#222'
			}
		})
	});
}

let isShowMoreAddress = false
function renderOftenAddress(laytpl, result) {
	let commonAddressList = []
	let completeAddressList = []
	for (let i = 0; i < result.length; i++) {
		if(i < 2) {
			commonAddressList.push(result[i])
		}
		completeAddressList.push(result[i])
	}
	$("#often-address").attr('title',"常用地址："+result.toString())

	var data = { //数据
		oftenAddress:!isShowMoreAddress?commonAddressList:completeAddressList
	}
	let getTpl = document.getElementById('myUsingOftenAddress').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('often-address').innerHTML = html;
	});
}

let isShowMoreIp = false
function renderOftenIp(laytpl, result) {
	let commonTerminalList = []
	let titleList = []
	for (let i = 0; i < result.length; i++) {
		if(!isShowMoreIp) {
			if(i >= 2) {
				break
			}
		}
		if(result[i].type === 1){
			titleList.push("电脑："+result[i].name)
			commonTerminalList[i] = commonTerminalList[i] ? commonTerminalList[i] : ("电脑："+result[i].name)
		}
		if(result[i].type === 2){
			titleList.push("手机："+result[i].name)
			commonTerminalList[i] = commonTerminalList[i] ? commonTerminalList[i] : ("手机："+result[i].name)
		}
	}

	var data = { //数据
		oftenIp:commonTerminalList
	}
	$("#using-often-ip").attr('title',"常用终端："+titleList.toString())
	let getTpl = document.getElementById('myUsingOftenIp').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('using-often-ip').innerHTML = html;
	});
}


function getUsingInfoList(searchObj,laytpl, laypage) {
	console.log(searchObj)
	myTabAjax('/miyun/sys/UserLoginController/getUserDetailList', 'get', searchObj, myuserId).then((res) => {
		console.log('请求结果', res)
		// 拼接终端
		let terminalName = []
		if(res.data !== null) {
			if(res.data.common && res.data.common.commonTerminal.computerTerminal) {
				res.data.common.commonTerminal.computerTerminal.forEach((v, k) => {
					terminalName.push({type:1,name:v}) //type:1 电脑
				})
			}
			if(res.data.common && res.data.common.commonTerminal.phoneTerminal) {
				res.data.common.commonTerminal.phoneTerminal.forEach((v, k) => {
					terminalName.push({type:2,name:v}) //type:2 手机
				})
			}
			renderOftenIp(laytpl, terminalName)
			renderOftenAddress(laytpl,res.data.common.commonAddress)

			// 点击展开地址更多
			$('#more-address').on('click', function() {
				isShowMoreAddress = !isShowMoreAddress
				renderOftenAddress(laytpl,res.data.common.commonAddress)
			})
			// 点击展开ip更多
			$('#more-ip').on('click', function() {
				isShowMoreIp = !isShowMoreIp
				renderOftenIp(laytpl, terminalName)
			})

			renderUsingInfoData(laytpl, res.data.records)

			if(searchObj.currentPage === 1){
				//执行一个laypage实例
				laypage.render({
					elem: 'using-info-table' //注意，这里的 test1 是 ID，不用加 # 号
					,count: res.data.total //数据总数，从服务端得到
					,theme: '#1791FF'
					,limit: searchObj.pageSize
					,limits: [10,20,30,40]
					,curr: 1
					,layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
					,jump: function(obj, first){
						//obj包含了当前分页的所有参数，比如：
						console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
						console.log(obj.limit); //得到每页显示的条数
						console.log("first:",first)

						//首次不执行
						if(!first){
							searchObj.currentPage = obj.curr
							searchObj.pageSize = obj.limit
							getUsingInfoList(searchObj, laytpl,laypage)
						}
					}
				});
			}

		} else {
			$('#more-address').hide()
			$('#more-ip').hide()
			renderOftenIp(laytpl, terminalName)
			renderOftenAddress(laytpl,[])
			renderUsingInfoData(laytpl, [])

			if(searchObj.currentPage === 1){
				//执行一个laypage实例
				laypage.render({
					elem: 'using-info-table' //注意，这里的 test1 是 ID，不用加 # 号
					,count: 0 //数据总数，从服务端得到
					,theme: '#1791FF'
					,limit: searchObj.pageSize
					,limits: [10,20,30,40]
					,curr: 1
					,layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
					,jump: function(obj, first){
						//obj包含了当前分页的所有参数，比如：
						console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
						console.log(obj.limit); //得到每页显示的条数
						console.log("first:",first)

						//首次不执行
						if(!first){
							searchObj.currentPage = obj.curr
							searchObj.pageSize = obj.limit
							getUsingInfoList(searchObj, laytpl,laypage)
						}
					}
				});
			}
		}

	})
}
