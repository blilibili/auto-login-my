const noMatchingAccount = `<div style="fonts-size: 16px;">
	<div style="padding: 25px;text-align: center;font-size: 24px;">抱歉，没有匹配账号密码</div>
	
	<div style="display: flex;justify-content: space-between;padding: 25px;margin-top: 30px;">
		<div style="cursor: pointer;" class="no-matching-add-new-account">添加新账号</div>
		<div style="cursor: pointer;" class="no-matching-close-button">关闭</div>
	</div>
</div>`


const addNewAccountConfig = `<div>
	<div style="text-align: center;font-size: 18px;font-weight: bold;padding: 25px;">密云(账号设置)</div>
	<div class="auto-login-line"></div>
	<div class="auto-login-form">
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>账号</div>
			<input class="auto-login-input" type="text" placeholder="请输入账号">
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>生成密码</div>
			<input class="auto-login-input" type="text" placeholder="" disabled>
		</div>
		
		<div class="auto-login-flex-row">
			<div class="auto-login-flex-col"><span style="color: #FF2727;">*</span>密码设置</div>
			<div class="auto-login-textarea">
				<div class="auto-login-flex-row">
					<div>密码长度: </div>
					<div style="margin-left: 15px;">我是滑块</div>
				</div>
				
				<div class="auto-login-flex-row">
					<div>字符设置: </div>
					<div style="margin-left: 15px;" class="auto-login-string-config">
						<div class="auto-login-string-config-label">大写</div>
						<div class="auto-login-string-config-label">小写</div>
						<div class="auto-login-string-config-label">数字</div>
						<div class="auto-login-string-config-label">字符</div>
					</div>
				</div>
				
				<div class="auto-login-flex-row">
					<div>安全级别: </div>
					<div style="margin-left: 15px;" class="auto-login-save-level">
						<span>我是安全级别</span>
						<span>高</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`
