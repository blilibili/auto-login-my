
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log(request, sender, sendResponse)
//     if(request.type === 'REQUEST_USERS_ALL'){
//         loginCommonMethods(request.data)
//
//     }
// });
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
    $(modalDom).css({width: width, height: height, backgroundColor: 'white', position: 'absolute', top: '50%', left: '50%', zIndex: 10000, marginLeft: -(width/2) + 'px', marginTop: -(height/2) + 'px'})
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
                        return parseInt(result.typeid, 10) === parseInt(keyId, 10)
                    })[0]

                    // 设置账号密码
                    setUserName(accountObj.useraccount)
                    setPassword(accountObj.userpassword)
                    $(modalDom).remove()
                })
                $('.no-matching-close-button').on('click', function() {
                    $(modalDom).remove()
                })
            });
        })
    })

}

function createAddAccountDom() {
    $('.no-matching-add-new-account').on('click', function() {
        console.log('开启创建Modal')
        const renderAccountNewModalDom = createModal(480, 420, 'add-new-account-modal')
        layui.use(['form', 'slider', 'laytpl'], function(){

            // 渲染新增新账号
            var data = { //数据
                list: []
            }

            // $('.share-result-td').append(shareListHtml)
            var laytpl = layui.laytpl;
            var getTpl = addNewAccountConfig

            laytpl(getTpl).render(data, function(html){
                console.log(html)
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

    const inputArr = $('input')
    var username = inputArr[0]
    keyDomFunc(username, keyUsernameClick)

    var password = inputArr[1]
    keyDomFunc(password, keyUsernameClick)
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
