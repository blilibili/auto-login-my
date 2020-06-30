layui.use(['layer', 'form', 'element', 'laytpl'], function(){
	var laytpl = layui.laytpl;

	let searchObj = {
		page: 1,
		pageSize: 10
	}

	renderMyCrateData(laytpl, [{name: ''}, {name: ''}])
	// 获取数据
	myTabAjax('/miyun/sys/ShareinfoWebController/page', 'get', searchObj).then((res) => {
		console.log(res.data)
		renderTrData(laytpl, res.data)
	})
});

function renderMyCrateData(laytpl, result) {
	var data = { //数据
		list:result
	}
	let getTpl = document.getElementById('myCreateAccountList').innerHTML
	laytpl(getTpl).render(data, function(html){
		document.getElementById('createDataListResult').innerHTML = html;

		$('.my-create-account').on('click', function() {

		})
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
