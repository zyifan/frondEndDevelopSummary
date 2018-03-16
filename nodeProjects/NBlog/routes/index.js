module.exports = function(app){
	app.get('/',function(req,res){
		res.redirect('/posts');//主页
	})
	app.use('/signup',require('./signup'));//注册
	app.use('/signin',require('./signin'));//登录
	app.use('/signout',require('./signout'));//登出
	app.use('/posts',require('./posts'));//主页

	// 404 page
	app.use(function (req, res) {
		if (!res.headersSent) {
			res.status(404).render('404');
		}
	});
}