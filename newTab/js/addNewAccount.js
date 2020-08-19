const myuserId = window.localStorage.getItem("userid")
layui.use(['layer', 'form', 'laytpl', 'slider'], function(){
	var layer = layui.layer
	,form = layui.form
	,laytpl = layui.laytpl
	,slider = layui.slider

	// 判断是否有userid
	if(getQueryString('typeId')) {
		let param = {
			typeId:getQueryString('typeId'),
			accountType:1,
			IsSorC:getQueryString('IsSorC'),
		}
		console.log("param===>",param)
		myTabAjax('/miyun/sys/UserPwdController/getUserPwdEntity', 'get',param, myuserId).then((res) => {
			console.log(res.data)
			//给表单赋值
			form.val("formDemo", { 
				"website": res.data.url
				,"name": res.data.name
				,"userAccount" : res.data.userAccount
				,"userPassword" : res.data.userPassword
				,"isAgainCheck" : res.data.isAgainCheck === 1?"checked": ""
			});
		})
	}

	$(".add-account-tip").on('click',function(){
		layer.open({
			title: '帮助信息'
			,content: '每次使用该账号时，都需要进行指纹/扫码/密码验证'
		});     
	})

	$(".add-account-showPwd").on('click',function(){
		// if(!$("input[name='userPassword']").val())return
		if($("input[name='userPassword']").attr('data-isShow') === '0'){
			console.log("点击显示密码")
			$(this).attr("src","../img/showpwd.png")
			$("input[name='userPassword']").attr('type','text')
			$("input[name='userPassword']").attr('data-isShow','1')
		}else{
			console.log("点击影藏密码")
			$(this).attr("src","../img/hidepwd.png")
			$("input[name='userPassword']").attr('type','password')
			$("input[name='userPassword']").attr('data-isShow','0')
		}
		$("input[name='userPassword']").focus()
	})

	$(".add-account-autoPwd").on('click',function(){
		console.log("显示密码推荐")
		pwdLength = 20
		settingType = [1,1,1,1] //字符,大写,小写,数字

		const addNewAccountConfig = `<div>
			<img class="close-set-pass-config" style="position: absolute;top: 19px;right: 19px;width: 15px;height: 15px;cursor: pointer;" src="http://122.51.89.68:81/close.png" alt="">
			<div style="text-align: center;font-size: 16px;font-weight: bold;padding: 19px;">密云（密码设置）</div>
			<div class="auto-login-line"></div>
			<div class="auto-login-form">
				<div class="auto-login-flex-row">
					<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>生成密码</div>
					<input class="auto-login-input" type="text" placeholder="" id="accountPwd" value="" readonly>
					<div id="copybtn" style="position: absolute;top: 7px;right: 30px;color: #1791FF;font-size: 14px;cursor:pointer;">复制</div>
				</div>
				
				<div class="auto-login-flex-row">
					<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>密码设置</div>
				</div>
				
				<div class="auto-login-flex-row">
					<div class="auto-login-flex-col">密码设置</div>
					<div id="slide-pass-set"></div>
					<div id="slidePassSetVal">20</div>
				</div>
				
				<div class="auto-login-flex-row">
					<div class="auto-login-flex-col">字符设置</div>
					
					<form class="layui-form" action="">
					<div class="layui-form-item">
						<div style="margin-left: 20px;">
						<input type="checkbox" name="chrtype" lay-filter="chrtype" value="1" title="大写" checked lay-skin="primary">
						<input type="checkbox" name="chrtype" lay-filter="chrtype" value="2" title="小写" checked lay-skin="primary">
						<input type="checkbox" name="chrtype" lay-filter="chrtype" value="3" title="数字" checked lay-skin="primary">
						<input type="checkbox" name="chrtype" lay-filter="chrtype" value="0" title="字符" checked lay-skin="primary">
						</div>
					</div>
				</form>
				</div>
				
				<div class="auto-login-flex-row">
					<div class="auto-login-flex-col">安全级别</div>
					<div class="auto-login-safe-block">
						<div class="auto-login-safe-col auto-login-safe-col-checked" id="1"></div>
						<div class="auto-login-safe-col auto-login-safe-col-checked" id="2"></div>
						<div class="auto-login-safe-col auto-login-safe-col-checked" id="3"></div>
						<span style="margin-left: 3px;" id="auto-login-safe-txt">低</span>
					</div>
				</div>
			</div>
			
			<div class="auto-login-line" style="margin: 15px 0;"></div>
			<div class="button-controller-auto-login">
				<button type="button"  class="layui-btn layui-btn-normal auto-login-pass-set-use">使用</button>
			</div>
		</div>`

		const renderAccountNewModalDom = createModal(550, 400, 'add-new-account-modal')
		var getTpl =  addNewAccountConfig
		laytpl(getTpl).render({list: []}, function(html){
			$(renderAccountNewModalDom).append(html)
		});

		$("#accountPwd").val(autoCreatePwd())

		//重新渲染
		form.render();

		form.on('checkbox(chrtype)', function(data){
			settingType[data.value] = data.elem.checked?1:0
			setTimeout(()=>{
				$("#accountPwd").val(autoCreatePwd())
			},500)
		});

		let sliderTimer = false
		//渲染
		slider.render({
			elem: '#slide-pass-set',  //绑定元素
			max:30, //长度范围0-30
			value:20, //默认长度20位
			theme:'#90D5FE',
			change: function(value){
				$("#slidePassSetVal").html(value) //动态获取滑块数值

				sliderTimer = true
				pwdLength = parseInt(value)
				setTimeout(()=>{
					if(sliderTimer)$("#accountPwd").val(autoCreatePwd())
					sliderTimer = false
				},500)

			}
		});

		$("#accountPwd").on('click',function(){
			console.log("重新生成密码")
			$("#accountPwd").val(autoCreatePwd())
		})

		$("#copybtn").on('click',function(){
			console.log("点击复制")
			var aux = document.createElement("input");
			aux.setAttribute("value", $("#accountPwd").val());
			document.body.appendChild(aux);
			aux.select();
			document.execCommand("copy");
			document.body.removeChild(aux);
		});

		$('.close-set-pass-config').on('click', function() {
            $('.add-new-account-modal').remove()
		})
		
		$('.auto-login-pass-set-use').on('click', function() {
            console.log('提交')
            $("input[name='userPassword']").val($("#accountPwd").val())
            $('.add-new-account-modal').remove()
        })
	})

	form.verify({
		name: function(value, item){ //value：表单的值、item：表单的DOM对象
			if(!value){
				return '名称不能为空';
			}
		}
	
	});

	form.on('submit(*)', function(data){
		if(getQueryString('typeId')) {
			let param = {
				accountType:1,
				isAgainCheck:data.field.isAgainCheck?1:2,
				typeId:getQueryString('typeId'),
				userAccount:data.field.userAccount,
				userPassword:data.field.userPassword,
				name:data.field.name,
				url:data.field.website,
			}
			let requestUrl = '/miyun/sys/UserPwdController/updateMyUserPwd'
			myTabAjax(requestUrl, 'post', param, myuserId).then((res) => {
				if(res.code === 10000) {
					layer.msg('编辑成功')
				}else{
					layer.msg(res.message)
				}
			})
		}else{
			let param = {
				accountType:1,
				isAgainCheck:data.field.isAgainCheck?1:2,
				typeData : [{
					name: data.field.name,
					url: data.field.website
				}],
				userAccount:data.field.userAccount,
				userPassword:data.field.userPassword,
			}
			console.log("提交表单：",param)
			let requestUrl = '/miyun/sys/UserPwdController/saveMyUserPwd'
			myTabAjax(requestUrl, 'post', param, myuserId).then((res) => {
				if(res.code === 10000) {
					layer.msg('新增成功')
				}else{
					layer.msg(res.message)
				}
			})
		}
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});

});

