layui.use(['layer', 'form'], function(){
	var layer = layui.layer
	,form = layui.form

	const formObj = {}
	let searchObj = {
		typeId: 2,
		myuserId: 1,
		accountType: 1,
		IsSorC: 1
	}

	// 判断是否有userid
	if(getQueryString('typeId')) {
		myTabAjax('/miyun/sys/UserPwdController/getUserPwdEntity', 'get', searchObj).then((res) => {
			$('.add-account-input').map(function(k, v){
				const keyMap = v.getAttribute('data-get-fields')
				v.value = res.data[keyMap]
			})
			$('.add-account-checkbox')[0].checked = res.data.isagaincheck === 1?true: false
			// 重新渲染
			form.render()
		})
	}

	$(".auto-login-submit-new-account").on('click', function() {
		$('.add-account-input').map(function(k, v){
			const keyMap = v.getAttribute('data-fields')
			formObj[keyMap] = v.value
		})
		formObj.isAgainCheck = $('.add-account-checkbox')[0].checked?1:2

		// 先写死userid
		formObj.myuserId = '1'
		formObj.accountType = 1
		formObj.typeData = [{
			name: formObj.name,
			url: formObj.website
		}]

		delete formObj.name
		delete formObj.website


		if(getQueryString('typeId')) {
			let editParam = Object.assign({}, formObj)
			editParam.name = editParam.typeData[0].name
			editParam.url = editParam.typeData[0].url
			editParam.typeId = getQueryString('typeId')
			delete editParam.typeData

			let requestUrl = '/miyun/sys/UserPwdController/updateMyUserPwd'
			myTabAjax(requestUrl, 'post', editParam).then((res) => {
				if(res.code === 10000) {
					layer.msg('编辑成功')
				}
			})
		}else{
			let requestUrl = '/miyun/sys/UserController/saveMyUserPwd'
			myTabAjax(requestUrl, 'post', formObj).then((res) => {
				if(res.code === 10000) {
					layer.msg('新增成功')
				}
			})
		}

	})

	// 清除操作
	$('.auto-login-clear-handler').on('click', function() {
		clearInputMethods()

		// 重新渲染
		form.render()
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
