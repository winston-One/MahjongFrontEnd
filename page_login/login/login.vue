<template>
	<view :style="'height:' + height + 'rpx;position: relative;margin:0rpx;padding:0rpx;box-sizing: border-box;'">
		<view class="content">
			<view class="unStyle">
				欢迎来到【娱乐中心】，接下来的快乐时光，有我们陪着您
			</view>
			<view class="logo">
				<u-image width="300rpx" height="300rpx" :src="src" mode="widthFix" border-radius="80"></u-image>
			</view>
			<view class="loginForm">

				<view class="btn" style="margin-top: 50rpx;" @click="login">登录</view>
				<view class="btn_cancel" style="margin-top: 50rpx;" @click="cancel">取消</view>
			</view>
		</view>
		<view class="textcss">
			<view class="method">
				<checkbox-group @change="chooseThis">
					<checkbox value="cb" v-model="chooseData" color="#7fa1f7" style="transform:scale(0.8)" />
				</checkbox-group>
				<view>
					<text>勾选代表您已同意</text>
					<text style="color: #7fa1f7;" @click="toAgreement()">用户协议、隐私政策</text>
				</view>
			</view>
			<p class="text">版权所有 © 2022 winstonYv开发组</p>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			let that = this
			this.height = getApp().globalData.pageHeight - getApp().globalData.navBarHeight;
		},
		data() {
			return {
				chooseData: false,
				height: 0,
				src: '/static/applogo/intro1.png',
				loginButton: {
					marginBottom: '30rpx'
				},
				pictureUrl: '',
				isVerification: false,
			}
		},
		methods: {
			chooseThis(e) {
				if (e.detail.value.length != 0) {
					this.chooseData = true
				} else {
					this.chooseData = false
				}
			},
			// 判断是否点击了用户同意隐私协议
			toAgreement() {
				uni.navigateTo({
					url: '../agreement/agreement'
				});
			},
			cancel() {
				uni.navigateBack({
					delta: 1
				})
			},
			async login() {
				let vm = this
				if (!this.chooseData) {
					uni.showToast({
						title: '请勾选用户协议~',
						icon: "none"
					})
					return;
				}
				// 绑定电话号码之后才能算完整的登录成功
				uni.navigateTo({
					url: "/page_login/bindingPhone/bindingPhone"
				})
				wx.getUserProfile({
					desc: '获取用户基本信息',
					success(res) {
						let body = new Object()
						uni.setStorageSync("userInfo", res.userInfo);
						body.nickname = res.userInfo.nickName
						body.avatarUrl = res.userInfo.avatarUrl
						// 小程序登录的昵称和头像直接使用微信API接口可以获得，openid就需要后端解析code凭证
						uni.setStorageSync("nickname", res.userInfo.nickName);
						uni.setStorageSync("avatarUrl", res.userInfo.avatarUrl);
						wx.login().then(async (res) => {
							body.code = res.code
							uni.showLoading({
								title: '正在登录',
								mask: true
							})
							let data = await getApp().UniRequest("/user/login", "POST", body, "",
								1)
							console.log(data);
							let authority = data.data.authority
							uni.setStorageSync("authority", authority); //86400
							console.log('authority', authority);
							// 设置登录有效期时间为3天
							let pastDueDate = Date.parse(new Date()) + 259200000; // 3天
							uni.setStorageSync('pastDueDate', pastDueDate)
							//uni.setStorageSync('tokenDueDate', tokenDueDate)
							let header = new Object()
							header.Authority = authority
							getApp().globalData.header = header
							uni.hideLoading()
							let code = data.code
							if (code == 20000) {
								uni.showToast({
									title: '登录成功!',
									duration: 800
								})
								getApp().globalData.isLogin = true;
								getApp().globalData.newPerson = true;
								getApp().globalData.firstIn = false;
								getApp().globalData.haveLoading = true

								let openid = data.data.openid
								getApp().globalData.openid = openid
								// 将用户id存储到小程序缓存中
								uni.setStorageSync("openid", data.data.openid)
								// 登录成功之后进入首页
								uni.switchTab({
									url: '/pages/Home/Home'
								})
							}
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		margin: 0 50rpx;

		.logo {
			width: 100%;
			margin: 25rpx 0 35rpx 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;

			.logoText {
				margin-top: 25rpx;
				font-size: 40rpx;
				font-weight: bold;
			}
		}

		.text {
			text-align: center;
			color: #828284;
		}

		.icon {
			margin-right: 20rpx;
		}

		.login {
			margin-top: 30rpx
		}

		.authorText {
			.authorTitle {
				font-size: 35rpx;
				margin-bottom: 20rpx;
			}

			._li {
				font-size: 25rpx;
				color: #aaa;
			}

			margin-bottom: 40rpx;
		}

		.flex {
			display: flex;
			justify-content: space-between;

			.input {
				width: 200rpx;
			}

			.captcha {
				width: 350rpx;
			}
		}
	}

	.textcss {
		position: absolute;
		width: 100%;
		bottom: 0rpx;
		text-align: center;
		color: #828284;

		.method {
			margin-bottom: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.text {
			width: 100%;
			text-align: center;
		}
	}

	.loginForm {
		margin: 0 0 40px 0;
	}

	.label {
		display: flex;
		align-items: center;
		background: #f8f8f8;
		margin-top: 20px;
		border-radius: 25px;
		padding: 0 0 0 25px;
	}

	.input {
		width: calc(100% - 100rpx);
		height: 116rpx;
		font-size: 26rpx;
		font-family: Microsoft YaHei;
		font-weight: 400;
		margin-left: 30rpx;
		color: #333333;
	}

	.btn {
		height: 110rpx;
		background: #7ea2fa;
		border-radius: 50rpx;
		font-size: 37rpx;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 100rpx;
		text-align: -webkit-center;
	}

	.btn:active {
		background: #bbcaff;
	}

	.btn_cancel {
		height: 110rpx;
		background: #f6f6f6;
		border-radius: 50rpx;
		font-size: 37rpx;
		font-weight: 400;
		line-height: 100rpx;
		text-align: -webkit-center;
	}

	.btn_cancel:active {
		background: #d6d6d6;
	}

	.unStyle {
		color: #7ea2fa;
		text-align: -webkit-center;
		font-size: 18px;
		margin: 20rpx 0px;
	}

	.mottoStyle {
		text-align: -webkit-center;
		font-size: 30rpx;
		margin: 20rpx 0px;
		color: #828284;
	}

	page {
		background-color: #f6f6f6;
	}
</style>