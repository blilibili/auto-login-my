
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log(request, sender, sendResponse)
//     if(request.type === 'REQUEST_USERS_ALL'){
//         loginCommonMethods(request.data)
//
//     }
// });
var globalData = {
    myName: '',
    myUrl: '',
    myuserName: '',
    userName: 'daniel'
}

// 创建账号密码钥匙
function keyDomFunc(insertDom, callback=() => {}) {
    const keyDom = document.createElement('img')
    keyDom.src = 'http://122.51.89.68:81/key.png'
    keyDom.width = 30
    keyDom.height = 30
    keyDom.style.position = 'absolute'
    keyDom.style.top = 0
    keyDom.style.right = 0
    keyDom.style.cursor = 'pointer'
    keyDom.onclick = callback
    if(insertDom) {
        insertDom.parentNode.appendChild(keyDom)
    }
}

function createModal(width=500, height=500, modalClassName) {
    const modalDom = document.createElement('div')
    modalDom.className = modalClassName || 'alert-auto-login-modal'
    $(modalDom).css({width: width, height: height, backgroundColor: 'white', position: 'absolute', top: '50%', left: '50%', zIndex: 10001, marginLeft: -(width/2) + 'px', marginTop: -(height/2) + 'px'})
    document.body.appendChild(modalDom)
    return modalDom
}

// 查找页面中 登录的按钮
function findLoginButton() {
    const eles = document.getElementsByTagName("*")
    // 切割掉前八个头部
    let sliceEles = []
    let simLoginButton = []
    for(let i = 0;i < eles.length;i++){
        if(i > 7){
            sliceEles.push(eles[i])
        }
    }

    for(let i = 0;i < sliceEles.length;i++){
        if(sliceEles[i].innerText === '登录' || sliceEles[i].innerText === '登 录' || sliceEles[i].value === '登录'){
            simLoginButton.push(sliceEles[i])
        }
    }

    return simLoginButton
}

function createBackWall() {
    const modalDom = document.createElement('div')
    modalDom.className = 'auto-login-back-wall'
    document.body.appendChild(modalDom)
    return modalDom
}

function keyUsernameClick() {
    const modalDom = createModal(280, 208)

    let searchObj = {
        myuserId: 2,
        currentPage: 1,
        pageSize: 100,
        selectType: 2,
        // webStatus: 1
    }
    myTabAjax('/miyun/sys/UserPwdController/getAccountPwdList', 'get', searchObj).then((res) => {
        layui.use(['laytpl'], function() {
            createBackWall()
            var data = { //数据
                list: res.data.records
            }

            // $('.share-result-td').append(shareListHtml)
            var laytpl = layui.laytpl;
            var getTpl = noMatchingAccount

            laytpl(getTpl).render(data, function(html){
                $(modalDom).append(html)

                createAddAccountDom()

                $('.auto-login-flex-row').on('click', function() {
                    // 主键id 用于找账号密码
                    let keyId = this.getAttribute('data-typeId')
                    let accountObj = res.data.records.filter((result) => {
                        return parseInt(result.typeId, 10) === parseInt(keyId, 10)
                    })[0]

                    // 设置账号密码
                    setUserName(accountObj.userAccount)
                    setPassword(accountObj.userPassword)

                    // 设置记录的数据
                    globalData.myName = accountObj.name
                    globalData.myUrl = accountObj.url
                    globalData.myuserName = accountObj.useraccount

                    $(modalDom).remove()
                    $('.auto-login-back-wall').remove()
                })
                $('.no-matching-close-button').on('click', function() {
                    $(modalDom).remove()
                    $('.auto-login-back-wall').remove()
                })
            });
        })
    })

}

let pwdLength = 20
let settingType = [1,1,1,1] //字符,大写,小写,数字
// 添加新账号
function createAddAccountDom() {
    $('.no-matching-add-new-account').on('click', function() {
        $('.auto-login-start-click-account').remove()
        const renderAccountNewModalDom = createModal(480, 435, 'add-new-account-modal')
        //账号：必填项可编辑，获取页面中的type=text类型第一个输入框的值，如果为空，获取第二个输入框的值，依次类推；如果全为空，则该输入框为空，heaveil
        let textList = $("input[type='text']")
        let account = ''
        for (let i = 0; i < textList.length; i++) {
            if(textList[i].value){
                account = textList[i].value
            }
        }

        layui.use(['form', 'slider', 'laytpl'], function(){
            // 渲染新增新账号
            var data = { //数据
                list: []
            }

            // $('.share-result-td').append(shareListHtml)
            var laytpl = layui.laytpl;
            var getTpl = addNewAccountConfig

            laytpl(getTpl).render(data, function(html){
                $(renderAccountNewModalDom).append(html)
            });

            var form = layui.form;

            //重新渲染
            form.render();

            form.on('checkbox(chrtype)', function(data){
                settingType[data.value] = data.elem.checked?1:0
                setTimeout(()=>{
                    $("#accountPwd").val(autoCreatePwd())
                },500)
            });  

            var slider = layui.slider
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

            //先把元素append进去以后才能操作dom
            $("#account").val(account)

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
        });


        $('.close-set-pass-config').on('click', function() {
            $('.add-new-account-modal').remove()
        })

        $('.auto-login-pass-set-cancel').on('click', function() {
            $('.add-new-account-modal').remove()
            $('.alert-auto-login-modal').remove()
            $('.auto-login-back-wall').remove()
        })

        $('.auto-login-pass-set-use').on('click', function() {
            console.log('提交')
        })
        
        $("#accountPwd").val(autoCreatePwd())
        
    })
}

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

function setUserName(username='') {
    var inputArr = $('input')
    var usernameDom = inputArr[0]
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: username,
        dataTransfer: null,
        isComposing: false
    });
    usernameDom.value = username
    usernameDom.dispatchEvent(evt);
}

function setPassword(password='') {
    var inputArr = $('input')
    var usernameDom = inputArr[1]
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: password,
        dataTransfer: null,
        isComposing: false
    });
    usernameDom.value = password
    usernameDom.dispatchEvent(evt);
}

function loginCommonMethods() {
    const pathname = window.location.pathname
    if(pathname.indexOf('login') === -1) {
        return
    }

    // chrome.tabs.query({
    //     "currentWindow": true, //Filters tabs in current window
    //     "status": "complete", //The Page is completely loaded
    //     "active": true, // The tab or web page is browsed at this state,
    //     "windowType": "normal" // Filters normal web pages, eliminates g-talk notifications etc
    // }, function (tabs) { //It returns an array
    //    console.log(tabs)
    // });

    const inputArr = $('input')
    var username = inputArr[0]
    keyDomFunc(username, keyUsernameClick)

    var password = inputArr[1]
    keyDomFunc(password, keyUsernameClick)

    // 点击登录按钮 插入记录
    const loginButton = findLoginButton()


    loginButton[0].addEventListener('click' , function() {
        let insertModel = {
            accountId: 1,
            myAddress: globalData.myUrl,
            myName: globalData.myName,
            myUrl: globalData.myUrl,
            myUserIp: '',
            terminalName: '',
            terminalType: 3,
            userName: globalData.userName
        }
        myTabAjax('/miyun/sys/UserLoginController/saveLoginMyuser', 'post', insertModel).then((res) => {
            console.log(res.data)
        })
    })
}

// 递归判断是否加载完成
testIsComplete()
function testIsComplete() {
    if(window.document.readyState === 'complete'){
        loginCommonMethods()
    }else{
        setTimeout(() => {
            testIsComplete()
        }, 200)
    }
}
