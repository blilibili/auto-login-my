/**
 * 文件名：index.js
 * 作者：liyigang
 * 创建时间：2020/1/5
 * 版权声明：无
 */
$('.selection-row').map(function(key, val) {
  $(this).on('mouseover', function(){
    $(this).addClass('selection-row-actived').siblings().removeClass('selection-row-actived')
  })
})

$('.sync-record').on('click' , function() {
  window.open('./newTab/usingInfo.html')
})

$('.miyun-row').on('click', function() {
  window.open('./newTab/addNewAccount.html')
})

$('.download-record').on('click', function() {
  window.open('./newTab/accountList.html')
})

$('.bookmarks').on('click', function() {
  console.log("我的书签")
  window.open('chrome://bookmarks')
})
// function find(dom) {
//     return document.querySelector(dom)
// }
// const serveApi = 'http://122.51.89.68:81'
// const localStorage = window.localStorage
// const changeViewBtn = find('.change-to-save')
// const accountPage = find('.account-page')
// const inputPage = find('.login-page')
// const saveBtn = find('.save-account-btn')
// const userName = find('#username')
// const password = find('#password')
// const website = find('#website')
//
// if(localStorage.getItem('account') === null){
//     localStorage.setItem('account' , '')
// }
//
// if(localStorage.getItem('currentAccount') === null){
//     localStorage.setItem('currentAccount' , '')
// }
//
//
// function updateButtonView() {
//     // 账号点击获取密码自动登录
//     const labelArr = $(".account-col")
//     const currentUser = localStorage.getItem('currentAccount')
//
//     for(let i = 0;i < labelArr.length;i++){
//         labelArr[i].classList.remove('account-col-active')
//     }
//     for(let i = 0;i < labelArr.length;i++){
//         if(currentUser == labelArr[i].innerText){
//             labelArr[i].classList.add('account-col-active')
//         }
//     }
// }
//
// function sendMsgToContentScript(message, callback){
//     chrome.tabs.query({}, function(tabs){
//         tabs.forEach((v , k) => {
//             message.data.forEach((val , key) => {
//                 if(v.url.indexOf(val.website) !== -1){
//                     message.data = val
//                     chrome.tabs.sendMessage(v.id, message, function(response){
//                         if(callback) callback(response);
//                     })
//                 }
//             })
//         })
//     })
// }
//
// function findUsersByUserName(name) {
//     const usersJson = JSON.parse(localStorage.getItem('account'))
//     let tmpObj = {}
//     usersJson.forEach((v , k) => {
//         if(v.username === name){
//             tmpObj = v
//         }
//     })
//
//     return tmpObj
// }
//
// function findUsersByWebsite(website) {
//     const usersJson = JSON.parse(localStorage.getItem('account'))
//     let tmpObj = {}
//     usersJson.forEach((v , k) => {
//         if(v.website === website){
//             tmpObj = v
//         }
//     })
//
//     return tmpObj
// }
//
// // 获取账号列表信息
// let userList = []
// $.ajax({
//     url: serveApi + '/auto/login',
//     methods: 'GET',
//     success: (res) => {
//         userList = res.list
//         initMethods(userList)
//     },
//     error: (err) => {
//         console.log(err)
//     }
// })
//
// function initMethods(userList) {
//     // 判断是否有记录过账号
//     if(userList.length > 0){
//         // 赋值账号给list
//         const accountList = userList
//         const currentUser = localStorage.getItem('currentAccount')
//         const rowList = find('.account-row')
//
//         if(accountList.length){
//             accountList.forEach((v , k) => {
//                 var newNode = document.createElement("div")
//                 newNode.classList.add('account-col')
//                 newNode.innerHTML = v.website
//                 rowList.appendChild(newNode)
//             })
//         }
//
//         // 账号点击获取密码自动登录
//         const labelArr = $(".account-col")
//         updateButtonView()
//
//         inputPage.style.display = 'none'
//         accountPage.style.display = 'block'
//     }else{
//         inputPage.style.display = 'block'
//         accountPage.style.display = 'none'
//     }
// }
//
// function saveAccount(accountParam) {
//     // 插入数据库
//     $.ajax({
//         url: serveApi + '/auto/save',
//         type: 'POST',
//         data: accountParam,
//         success: (res) => {
//             console.log(res)
//             const rowList = find('.account-row')
//
//             var newNode = document.createElement("div");
//             newNode.classList.add('account-col')
//             newNode.innerHTML = accountParam.website;
//             rowList.appendChild(newNode)
//
//             // 账号点击获取密码自动登录
//             const labelArr = $(".account-col")
//             updateButtonView()
//
//             for(let i = 0;i < labelArr.length;i++){
//                 labelArr[i].onclick = function(){
//                     localStorage.setItem('currentAccount' , labelArr[i].innerText)
//                     updateButtonView()
//                 }
//             }
//
//             inputPage.style.display = 'none'
//             accountPage.style.display = 'block'
//         },
//         error: (error) => {
//             console.log(error)
//         }
//     })
// }
//
// saveBtn.addEventListener('click' , function() {
//     const accountParam = {
//         website: website.value,
//         username: userName.value,
//         password: password.value
//     }
//
//     saveAccount(accountParam)
// })
//
// changeViewBtn.addEventListener('click' , function() {
//     accountPage.style.display = 'none'
//     inputPage.style.display = 'block'
// })
