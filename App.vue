<script>
  // 上线时存放后端服务器ip或者域名
  import config from './mahjongConfig.js'
	export default {
    globalData: {
    	// 头部的自定义的高度
    	statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    	openid: 'o2eui5ZuZQt2eEsO7lyq0psWFXYg',
      store: '安鸿店',
      storeId: '97901',
      header: {
      	Authority: ''
      },
      navBarHeight: 0, // 导航栏高度
      menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      pageHeight: 0, //页面高度
      menuWidth: 0,
      statusBarHeight: 0, //底部tabbar高度
      screenWidth: 0, //屏幕高度
      isLogin: false,
      newPerson:false,
      firstIn: true,
      haveLoading: false,
      userInfo: '',
    },
		async onLaunch() {
      let vm = this;
      let pastDueDate = uni.getStorageSync('pastDueDate');
      let currentTime = Date.parse(new Date());
      if (!pastDueDate || pastDueDate < currentTime) {
      	//console.log('没有缓存时间或者时间过期')
      	await this.login()
      	// console.log("方法有同步吗！！！")
      } else {
      	//console.log("输出啊------>")
      	let header = new Object()
      	header.Authority = uni.getStorageSync('Authority')
      	if (!header.Authority) {
      		this.globalData.haveLoading = false
      		uni.reLaunch({
      			url: "page_login/login/login",
      			fail(error) {
      				console.log('错误信息', error)
      			}
      		})
      	}
      	this.globalData.haveLoading = true
      	this.globalData.header = header
      	this.globalData.openid = uni.getStorageSync('openid');
      	this.globalData.userInfo = uni.getStorageSync('userInfo')
      }
      console.log('登录缓存时间', pastDueDate)
      this.setNavBarInfo()
      this.getPagesHeight()
		},
		onShow: function() {
			this.setNavBarInfo()
			this.getPagesHeight()
		},
		onHide: function() {
			console.log('App Hide')
		},
    methods: {
    	async UniRequest(path, method, body, header, isDev) {
    		let data
    		let request = new Object
    		//禁止使用前缀
    		if (isDev === 1) {
    			request.url = `http://localhost:7777` + path
    		} else {
    			request.url = `https://${config.domain}` + path
    		}
    		request.method = method
    		if (body) {
    			request.data = body;
    		}
    		if (header) {
    			request.header = header
    		} else {
    			request.header = new Object
    		}
    		//request.header.University = config.university
    		if (this.globalData.openid) {
    			request.header.Openid = this.globalData.openid
    		}
    		await uni.request(request).then(res => {
    			data = res
    		}).catch(err => {
    			console.log('调用失败', err)
    		})
    		return data[1].data
    	},
      async login(userInfo) {
      	let vm = this
      	let code = await vm.wxLogin()
      	let body = new Object()
      	body.code = code;
      	if (userInfo) {
      		body.nickName = userInfo.nickName
      		body.avatarUrl = userInfo.avatarUrl
      	}
      	let data = await getApp().UniRequest("/user/quickLogin", "POST", body, "",1)
      	if (data.code === 20000) {
      		console.log("快捷登录成功")
      		let authority = data.data.Authority;
      		uni.setStorageSync("Authority", authority);
      		let pastDueDate = Date.parse(new Date()) + 259200000;
      		uni.setStorageSync('pastDueDate', pastDueDate)
      		getApp().globalData.firstIn = false;
      		let header = new Object()
      		header.Authority = authority
      		getApp().globalData.header = header
      		//登录成功后执行回调函数
      		if (getApp().loadPlanetCallBack) {
      			//console.log("loadPlanet执行")
      			getApp().loadPlanetCallBack()
      		}
      		if (getApp().tokenCallbacck) {
      			//console.log("tokenCallbacck执行")
      			getApp().tokenCallbacck()
      		}
      		getApp().globalData.haveLoading = true
      		let userInfo = new Object()
      		userInfo.avatarUrl = data.data.avatarUrl
      		userInfo.nickName = data.data.nickname
      		uni.setStorageSync("userInfo", userInfo)
      		getApp().globalData.userInfo = userInfo
      		let openid = data.data.openid
      		getApp().globalData.openid = openid
      		uni.setStorageSync("openid", data.data.openid)
      		uni.setStorageSync("openid", openid)
      	}
      },
      async quickLogin(userInfo) {
      	let vm = this
      	let code = await vm.wxLogin()
      	let body = new Object()
      	body.code = code;
      	if (userInfo) {
      		body.nickname = userInfo.nickName
      		body.avatarUrl = userInfo.avatarUrl
      	}
      	let data = await getApp().UniRequest("/user/login", "POST", body, "",1)
      	//快捷登录失败则跳转到登录页
      	if (data.code == 20002) {
      		getApp().globalData.haveLoading = false
      		uni.reLaunch({
      			url: "../../page_login/login/login",
      			fail(error) {
      				console.log('错误信息', error)
      			}
      		})
      	} else {
      		let authority = data.data.Authority;
      
      		uni.setStorageSync("Authority", authority);
      		let pastDueDate = Date.parse(new Date()) + 259200000;
      		uni.setStorageSync('pastDueDateNew', pastDueDate)
          uni.setStorageSync('pastDueDate', pastDueDate)
      		getApp().globalData.firstIn = false;
      		let header = new Object()
      		header.Authority = authority
      		getApp().globalData.header = header
      		//登录成功后执行回调函数
      		if (getApp().loadPlanetCallBack) {
      			//console.log("loadPlanet执行")
      			getApp().loadPlanetCallBack()
      		}
      		if (getApp().tokenCallbacck) {
      			//console.log("tokenCallbacck执行")
      			getApp().tokenCallbacck()
      		}
      		getApp().globalData.haveLoading = true
      		let userInfo = new Object()
      		userInfo.avatarUrl = data.data.avatarUrl
      		userInfo.nickName = data.data.nickname
      		uni.setStorageSync("userInfo", userInfo)
      		//console.log(data.data.subscribe, 22)
      		//console.log(data.data.isHaiZhu, 222)
      		getApp().globalData.userInfo = userInfo
      		let openid = data.data.openid
      		getApp().globalData.openid = openid
      		uni.setStorageSync("openid", data.data.openid)
      		uni.setStorageSync("openid", openid)
      	}
      },
      async wxLogin() {
      	return new Promise(function(reslove, reject) {
      		wx.login({
      			success(res) {
      				reslove(res.code);
      			}
      		})
      	})
      },
    	setNavBarInfo() {
    		// 获取系统信息
    		const systemInfo = wx.getSystemInfoSync();
    		// 胶囊按钮位置信息
    		const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    		// 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    		this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo
    			.height + systemInfo.statusBarHeight;
    		this.globalData.navBarHeight = this.globalData.navBarHeight * 750 / wx.getSystemInfoSync().windowWidth;
    		//console.log(this.globalData.navBarHeight)
    		this.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    		this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    		this.globalData.menuHeight = menuButtonInfo.height;
    		this.globalData.menuWidth = menuButtonInfo.width;
    		this.statusBarHeight = systemInfo.statusBarHeight;
    		this.screenWidth = systemInfo.screenWidth;
    		//console.log(111, this.screenWidth)
    	},
    	getPagesHeight() {
    		let that = this;
    		uni.getSystemInfo({
    			success: function(res) {
    				let pxToRpxScale = 750 / res.windowWidth;
    				that.globalData.pageHeight = res.windowHeight * pxToRpxScale;
    			}
    		});
    		console.log(this.globalData.pageHeight, '页面高度')
    	}
    }
	}
</script>

<style lang="scss">
	/*每个页面公共css */
  @import "uview-ui/index.scss";
  /*每个页面公共css */
  .plr20 {
  	background-color: #F6F6F6;
  	padding-left: 40rpx;
  	padding-right: 40rpx;
  	padding-bottom: 100rpx;
  }
</style>
