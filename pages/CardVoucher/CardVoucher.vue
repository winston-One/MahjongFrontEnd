<template>
	<view>
		<view class="top">
			<view class="subsection">
				<u-subsection :list="cardTypeList" :current="cardType" active-color="#7fa1f7" @change="sectionChange" />
			</view>
		</view>
		<view class="card_list" v-if="cardType === 0">
			<view v-for="(item,i) in cardLists" :key="i" class="card_item" v-if="cardLists.length!==0">
				<Coupon :couponMsg="item" @purchase="purchase"></Coupon>
			</view>
			<view v-if="cardLists.length===0" class="card_empty">
				<u-empty text="当前暂无可售券" mode="list"></u-empty>
			</view>
		</view>
		<view class="exchange" v-if="cardType === 1">
			<view class="exchange-bussiness">
				<image src="../../static/coupon/meituan.png" class="meituan"></image>
				<image src="../../static/coupon/comment.png" class="comment"></image>
			</view>
			<view class="tip">美团、大众点评自助验券</view>
			<view class="input-box">
				<input class="redeem" placeholder="输入卡券兑换码" focus v-model="redeemCode" />
				<u-icon size="50" name="scan" @click="scanCode" />
			</view>
			<view class="select-button">
				<u-button type="primary" @click="exchangeCode" :custom-style="selectcustomStyle">兑换</u-button>
			</view>
		</view>
		<u-popup v-model="popshow" mode="center" width="600rpx" height="820rpx" border-radius="20">
			<MeituanVoucher :meituanMsg="meituanMsg" @cancel="cancel" @eliminate="eliminate"></MeituanVoucher>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: '',
				popshow: false,
				meituanMsg: '',
				cardTypeList: [{
						name: '卡券'
					},
					{
						name: '兑换'
					}
				],
				cardType: 0,
				selectcustomStyle: {
					width: '400rpx',
					backgroundColor: '#7fa1f7',
					borderRadius: '50rpx'
				},
				redeemCode: '',
				cardLists: [],
			};
		},
		onLaunch() {
			this.token = uni.getStorageSync('authority')
		},
		onShow() {
			this.token = uni.getStorageSync('authority')
      ///////////////////////////
			this.cardType = uni.getStorageSync('couponType')
		},
		async onLoad() {
			// 如果将登录功能打开，就需要通过token，后续判断登录了才能消券
			this.token = uni.getStorageSync('authority')

			let data = await getApp().UniRequest("/voucher/allVoucher", "POST", "", "", 1)
			if (data.code !== 20000) {
				return uni.showToast({
					title: '数据请求失败！',
					duration: 1500,
					icon: 'none',
				})
			}
			this.cardLists = data.data
		},
		methods: {
			cancel() {
				this.popshow = false
			},
			// 消券
			async eliminate(receiptCode) {
				if (this.token === '') {
					uni.navigateTo({
						url: "/page_login/login/login"
					})
					return;
				}
				let obj = new Object()
				obj.userId = getApp().globalData.openid
				obj.receiptCode = receiptCode
				obj.count = uni.getStorageSync('count')
				let data = await getApp().UniRequest("/DianPing/verificationWrittenOff", "POST", obj, "", 1)
				if (data.code === 1006) {
					return uni.showToast({
						title: '券码错误',
						duration: 1500,
						icon: 'none',
					})
				}
				if (data.code === 1013) {
					return uni.showToast({
						title: '该券已被销',
						duration: 1500,
						icon: 'none',
					})
				}
				if (data.code !== 20000) {
					return uni.showToast({
						title: '数据请求失败！',
						duration: 1500,
						icon: 'none',
					})
				}
				uni.showModal({
					title: '消券成功',
					content: '您的团购券已销，快去预定房间吧~',
					showCancel: false,
					async success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/page_mine/myCoupon/myCoupon'
							})
						}
					}
				})
				this.popshow = false
			},
			sectionChange(index) {
				this.cardType = index
			},
			// 输入美团大众券码，进行验券
			async exchangeCode() {
				this.meituanMsg = ''
				if (this.token === '') {
					uni.navigateTo({
						url: "/page_login/login/login"
					})
					return;
				}
				if (this.redeemCode === '') {
					uni.showToast({
						duration: 1500,
						title: '兑换码不能为空',
						icon: 'none',
					})
					return
				}
				let body = new Object()
				body.userId = getApp().globalData.openid
				body.receiptCode = this.redeemCode
				body.count = 1
				let data = await getApp().UniRequest("/DianPing/verification", "POST", body, "", 1)
				if (data.code === 1008) {
					return uni.showToast({
						title: '该券已销',
						duration: 1500,
						icon: 'none',
					})
				}
				if (data.code !== 20000) {
					return uni.showToast({
						title: '数据请求失败！',
						duration: 1500,
						icon: 'none',
					})
				}
				let meituan = new Object()
				meituan.receiptCode = data.data.receiptCode
				meituan.duration = data.data.dianPingVoucherOrder.duration
				meituan.status = data.data.dianPingVoucherOrder.status
				meituan.room = data.data.dianPingVoucherOrder.room
				meituan.count = data.data.count
				meituan.price = data.data.dianPingVoucherOrder.price
				uni.setStorageSync('count', data.data.count)
				this.meituanMsg = meituan
				this.popshow = true
			},
			// 扫码验券，查券
			async scanCode() {
				if (this.token === '') {
					uni.navigateTo({
						url: "/page_login/login/login"
					})
					return;
				}
				this.meituanMsg = ''
				var that = this
				// 调用uniapp扫描二维码的接口
				uni.scanCode({
					scanType: ['qrCode'], // 指定扫描的类型是二维码
					success: async function(res) {
						console.log('条码内容：' + res.result);
						let qrObj = new Object()
						qrObj.userId = getApp().globalData.openid
						qrObj.receiptCode = res.result
						qrObj.count = 1
						// 请求验券接口
						let data = await getApp().UniRequest("/DianPing/verificationByQRCode", "POST",
							qrObj, "", 1)
						// 验券成功
						if (data.code === 1008) {
							return uni.showToast({
								title: '该券已销',
								duration: 1500,
								icon: 'none',
							})
						}
						if (data.code !== 20000) {
							return uni.showToast({
								title: '数据请求失败！',
								duration: 1500,
								icon: 'none',
							})
						}
						// 验券或者查券成功之后将券的信息封装到实体meituanMsg中，在弹窗中展示
						let meituan = new Object()
						meituan.receiptCode = data.data.receiptCode
						meituan.duration = data.data.dianPingVoucherOrder.duration
						meituan.status = data.data.dianPingVoucherOrder.status
						meituan.room = data.data.dianPingVoucherOrder.room
						meituan.count = data.data.count
						meituan.price = data.data.dianPingVoucherOrder.price
						uni.setStorageSync('count', data.data.count)
						that.meituanMsg = meituan
						// 打开弹窗
						that.popshow = true
					}
				});
			},
			// 购买卡券
			purchase(couponMsg) {
				// 如果未登录会自动跳转到登录接口
				if (this.token === '') {
					uni.navigateTo({
						url: "/page_login/login/login"
					})
					return;
				}
				// 传输数组时候，需要使用encodeURICompone进行编码压缩
				uni.navigateTo({
					url: '/page_coupon/purchaseCoupon/purchaseCoupon?coupon=' + encodeURIComponent(JSON.stringify(
						couponMsg))
				})
			},
		},
	}
</script>

<style lang="scss">
	* {
		margin: 0;
		padding: 0;
	}

	page {
		background-color: #f6f6f6;
	}

	.top {
		position: sticky;
		height: 180rpx;
		z-index: 9999;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid #efefef;
		padding-top: 102rpx;
		top: 0;

		.subsection {
			width: 60%;
		}
	}

	.card_list {
		padding: 15rpx;

		.card_item {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.card_empty {
			padding: 50rpx;
		}
	}

	.exchange {
		display: flex;
		flex-direction: column;
		align-items: center;

		.exchange-bussiness {
			margin-top: 15rpx;
			position: relative;
			height: 160rpx;

			.meituan {
				position: absolute;
				width: 150rpx;
				height: 150rpx;
				right: -20rpx;
				z-index: 999;
			}

			.comment {
				position: absolute;
				width: 150rpx;
				height: 150rpx;
				left: -30rpx;
			}
		}

		.tip {
			margin-top: 15rpx;
		}

		.input-box {
			display: flex;
			justify-content: space-between;
			margin-top: 15rpx;

			.redeem {
				border: none;
				border-bottom: 1px solid #000;
			}
		}

		.select-button {
			margin-top: 15rpx;
		}
	}
</style>