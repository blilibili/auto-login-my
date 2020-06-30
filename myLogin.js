
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log(request, sender, sendResponse)
//     if(request.type === 'REQUEST_USERS_ALL'){
//         loginCommonMethods(request.data)
//
//     }
// });
// 创建账号密码钥匙
function keyDom(insertDom, callback=() => {}) {
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
    const render = template.compile(noMatchingAccount)
    const html = render({value: ''})

    $(modalDom).append(html)
    $('.no-matching-close-button').on('click', function() {
        $(modalDom).remove()
    })
    $('.no-matching-add-new-account').on('click', function() {
        const renderAccountNewModalDom = createModal(480, 420, 'add-new-account-modal')
        const renderAccountNewForm = template.compile(addNewAccountConfig)
        const renderAccountNewFormHtml = renderAccountNewForm({value: ''})
        $(renderAccountNewModalDom).append(renderAccountNewFormHtml)

        layui.use(['form', 'slider'], function(){
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

function loginCommonMethods() {
    const pathname = window.location.pathname
    if(pathname.indexOf('login') === -1) {
        return
    }

    const inputArr = $('input')
    var username = inputArr[0]
    keyDom(username, keyUsernameClick)

    var password = inputArr[1]
    keyDom(password, keyUsernameClick)

    console.log(username, password)
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
