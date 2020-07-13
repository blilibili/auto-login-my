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