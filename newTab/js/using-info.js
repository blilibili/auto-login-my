layui.use('laypage', function(){
	var laypage = layui.laypage;

	//执行一个laypage实例
	laypage.render({
		elem: 'using-info-table' //注意，这里的 test1 是 ID，不用加 # 号
		,count: 50 //数据总数，从服务端得到
		,theme: '#1791FF'
		,limits: [10,20,30,40]
		,curr: 1
		,layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
		,jump: function(obj, first){
			//obj包含了当前分页的所有参数，比如：
			console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
			console.log(obj.limit); //得到每页显示的条数

			//首次不执行
			if(!first){
				//do something
			}
		}
	});
});
