const hostname = 'http://116.85.11.146:9021'

async function myTabAjax(url, methods, data, uid="", headers={'Content-Type':'application/json;charset=utf8;', 'token': ''}) {
	// 判断有没有token 没有就登录取
	if(window.localStorage.token) {
		headers.token = window.localStorage.token
	}else{
		const loginData = {
			userId: uid,
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

const pwdkey = 18; //偏移量，后台获得

/**
 * 明文
 * @param {*} plain 
 * @param {*} key //偏移量，后台获得
 */
function do_encrypt(plain,key) {
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

	return ctext;
}

/**
 * 密文
 * @param {*} ctext 
 * @param {*} key //偏移量，后台获得
 */
function do_decrypt(ctext,key) {
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
