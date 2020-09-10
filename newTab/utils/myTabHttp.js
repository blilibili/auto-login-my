const hostname = 'http://116.85.11.146:9021'

// 获取浏览器中存储的token
function getChromeToken() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('token', function(result) {
			if(result.token) {
				resolve(result.token)
			}else {
				resolve('')
			}
		});
	})
}

function getLoginData() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(['userid', 'userName'], function(result) {
			resolve({userId: result.userid, userName: result.userName})
		});
	})
}


function setToken(loginData) {
	return new Promise((resolve, reject) => {
		getLoginToken(loginData).then((token) => {
			window.localStorage.setItem('token', token)
			chrome.storage.local.set({token: token}, function() {
				console.log("保存token:",token);
			});
			window.localStorage.setItem('token', token)
			resolve(token)
		})
	})
}



async function myTabAjax(url, methods, data, uid="", headers={
	'Content-Type':'application/json;charset=utf8;',
	'token': ''
}) {
	// 判断有没有token 没有就登录取
	// if(window.localStorage.getItem('token')) {
	// 	headers.token = window.localStorage.getItem('token')
	// }else{
	// 	// token过期，或者一开始登录
	// 	const loginData = {
	// 		userId: window.localStorage.getItem('userid'),
	// 		userName: window.localStorage.getItem('userName')
	// 		// userName: 'daniel'
	// 	}
	// }

	const loginData = await getLoginData()
	headers.token = await getChromeToken()
	return new Promise((resolve, reject) => {
		$.ajax({
			url: hostname + url,
			type: methods,
			headers: headers,
			data: methods === 'post'?JSON.stringify(data): data,
			dataType: "json",
			success: (result) => {
				console.log('结果结果', result)
				// 登录失效
				if(result.code === 50004) {
					setToken(loginData).then((value) => {
						console.log('设置token', value)
						myTabAjax(url, methods, data, uid, headers).then((val) => {
						  resolve(val)
            })
					})
          return
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
			url: hostname + '/miyun/sys/UserLoginController/getMyuserToken',
			type: 'get',
			headers: {'Content-Type':'application/json;charset=utf8;'},
			data: loginData,
			dataType: "json",
			success: (result) => {
				console.log('result', result)
				// 未激活状态
				if(result.code === 43007) {
					console.log('开始激活')
					window.localStorage.removeItem('token')
					goToActive({userName: loginData.userName, userId: loginData.userId}).then((value) => {
						$.ajax({
							url: hostname + '/miyun/sys/UserLoginController/getMyuserToken',
							type: 'get',
							headers: {'Content-Type':'application/json;charset=utf8;'},
							data: loginData,
							dataType: "json",
							success: (tokens) => {
								reslove(tokens.data.token)
							}
						})
					}, () => {
						$.ajax({
							url: hostname + '/miyun/sys/UserLoginController/getMyuserToken',
							type: 'get',
							headers: {'Content-Type':'application/json;charset=utf8;'},
							data: loginData,
							dataType: "json",
							success: (tokens) => {
								console.log('第二次请求token', tokens)
								reslove(tokens.data.token)
							}
						})
					})
				}else{
					reslove(result.data.token)
				}
			},
			error: (e) => {
				console.log('接口异常', e)
			},
			complete: (e) => {
			}
		})
	})
}

function goToActive (loginData) {
	return new Promise((reslove, reject) => {
		$.ajax({
			url: hostname + '/miyun/sys/UserLoginController/activationMiYunUser',
			type: 'post',
			headers: {'Content-Type':'application/json;charset=utf8;', 'token': ''},
			data: JSON.stringify({userName: loginData.userName, userId: loginData.userId}),
			dataType: "json",
			success: (result) => {
				console.log('激活',result)
				reslove(result)
			},
			error: (e) => {
				console.log('异常',e)
				reslove(e)
			},
			complete: (e) => {
			}
		})
	})
}

function getOffset() {
	return new Promise((reslove, reject) => {
		$.ajax({
			url: hostname + '/miyun/sys/UserPwdController/getTheOffset',
			type: 'get',
			headers: {'Content-Type':'application/json;charset=utf8;'},
			dataType: "json",
			success: (result) => {
				reslove(result.data.token)
			},
			error: (e) => {
				console.log('接口异常', e)
			},
			complete: (e) => {
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

/**
 * 明文
 * @param {*} plain
 */
function do_encrypt(plain) {
	const key = window.localStorage.offset
	var ctext = "";

	// do the encoding
	for( var i = 0; i < plain.length; i ++ ) {
		var pcode = plain.charCodeAt( i );
		pcode = pcode ^ key
		ctext += String.fromCharCode(pcode);
	}
	return window.btoa(ctext);
}

/**
 * 密文
 * @param {*} str
 */
function do_decrypt(str) {
	const key = window.localStorage.offset
	var ctext = window.atob(str)
	var plain = "";

	// do the encoding
	for( var i = 0; i < ctext.length; i ++ ) {
		var ccode = ctext.charCodeAt( i );
		ccode = ccode ^ key
		plain += String.fromCharCode(ccode);
	}

	return plain;
}
