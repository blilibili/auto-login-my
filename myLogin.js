
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

// 添加新账号
function createAddAccountDom() {
    $('.no-matching-add-new-account').on('click', function() {
        $('.auto-login-start-click-account').remove()
        const renderAccountNewModalDom = createModal(480, 435, 'add-new-account-modal')
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

            var slider = layui.slider
            //渲染
            slider.render({
                elem: '#slide-pass-set'  //绑定元素
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
    })
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
