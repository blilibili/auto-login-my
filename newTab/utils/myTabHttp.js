const hostname = 'http://116.85.11.146:9021'

async function myTabAjax(url, methods, data, uid="", headers={'Content-Type':'application/json;charset=utf8;', 'token': ''}) {
	// 判断有没有token 没有就登录取
	if(window.localStorage.token) {
		headers.token = window.localStorage.token
	}else{
		// token过期，或者一开始登录
		const loginData = {
			userId: window.localStorage.getItem('userid'),
			userName: window.localStorage.getItem('userName')
			// userName: 'daniel'
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
				console.log('结果结果', result)
				// 登录失效
				if(result.code === 50004) {
					window.localStorage.removeItem('token')
					myTabAjax(url, methods, data, uid, headers)
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

var Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZ+/=abcdefghijklmnopqrstuvwxyz0123456789",
	encode: function(e) {
		var t = "";
		var n, r, i, s, o, u, a;
		var f = 0;
		e = Base64._utf8_encode(e);
		while (f < e.length) {
			n = e.charCodeAt(f++);
			r = e.charCodeAt(f++);
			i = e.charCodeAt(f++);
			s = n >> 2;
			o = (n & 3) << 4 | r >> 4;
			u = (r & 15) << 2 | i >> 6;
			a = i & 63;
			if (isNaN(r)) {
				u = a = 64
			} else if (isNaN(i)) {
				a = 64
			}
			t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
		}
		return t
	},
	decode: function(e) {
		var t = "";
		var n, r, i;
		var s, o, u, a;
		var f = 0;
		e = e.replace(/[^A-Za-z0-9+/=]/g, "");
		while (f < e.length) {
			s = this._keyStr.indexOf(e.charAt(f++));
			o = this._keyStr.indexOf(e.charAt(f++));
			u = this._keyStr.indexOf(e.charAt(f++));
			a = this._keyStr.indexOf(e.charAt(f++));
			n = s << 2 | o >> 4;
			r = (o & 15) << 4 | u >> 2;
			i = (u & 3) << 6 | a;
			t = t + String.fromCharCode(n);
			if (u != 64) {
				t = t + String.fromCharCode(r)
			}
			if (a != 64) {
				t = t + String.fromCharCode(i)
			}
		}
		t = Base64._utf8_decode(t);
		return t
	},
	_utf8_encode: function(e) {
		e = e.replace(/rn/g, "n");
		var t = "";
		for (var n = 0; n < e.length; n++) {
			var r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r)
			} else if (r > 127 && r < 2048) {
				t += String.fromCharCode(r >> 6 | 192);
				t += String.fromCharCode(r & 63 | 128)
			} else {
				t += String.fromCharCode(r >> 12 | 224);
				t += String.fromCharCode(r >> 6 & 63 | 128);
				t += String.fromCharCode(r & 63 | 128)
			}
		}
		return t
	},
	_utf8_decode: function(e) {
		var t = "";
		var n = 0;
		var r = c1 = c2 = 0;
		while (n < e.length) {
			r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r);
				n++
			} else if (r > 191 && r < 224) {
				c2 = e.charCodeAt(n + 1);
				t += String.fromCharCode((r & 31) << 6 | c2 & 63);
				n += 2
			} else {
				c2 = e.charCodeAt(n + 1);
				c3 = e.charCodeAt(n + 2);
				t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
				n += 3
			}
		}
		return t
	}
}

const pwdkey = 18; //偏移量，后台获得

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
		var ccode = pcode;
		if ( pcode >= 65 && pcode <= 90 ) {
			ccode = ( ( pcode - 65 ) + key * 1 ) % 26 + 65;
		}
		if ( pcode >= 97 && pcode <= 122 ) {
			ccode = ( ( pcode - 97 ) + key * 1 ) %26 + 97;
		}
		ctext += String.fromCharCode(ccode);
	}

	return Base64.encode(ctext);
}

/**
 * 密文
 * @param {*} str
 */
function do_decrypt(str) {
	const key = window.localStorage.offset
	var ctext = Base64.decode(str)
	var plain = "";

	// do the encoding
	for( var i = 0; i < ctext.length; i ++ ) {
		var ccode = ctext.charCodeAt( i );
		var pcode = ccode;
		if ( ccode >= 65 && ccode <= 90 ) {
			pcode = ( ( ccode - 65 ) - key * 1 +26 ) % 26 + 65;
		}
		if ( ccode >= 97 && ccode <= 122 ) {
			pcode = ( ( ccode - 97 ) - key * 1 + 26) % 26 + 97;
		}
		plain += String.fromCharCode(pcode);
	}

	return plain;
}