function createModal(width=500, height=500, modalClassName) {
    const modalDom = document.createElement('div')
    modalDom.className = modalClassName || 'alert-auto-login-modal'
    $(modalDom).css({width: width, height: height, backgroundColor: 'white',border: '1px solid #e5e5e5', position: 'absolute', top: '50%', left: '50%', zIndex: 10001, marginLeft: -(width/2) + 'px', marginTop: -(height/2) + 'px'})
    document.body.appendChild(modalDom)
    return modalDom
}

let pwdLength = 20
let settingType = [1,1,1,1] //字符,大写,小写,数字

//设置密码等级
function pwdSafe(pwd) {
    //判断密码等级
    let settingTypeL = 0
    settingType.forEach(item=>{
        settingTypeL += item
    })
    let safeList = ['低','中','高']
    let index = 3
    if(settingTypeL === 1 || pwd.length <= 10)index = 1
    else if((settingTypeL === 2 && pwd.length > 10) || (settingTypeL === 3 && (pwd.length > 10 || pwd.length < 20)))index = 2
    else if((settingTypeL === 3 && pwd.length >= 20) || (settingTypeL === 4 && pwd.length > 10))index = 3
    $('.auto-login-safe-col').each((ids,val)=>{
        if($(val).attr('id') <= index){
            $(val).addClass("auto-login-safe-col-checked")
        }else{
            $(val).removeClass("auto-login-safe-col-checked")
        }
    })
    $('#auto-login-safe-txt').html(safeList[index-1])
}

