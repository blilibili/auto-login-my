const hostname = 'http://120.78.84.243:9021'

async function myTabAjax(url, methods, data, headers={'Content-Type':'application/json;charset=utf8;', 'token': ''}) {
	// 判断有没有token 没有就登录取
	if(window.localStorage.token) {
		headers.token = window.localStorage.token
	}else{
		const loginData = {
			userId: '1',
			userName: 'daniel'
		}
		let token = await getLoginToken(loginData)
		headers.token = token
		window.localStorage.setItem('token', token)
	}

	return new Promise((resolve, reject) => {
		$.ajax({
			url: hostname + url,
			type: methods,
			headers: headers,
			data: methods === 'post'?JSON.stringify(data): data,
			dataType: "json",
			success: (result) => {
				// 登录失效
				if(result.code === 50004) {
					window.localStorage.removeItem('token')
					myTabAjax(url, methods, data, headers)
				}
				resolve(result)
			},
			error: (e) => {
				console.log('接口异常', e)
			}
		})
	})
}

function getLoginToken(loginData) {
	return new Promise((reslove, reject) => {
		$.ajax({
			url: hostname + '/miyun/sys/UserLoginController/getLoginMyUserIdExist',
			type: 'get',
			headers: {'Content-Type':'application/json;charset=utf8;'},
			data: loginData,
			dataType: "json",
			success: (result) => {
				reslove(result.data.token)
			},
			error: (e) => {
				console.log('接口异常', e)
			}
		})
	})
}

function getQueryString(par) {
	//获取当前URL
	var local_url = window.location.href;

	//获取要取得的get参数位置
	var get = local_url.indexOf(par +"=");

	if(get == -1){
		return false;
	}
	//截取字符串
	var get_par = local_url.slice(par.length + get + 1);
	//判断截取后的字符串是否还有其他get参数
	var nextPar = get_par.indexOf("&");

	if(nextPar != -1){
		get_par = get_par.slice(0, nextPar);
	}
	return get_par;
}
