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
                console.log("id：",item.id)
                id = item.id
            }
        })
        chrome.runtime.sendMessage(id,{
            type:"msgFrom",
            msg:'hello'
        },function(res) {
            console.log("res:",res)

            if(res.chatserverId) {
                chrome.storage.local.set({userid: res.chatserverId}, function() {
                    console.log("保存id:",res.chatserverId);
                });
                window.localStorage.setItem('userid', res.chatserverId)
            }

            if(res.chatServerId) {
                chrome.storage.local.set({userid: res.chatServerId}, function() {
                    console.log("保存id:",res.chatServerId);
                });
                window.localStorage.setItem('userid', res.chatServerId)
            }
        })
    })
})
