<script>
  // 上线时存放后端服务器ip或者域名
  import config from './mahjongConfig.js'
	export default {
    globalData: {
      // 小程序用户唯一标识openid，是调用微信登录api获得的code凭证进行解析出来的
    	openid: 'o2eui5ZuZQt2eEsO7lyq0psWFXYg',// 为了方便测试，默认先赋值
      // 存放当前应用所特有的个人信息，可以根据业务场景定制
      userInfo: {
      	openid: 'o2eui5ZuZQt2eEsO7lyq0psWFXYg',
      	avatarUrl: '',
      	nickName: '',
      	gender: '',
      },
      // 头部的自定义的高度
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
      // 当前默认选中的店名
      store: '安鸿店',
      storeId: '97901',
      // 请求头信息，一般存放token信息
      header: {
      	Authority: ''
      },
      // 下面的高度和宽度都是为了自适应手机大小
      navBarHeight: 0, // 导航栏高度
      menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      pageHeight: 0, //页面高度
      menuWidth: 0, // 菜单高度
      statusBarHeight: 0, //底部tabbar高度
      screenWidth: 0, //屏幕高度
      isLogin: false,// 判断当前是否登录的标识
      firstIn: true,
      haveLoading: false,
      // 判断当前是否已经连上websocket
      webSocketIsOpen: true,
      //全局消息未读数
      unreadCount: 0,
      // websocket连接成功之后，将websocket对象封装在这里
			socketTask: '',
    },
		async onLaunch() {
      let vm = this;
      let pastDueDate = uni.getStorageSync('pastDueDate');
      let currentTime = Date.parse(new Date());
      if (!pastDueDate || pastDueDate < currentTime) {
      	// 没有缓存时间或者时间过期，就必须重新登录
      	await this.login()
      } else {
        // 如果缓存时间没有过期
      	let header = new Object()
      	header.Authority = uni.getStorageSync('Authority')
        // 缓存时间没过期，但是token过期，依然是要重新登录
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
      this.setNavBarInfo()
      this.getPagesHeight()
		},
		onShow: function() {
			this.setNavBarInfo()
			this.getPagesHeight()
      if (this.globalData.webSocketIsOpen) {
      	this.connectWebSocket()
      	this.globalData.webSocketIsOpen = false
      }
		},
		onHide: function() {
			console.log('App Hide')
      this.globalData.webSocketIsOpen = true
		},
    methods: {
      //连接websocket,实现即时通讯，主要是统计好当前在线人数
      connectWebSocket() {
      	let vm = this
      	let socketTask = uni.connectSocket({
      		url: 'ws://localhost:9790/IM/online/' + vm.globalData.userInfo.openid,
      		complete: () => {}
      	});
      	socketTask.onOpen(callback => {
      		console.log("AppWebSocket连接成功：" + callback.data)
      	})
      	socketTask.onError(callback => {
      		console.log("AppWebSocket发送错误：" + callback.errMsg)
      	})
      	socketTask.onClose(callback => {
      		console.log("App连接关闭")
      		vm.globalData.unreadCount = 0
      	})
      	socketTask.onMessage(callback => {
          // callback.data保证消息不会重复
      		vm.globalData.unreadCount += new Number(callback.data)
      		if (vm.globalData.unreadCount > 0) {
            // 展示从左边数第四个tabbar显示红点，代表有消息未读
      			uni.showTabBarRedDot({
      				index: 4
      			})
      		} else {
      			uni.hideTabBarRedDot({
      				index: 4
      			})
      		}
      	})
      	vm.globalData.socketTask = socketTask
      },
      // 全局的ajax调用，前端直接使用这个封装好的方法，配置好参数，就能直接调用后端接口
    	async UniRequest(path, method, body, header, isDeploy) {
    		let data
    		let request = new Object
    		//禁止使用前缀
    		if (isDeploy === 1) {
    			request.url = `http://localhost:9790` + path
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
    		if (this.globalData.openid) {
    			request.header.Openid = this.globalData.openid
    		}
    		await uni.request(request).then(res => {
    			data = res
          console.log('调用成功', res)
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
      		getApp().globalData.haveLoading = true
      		let userInfo = new Object()
      		userInfo.avatarUrl = data.data.avatarUrl
      		userInfo.nickName = data.data.nickname
          // 存储登录个人信息,便于请求的时候携带
      		uni.setStorageSync("userInfo", userInfo)
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
    		this.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    		this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    		this.globalData.menuHeight = menuButtonInfo.height;
    		this.globalData.menuWidth = menuButtonInfo.width;
    		this.statusBarHeight = systemInfo.statusBarHeight;
    		this.screenWidth = systemInfo.screenWidth;
    	},
      // 获取手机页面真实高度
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
	/*每个页面公共css 使用uview组件库，必须导入全局uview样式*/
  @import "uview-ui/index.scss";
  /*每个页面公共css */
  .plr20 {
  	background-color: #F6F6F6;
  	padding-left: 40rpx;
  	padding-right: 40rpx;
  	padding-bottom: 100rpx;
  }
</style>