//自动生成复杂密码
function autoCreatePwd(){
    // let pwdLength = 20
    if(pwdLength < 1){
        return '';//密码长度不能为0
    }
    // let settingType = [1,1,1,1] //大写,小写,数字,字符
    console.log("settingType:",settingType)
    let settingTypeL = 0
    settingType.forEach(item=>{
        settingTypeL += item
    })
    console.log("settingTypeL:",settingTypeL)
    if(settingTypeL < 1){
        return '';//字符设置不能为空
    }

    let safeStatic = 1 //1,2,3 低,中,高
    let retPwd = ''

    let pwdLib = [
        settingType[0] && '~!@#￥%^&*()_-+=|{}:"<>?/\\'.split(""),
        settingType[1] && Array.from(Array(26),(v,k)=>{
            return String.fromCharCode(k+65)
        }),
        settingType[2] && Array.from(Array(26),(v,k)=>{
            return String.fromCharCode(k+97)
        }),
        settingType[3] && Array.from(Array(10),(v,k)=>{
            return k
        }),
    ]

    console.log("pwdLib:",pwdLib)
    let count = parseInt(pwdLength/settingTypeL)
    console.log("pwdLength:",pwdLength)
    console.log("count:",count)
    //先判断是否可以均分
    if(pwdLength%settingTypeL === 0){
        console.log("均分")
        let list = (settingType[0] ? getRandomArrayElements(pwdLib[0],count) : '') + (settingType[1] ? getRandomArrayElements(pwdLib[1],count) : '') + (settingType[2] ? getRandomArrayElements(pwdLib[2],count) : '') + (settingType[3] ? getRandomArrayElements(pwdLib[3],count) : '')
        retPwd = upsetArr(Array.from(list)).join('')
    }else {
        console.log("不可均分")
        //不可以均分，每多一个，排序在前的数列多一位
        let remainder = pwdLength%settingTypeL
        console.log("remainder：",remainder)
        let list = (settingType[0] ? getRandomArrayElements(pwdLib[0],count+(--remainder>=0?1:0)) : '') + (settingType[1] ? getRandomArrayElements(pwdLib[1],count+(--remainder>=0?1:0)) : '') + (settingType[2] ? getRandomArrayElements(pwdLib[2],count+(--remainder>=0?1:0)) : '') + (settingType[3] ? getRandomArrayElements(pwdLib[3],count) : '')
        retPwd = upsetArr(Array.from(list)).join('')
    }
    setTimeout(()=>{
        pwdSafe(retPwd)
    },200)
    return retPwd
}

//获取指定区间范围随机数，包括lowerValue和upperValue
function randomFrom(lowerValue,upperValue)
{
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

function getRandomArrayElements(arr, count) {
    let i = arr.length-1
    let temp = []
    while (count-- > 0) {
        let index = randomFrom(0,i);
        temp.push(arr[index]);
    }
    return temp.join('');
}

function upsetArr(arr){
    return arr.sort(function(){return Math.random()-0.5})
}

function upsetArr(arr){
    return arr.sort(function(){return Math.random()-0.5})
}