/**
 * Created by liyigang on 1/5/2020.
 */
console.log(chrome, '123')
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request, sender, sendResponse)
    if(request.type === 'REQUEST_USERS_ALL'){
        console.log('我是content-script,收到来自popup的消息：' + request.title);
        sendResponse('我是content-script, 已收到你的预览全部图片的消息');
    }
});

chrome.tabs.onCreated.addListener(function(tab) {
    chrome.management.getAll(callback=>{
        console.log("callback:",callback)
        let id = ""
        callback.forEach(item=> {
            if(item.name == "云中云管家") {
                id = item.id
            }
        })
        chrome.runtime.sendMessage(id,{
            type:"msgFrom",
            msg:'hello'
        },function(res) {
            console.log("res:",res)
            if(res === null) {
                console.log('未登录云中云, 获取的数据', res)
            }
            let userId = ''
            // 小慧
            if(res.chatserverId) {
                userId = res.chatServerName + '@' + res.chatserverId
                chrome.storage.local.set({
                    userid: userId,
                    userName: res.chatServerName,
                    accountId: res.chatserverId,
                    nickname: res.nickname,
                    avatar: res.avatar
                }, function() {
                    console.log("保存id:",res.chatserverId);
                });
                window.localStorage.setItem('userid', userId)
                window.localStorage.setItem('userName', res.chatServerName)
                window.localStorage.setItem('accountId', res.chatserverId)
                window.localStorage.setItem('nickname', res.nickname)
                window.localStorage.setItem('avatar', res.avatar)
            }

            // 小智
            if(res.chatServerId) {
                userId = res.chatServerName + '@' + res.chatServerId
                chrome.storage.local.set(
                  {
                      userid: userId,
                      userName: res.chatServerName,
                      accountId: res.chatserverId,
                      nickname: res.nickname,
                      avatar: res.avatar
                  }, function() {
                    console.log("保存id:",res.chatServerId);
                });
                window.localStorage.setItem('userid', userId)
                window.localStorage.setItem('userName', res.chatServerName)
                window.localStorage.setItem('accountId', res.chatServerId)
                window.localStorage.setItem('nickname', res.nickname)
                window.localStorage.setItem('avatar', res.avatar)
            }

        })
    })
})

// 点击插件图标事件
chrome.browserAction.onClicked.addListener(function(Tab) {
    console.log('点击事件')
    window.open('newTab/accountList.html')
});

function getToken(data) {
    return new Promise((resolve) => {
        myTabAjax('/miyun/sys/UserLoginController/getMyuserToken', 'get', data).then((res) => {
            resolve(res.data.token)
        })
    })
}
