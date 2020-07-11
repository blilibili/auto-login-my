layui.use(['laypage', 'laytpl'], function(){
	var laytpl = layui.laytpl;
	var laypage = layui.laypage;
	getUsingInfoList(laytpl, laypage)
});

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

function renderOftenAddress(laytpl, result) {
	var data = { //数据
		oftenAddress:result
	}
	let getTpl = document.getElementById('myUsingOftenAddress').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('often-address').innerHTML = html;
	});
}

function renderOftenIp(laytpl, result) {
	var data = { //数据
		oftenIp:result
	}
	let getTpl = document.getElementById('myUsingOftenIp').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('using-often-ip').innerHTML = html;
	});
}


function getUsingInfoList(laytpl, laypage) {
	// 获取我创建的数据
	let searchObj = {
		currentPage: 1,
		pageSize: 10
	}
	myTabAjax('/miyun/sys/UserLoginController/getUserDetailList', 'get', searchObj).then((res) => {
		console.log(res.data.common.commonAddress)
		// 拼接终端
		let terminalName = []
		res.data.common.commonTerminal.computerTerminal.forEach((v, k) => {
			terminalName.push('电脑:' + v)
		})
		res.data.common.commonTerminal.phoneTerminal.forEach((v, k) => {
			terminalName.push('手机:' + v)
		})
		renderOftenIp(laytpl, terminalName)
		renderOftenAddress(laytpl, res.data.common.commonAddress)
		renderUsingInfoData(laytpl, res.data.records)

		//执行一个laypage实例
		//执行一个laypage实例
		laypage.render({
			elem: 'using-info-table' //注意，这里的 test1 是 ID，不用加 # 号
			,count: res.data.total //数据总数，从服务端得到
			,theme: '#1791FF'
			,limits: [10,20,30,40]
			,curr: 1
			,layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
			,jump: function(obj, first){
				//obj包含了当前分页的所有参数，比如：
				console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
				console.log(obj.limit); //得到每页显示的条数

				//首次不执行
				if(!first){
					//do something
				}
			}
		});
	})
}
