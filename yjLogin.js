// 使用同个栈的js 能操作页面dom
const serveApi = 'http://122.51.89.68:81'
const find = function(selector) {
	return document.querySelector(selector);
};

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

const localStorage = window.localStorage
// 获取账号列表信息
$.ajax({
    url: serveApi + '/auto/login',
    methods: 'GET',
    success: (res) => {
        const accountList = res.list
        const currentWebsite = window.location.origin
        const loginWebArr = accountList.filter((result) => {
            return result.website === currentWebsite
        })
        // 若是登录路径才执行逻辑
        if(window.location.href.indexOf('login') !== -1) {
            // 取数组最后一个
            loginCommonMethods(loginWebArr[loginWebArr.length-1])
        }
    },
    error: (err) => {
        console.log(err)
    }
})
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log(request, sender, sendResponse)
//     if(request.type === 'REQUEST_USERS_ALL'){
//         loginCommonMethods(request.data)
//
//     }
// });

// 读取数据库账号密码

function ganzheLogin(obj) {
    const inputArr = $('.el-input__inner')
    var username = inputArr[0]
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: obj.username?obj.username:'',
        dataTransfer: null,
        isComposing: false
    });
    username.value = obj.username?obj.username: ''
    username.dispatchEvent(evt);

    var password = inputArr[1]
    var evt2 = new InputEvent('input', {
        inputType: 'insertText',
        data: obj.password?obj.password:'',
        dataTransfer: null,
        isComposing: false
    });
    password.value = obj.password?obj.password:''
    password.dispatchEvent(evt2);

    // bug 切换下tab 才能重新效验
    $('.nav-item')[1].click()
    $('.nav-item')[0].click()
    var submitStatic = $('.btn-lg')[0]
    console.log(submitStatic)
    if(submitStatic) submitStatic.click();
}

function loginCommonMethods(obj) {
    const inputArr = $('input')
    var username = inputArr[0]
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: obj.username?obj.username:'',
        dataTransfer: null,
        isComposing: false
    })

    if(username){
        username.value = obj.username?obj.username: ''
        username.dispatchEvent(evt);
    }

    var password = inputArr[1]
    var evt2 = new InputEvent('input', {
        inputType: 'insertText',
        data: obj.password?obj.password:'',
        dataTransfer: null,
        isComposing: false
    });
    if(password){
        password.value = obj.password?obj.password:''
        password.dispatchEvent(evt2);
    }

    var code = inputArr[2]
    var evt3 = new InputEvent('input', {
        inputType: 'insertText',
        data: obj.password?obj.password:'',
        dataTransfer: null,
        isComposing: false
    });

    if(code && code.type !== 'button'){
        code.value = '1234'
        code.dispatchEvent(evt3);
    }

    // bug 切换下tab 才能重新效验
    if($('.nav-item')[0]){
        $('.nav-item')[1].click()
        $('.nav-item')[0].click()
    }
    // var submitStatic = $('.btn-lg')[0]
    var submitStatic = findLoginButton()

    if(submitStatic) {
        for(let i = 0;i < submitStatic.length;i++){
            submitStatic[i].click()
        }
    }
}
