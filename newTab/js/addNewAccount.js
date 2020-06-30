layui.use(['layer', 'form'], function(){
	var layer = layui.layer
	,form = layui.form

	const formObj = {}
	let searchObj = {}

	// 判断是否有userid
	if(getQueryString('userId')) {
		searchObj = {}
		myTabAjax('/miyun/sys/UserPwdController/getUserPwdEntity', 'get', formObj).then((res) => {

		})
	}

	$(".auto-login-submit-new-account").on('click', function() {
		$('.add-account-input').map(function(k, v){
			const keyMap = v.getAttribute('data-fields')
			formObj[keyMap] = v.value
		})
		formObj.isAgainCheck = $('.add-account-checkbox')[0].checked === 'on'?1:2

		// 先写死userid
		formObj.myuserId = '1'
		formObj.accountType = 1
		formObj.typeData = [{
			name: formObj.name,
			url: formObj.website
		}]

		delete formObj.name
		delete formObj.website


		let requestUrl = '/miyun/sys/UserController/saveMyUserPwd'


		myTabAjax(requestUrl, 'post', formObj).then((res) => {
			if(res.code === 10000) {
				layer.msg('新增成功')
			}
		})
	})

	// 清除操作
	$('.auto-login-clear-handler').on('click', function() {
		clearInputMethods()

		// 重新渲染
		form.render();
	})
});

function clearInputMethods() {
	$('.add-account-input').map(function(k, v){
		const keyMap = v.getAttribute('data-fields')
		if(keyMap === 'website') {
			v.value = 'http://'
		}else{
			v.value = ''
		}
	})

	$('.add-account-checkbox')[0].checked = false
}
