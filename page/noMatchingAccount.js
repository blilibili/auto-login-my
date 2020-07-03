
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
	{{#  layui.each(d.list, function(index, item){ }}
		<div class="auto-login-flex-row" data-account={{ item.useraccount}} data-typeId={{ item.typeid }} >
			<img src="http://122.51.89.68:81/key.png" class="auto-login-click-account-small-image" alt="">
			<div style="margin-left: 10px;">
				<div style="color: #222222;">{{ item.name }} [{{item.useraccount}}]</div>
				<div style="font-size: 12px;color: #999999;">{{ item.isSorC === 1?'我创建的': '别人分享给我的' }}</div>
			</div>
		</div>
		
		<div style="width: 100%;background-color: #ECEBEB;height: 1px;margin: 15px 0;"></div>
	{{#  }) }}	
		<div style="display: flex;justify-content: space-between;padding: 0px;margin-top: 25px;">
		<div style="cursor: pointer;color: #1791FF;" class="no-matching-add-new-account">添加新账号</div>
		<div style="cursor: pointer;" class="no-matching-close-button">关闭</div>
	</div>
	</div>
	
</div>`

const backWall = `
	<div class="auto-login-back-wall"></div>
`


const addNewAccountConfig = `<div>
	<img class="close-set-pass-config" style="position: absolute;top: 19px;right: 19px;width: 15px;height: 15px;cursor: pointer;" src="http://122.51.89.68:81/close.png" alt="">
	<div style="text-align: left;font-size: 16px;font-weight: bold;padding: 19px;">密云（帐号密码设置）</div>
	<div class="auto-login-line"></div>
	<div class="auto-login-form">
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>账号</div>
			<input class="auto-login-input" type="text" placeholder="请输入账号">
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>生成密码</div>
			<input class="auto-login-input" type="text" placeholder="" value="风格描述" disabled>
			<div style="position: absolute;top: 7px;right: 30px;color: #1791FF;font-size: 14px;cursor:pointer;">复制</div>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>密码设置</div>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col">密码设置</div>
			<div id="slide-pass-set"></div>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col">密码设置</div>
			
			<form class="layui-form" action="">
			  <div class="layui-form-item">
			     <div style="margin-left: 20px;">
			      <input type="checkbox" name="type1" title="大写" lay-skin="primary">
			      <input type="checkbox" name="type2" title="小写" checked lay-skin="primary">
			      <input type="checkbox" name="type3" title="数字" lay-skin="primary">
			      <input type="checkbox" name="type4" title="字符" lay-skin="primary">
			    </div>
			  </div>
		  </form>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col">安全级别</div>
			<div class="auto-login-safe-block">
				<div class="auto-login-safe-col auto-login-safe-col-checked"></div>
				<div class="auto-login-safe-col auto-login-safe-col-checked"></div>
				<div class="auto-login-safe-col"></div>
				<span style="margin-left: 3px;">中</span>
			</div>
		</div>
	</div>
	
	<div class="auto-login-line" style="margin: 15px 0;"></div>
	<div class="button-controller-auto-login">
		<button type="button" class="layui-btn layui-btn-primary auto-login-pass-set-cancel">取消</button>
		<button type="button" class="layui-btn layui-btn-normal auto-login-pass-set-use">使用</button>
	</div>
</div>`
