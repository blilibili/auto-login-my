/**
 * 文件名：background.js
 * 作者：liyigang
 * 创建时间：2020/1/5
 * 版权声明：无
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.type === 'REQUEST_USERS_ALL'){
    console.log('我是content-script,收到来自popup的消息：' + request.title);
    sendResponse('我是content-script, 已收到你的预览全部图片的消息');
  }
});

chrome.storage.local.clear()
window.localStorage.clear()
chrome.tabs.onCreated.addListener(function(tab) {
  chrome.storage.local.clear()
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
      if(res === null || res === undefined) {
        alert('请先登陆云中云管家')
        console.log('未登录云中云, 获取的数据', res)
        return
      }
      // 清空token
      chrome.storage.local.remove('token')
      // 插入平台信息
      let userId = ''
      // 小慧
      if(res.chatserverId) {
        userId = res.xiaohui + '@' + res.chatserverId
        chrome.storage.local.set({
          userid: userId,
          userName: res.chatServerName,
          chatServerId: res.chatserverId,
          nickname: res.nickname,
          avatar: res.avatar || 'https://chat.cloudak47.com:17100/file/avatar/0.png'
        }, function() {
          console.log("保存id:",res.chatserverId);
        });
        window.localStorage.setItem('userid', userId)
        // window.localStorage.setItem('userName', res.chatServerName)
        // window.localStorage.setItem('accountId', res.chatserverId)
        // window.localStorage.setItem('nickname', res.nickname)
        // window.localStorage.setItem('avatar', res.avatar)

        window.localStorage.setItem('chatServerName', res.chatServerName)
        window.localStorage.setItem('chatServerId', res.chatserverId)
        window.localStorage.setItem('nickname', res.nickname)
        window.localStorage.setItem('avatar', res.avatars || chrome.extension.getURL('img/avator.png'))
      }

      // 小智
      if(res.chatServerId) {
        userId = res.xiaohui + '@' + res.chatServerId
        chrome.storage.local.set(
          {
            userid: userId,
            userName: res.chatServerName,
            chatServerId: res.chatServerId,
            nickname: res.nickname,
            avatar: res.avatar_url || 'https://chat.cloudak47.com:17100/file/avatar/0.png'
          }, function() {
            console.log("保存id:",res.chatServerId);
          });
        window.localStorage.setItem('userid', userId)
        // window.localStorage.setItem('userName', res.chatServerName)
        // window.localStorage.setItem('accountId', res.chatServerId)
        // window.localStorage.setItem('nickname', res.nickname)
        // window.localStorage.setItem('avatar', res.avatar)
        window.localStorage.setItem('chatServerName', res.chatServerName)
        window.localStorage.setItem('chatServerId', res.chatServerId)
        window.localStorage.setItem('nickname', res.nickname)
        window.localStorage.setItem('avatar', res.avatar_url || chrome.extension.getURL('img/avator.png'))
      }

    })
  })
})

// 点击插件图标事件
chrome.browserAction.onClicked.addListener(function(Tab) {
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
      if(res === null || res === undefined) {
        alert('请先登陆云中云管家,并关闭此标签页重新打开')
      }else{
        window.open('newTab/accountList.html')
      }
    })
  })
});

function getToken(data) {
  return new Promise((resolve) => {
    myTabAjax('/miyun/sys/UserLoginController/getMyuserToken', 'get', data).then((res) => {
      resolve(res.data.token)
    })
  })
}
