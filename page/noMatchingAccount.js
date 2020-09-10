// 密码列表
const noMatchingAccount = `<div class="auto-login-start-click-account">
<!--	<div style="padding: 25px;text-align: center;font-size: 24px;">抱歉，没有匹配账号密码</div>-->
<!--	<div style="font-size: 30px;color: white;width: 100%;text-align: center;margin-top: 80px;">欢迎登陆</div>-->
<!--	-->
<!--	<div class="auto-login-selected-account" style="margin-top: 43px;">-->
<!--		<img src="http://122.51.89.68:81/keys.png" style="position: absolute;left: 12px;top: 5px;" class="auto-login-click-account-small-image" alt="">-->
<!--		<img src="http://122.51.89.68:81/keys.png" style="position: absolute;right: 12px;top: 5px;" class="auto-login-click-account-small-image" alt="">-->
<!--		<div style="position: absolute;left: 40px;top: 5px;">security</div>-->
<!--	</div>-->
	
	<div class="auto-login-account-textarea">
	 <div class="auto-login-account-row-title-box" style="position: relative;">
			<img src="{{chrome.extension.getURL('img/close.png')}}" class="auto-login-account-textarea-close-image no-matching-close-button" alt="" style="width: 19px;height: 19px;">
			<div class="auto-login-account-textarea-title">欢迎登陆</div> 
	 </div>
	 <div class="auto-login-account-row-content-box">
	   {{# if(d.list.length === 0) { }}
	      <div style="padding: 15px;color:#333;">抱歉，没有匹配的账号密码</div>
	   {{#} }} 
		 {{#  layui.each(d.list, function(index, item){ }}
			<div class="auto-login-list-flex-row account-list-use" style="margin-top: 0;" data-typeId={{ item.typeId }} >
				<img src="{{chrome.extension.getURL('img/key.png')}}" class="auto-login-click-account-small-image" alt="">
				<div style="margin-left: 10px;">
					<div class="auto-login-user-account-row">{{ item.name }} [{{item.userAccount}}]</div>
					<div style="font-size: 12px;color: #999999;">{{ item.isSorC === 1?'我创建的': '别人分享给我的' }}</div>
				</div>
			</div>
			
			<div style="width: 100%;background-color: #ECEBEB;height: 1px;"></div>
		{{#  }) }}	
	 </div>
	<div class="auto-login-account-footer">
		<div style="cursor: pointer;color: #1791FF;" class="no-matching-add-new-account">添加新账号</div>
		<div style="cursor: pointer;color:#333;" class="no-matching-close-button">关闭</div>	
	</div>
	</div>
	
</div>`

// 加载更多插入的dom
const renderPwdList = `
    {{#  layui.each(d.list, function(index, item){ }}
			<div class="auto-login-list-flex-row account-list-use" style="margin-top: 0;" data-typeId={{ item.typeId }} >
				<img src="{{chrome.extension.getURL('img/key.png')}}" class="auto-login-click-account-small-image" alt="">
				<div style="margin-left: 10px;">
					<div class="auto-login-user-account-row">{{ item.name }} [{{item.userAccount}}]</div>
					<div style="font-size: 12px;color: #999999;">{{ item.isSorC === 1?'我创建的': '别人分享给我的' }}</div>
				</div>
			</div>
			
			<div style="width: 100%;background-color: #ECEBEB;height: 1px;"></div>
		{{#  }) }}	
`

const backWall = `
	<div class="auto-login-back-wall"></div>
`


