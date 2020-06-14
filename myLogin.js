

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
    keyDom.src = 'http://120.78.84.243:9012/static/images/iconv0.5/login_icon_kj_wechat.png'
    keyDom.width = 30
    keyDom.height = 30
    keyDom.style.position = 'absolute'
    keyDom.style.top = 0
    keyDom.style.right = 0
    keyDom.style.cursor = 'pointer'
    keyDom.onclick = callback
    insertDom.parentNode.appendChild(keyDom)
}


function loginCommonMethods() {
    const inputArr = $('input')
    var username = inputArr[0]

    keyDom(username)
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: '',
        dataTransfer: null,
        isComposing: false
    })


    var password = inputArr[1]
    keyDom(password)
    var evt2 = new InputEvent('input', {
        inputType: 'insertText',
        data: '',
        dataTransfer: null,
        isComposing: false
    });
}

loginCommonMethods()