const addNewAccountConfig = `<div>
	<img class="close-set-pass-config" style="position: absolute;top: 19px;right: 19px;width: 15px;height: 15px;cursor: pointer;" src="{{chrome.extension.getURL('img/close.png')}}" alt="">
	<div style="text-align: left;font-size: 16px;font-weight: bold;padding: 19px;">密云（帐号密码设置）</div>
	<div class="auto-login-line"></div>
	<div class="auto-login-form">
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>账号</div>
			<input class="auto-login-input" id="account" type="text" value="" placeholder="请输入账号">
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>生成密码</div>
			<input class="auto-login-input" type="text" placeholder="" id="accountPwd" value="" readonly>
			<div id="copybtn" class="copy-button-add-account">复制</div>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>密码设置</div>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col">密码设置</div>
			<div id="slide-pass-set"></div>
			<div id="slidePassSetVal">20</div>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col">字符设置</div>
			
			<form class="layui-form" action="">
			  <div class="layui-form-item">
			     <div style="margin-left: 20px;">
			      <input type="checkbox" name="chrtype" lay-filter="chrtype" value="1" title="大写" checked lay-skin="primary">
			      <input type="checkbox" name="chrtype" lay-filter="chrtype" value="2" title="小写" checked lay-skin="primary">
			      <input type="checkbox" name="chrtype" lay-filter="chrtype" value="3" title="数字" checked lay-skin="primary">
			      <input type="checkbox" name="chrtype" lay-filter="chrtype" value="0" title="字符" checked lay-skin="primary">
			    </div>
			  </div>
		  </form>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col">安全级别</div>
			<div class="auto-login-safe-block">
				<div class="auto-login-safe-col auto-login-safe-col-checked" id="1"></div>
				<div class="auto-login-safe-col auto-login-safe-col-checked" id="2"></div>
				<div class="auto-login-safe-col auto-login-safe-col-checked" id="3"></div>
				<span style="margin-left: 3px;" id="auto-login-safe-txt">低</span>
			</div>
		</div>
	</div>
	
	<div class="auto-login-line" style="margin: 15px 0;"></div>
	<div class="button-controller-auto-login">
		<button type="button" class="layui-btn layui-btn-primary auto-login-pass-set-cancel">取消</button>
		<button type="button" class="layui-btn  auto-login-pass-set-use">使用</button>
	</div>
</div>`

const verifyModal = `
  <!--验证弹框-->
    <div class="account-verify-modal" style="display: none;">
      <div class="account-verify-title">
        <div style="color: #222222;font-size: 16px;">验证</div>
        <!-- <span class="account-verify-close-image" style="width: 19px;height: 19px;">X</span> -->
        <img src="http://122.51.89.68:81/close.png" class="account-verify-close-image" alt="" style="width: 19px;height: 19px;">
      </div>

      <div class="ddd-line">

      </div>
      <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
        <ul class="layui-tab-title" style="text-align: center;border-bottom: 0;">
          <li class="layui-this" style="font-size: 18px;padding: 0 24px;line-height: 28px;margin-right: 60px;">小慧扫码</li>
          <li style="font-size: 18px;padding: 0 24px;line-height: 28px;">小慧密码</li>
        </ul>

        <div class="layui-tab-content">
          <div class="layui-tab-item layui-show">
            <div class="xh-login-scan-row" style="text-align: center;margin-top: 30px;">
              <img src="#" class="xh-login-scan-image" alt="">
            </div>
            <div style="text-align: center;color: #999999;font-size: 14px;">
              点击刷新二维码
            </div>
          </div>
          <div class="layui-tab-item" style="text-align: center;">
            <div class="xh-pass-input">
              <!-- <span style="width: 18px;height: 18px;position: absolute;top: 7px;left: 10px;">X</span> -->
              <img src="http://122.51.89.68:81/close.png" style="width: 18px;height: 18px;position: absolute;top: 7px;left: 10px;" alt="">
              <input type="text" style="width: 100%;">
            </div>

            <div class="layui-btn layui-btn-normal auto-login-submit-xh-pass">提交</div>
          </div>
        </div>
      </div>

    </div>
`


const noSameAccount = `
<div class="no-same-account">
	<div class="no-same-account-title">
		<div>要保存密码到密云吗？</div>
		<img src="http://122.51.89.68:81/close.png" class="no-same-account-close" alt="" style="width: 19px;height: 19px;">
	</div>
	<div class="no-same-account-body">
		<div>账号：</div>
		<input id="no-same-account-account" type="text" placeholder="" value="" readonly>
	</div>
	<div class="no-same-account-body">
		<div>密码：</div>
		<input id="no-same-account-pwd" type="password" placeholder="" value="" readonly>
	</div>
	<div class="no-same-account-btns">
		<button class="no-same-account-btn1">保存</button>
		<button class="no-same-account-btn2">明天再提示</button>
	</div>
</div>
<div class="no-same-account-succ" style="display:none">
	保存成功！
</div>
`

const theSameAccount = `
<div class="the-same-account" >
	<div class="the-same-account-close">
		<img src="http://122.51.89.68:81/close.png" class="no-same-account-close" alt="" style="width: 19px;height: 19px;">
	</div>
	<div class="the-same-account-title">密云中存在相同的账号密码，是否要更新？</div>
	<div class="the-same-account-btns">
		<button class="the-same-account-btn1">确认</button>
	</div>
</div>
<div class="the-same-account-succ" style="display:none">
	更新成功！
</div>
`
