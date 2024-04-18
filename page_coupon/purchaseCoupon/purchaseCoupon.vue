<template>
	<view class="submit-order">
		<view class="order-msg">
			<view class="flex-style">
				<view class="coupon-name">卡券名称</view>
				<view class="reserve_time">
					<view>{{voucherName}}</view>
				</view>
			</view>
			<view class="flex-style">
				<view class="coupon-name">可用范围</view>
				<view class="reserve_time">
					<view>{{availableRange}}</view>
				</view>
			</view>
			<view class="flex-style">
				<view class="coupon-name">有效期至</view>
				<view class="reserve_time">
					<view>购买后{{validityPeriod}}天内有效</view>
				</view>
			</view>
			<view class="coupon-style">
				<view>该卡券可用次数：1次</view>
				<view>该卡券周一、二、三、四、五、六、日，全天可用</view>
				<view>该卡券购买后立即生效</view>
			</view>
		</view>
		<view class="tip">
			<view>温馨提示</view>
			<view>如有不可抗力因素，请致电商家并且初始不可抗力因素证明!!!</view>
		</view>
		<view class="reservation">
			<view class="reservation_total">
				总计：￥{{price}}
			</view>
			<view class="confirm_btn" @click="purchaseReserve">确定购买</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				voucherId: '',
				voucherName: '',
				title: '',
				availableRange: '',
				price: 0,
				room: '',
				validityPeriod: 30,
				duration: 3,
				ip: [],
			};
		},
		onLoad(option) {
			let that = this
			// uni.request({ // 获取ip地址
			// 	url: 'https://pv.sohu.com/cityjson?ie=utf-8',
			// 	method: 'POST',
			// 	success: (res) => {
			// 		const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
			// 		let ip = reg.exec(res.data);
			//     that.ip = ip;
			// 	}
			// })
			// console.log(this.ip[0]);
			var data = JSON.parse(decodeURIComponent(option.coupon))
			console.log("卡券订单", data);
			this.voucherId = data.voucherId
			this.voucherName = data.title
			this.availableRange = data.availableRange
			this.price = data.price
			this.validityPeriod = data.term
		},
		methods: {
			setTimeDateFmt(s) { // 个位数补齐十位数
				return s < 10 ? '0' + s : s;
			},
			createordernum() {
				const now = new Date()
				let month = now.getMonth() + 1
				let day = now.getDate()
				let hour = now.getHours()
				let minutes = now.getMinutes()
				let seconds = now.getSeconds()
				month = this.setTimeDateFmt(month)
				day = this.setTimeDateFmt(day)
				hour = this.setTimeDateFmt(hour)
				minutes = this.setTimeDateFmt(minutes)
				seconds = this.setTimeDateFmt(seconds)
				let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math
					.round(Math.random() * 1000000)).toString();
				return orderCode;
				//基于年月日时分秒+随机数生成订单编号
			},
			async purchaseReserve() {
				// 下单并且支付
				uni.showLoading({
					title: "加载中",
					mask: true
				})
				if (this.price <= 0) {
					uni.showModal({
						title: '提示',
						content: '无法支付，请联系客服',
						showCancel: false,
						success: res => {
							uni.navigateBack()
						}
					})
				}
				var orderNo = this.createordernum()
				let body = new Object()
				body.orderId = orderNo
				body.openid = getApp().globalData.openid
				body.voucherId = this.voucherId
				let data = await getApp().UniRequest("/voucherUser/booking", "GET", body, "", 1)
				console.log('res-----', data)
				uni.hideLoading()
				if (data.code !== 20000) {
					return uni.showToast({
						title: '数据异常',
						duration: 1500,
						icon: 'none',
					})
				} else {
					var that = this
					uni.showModal({
						title: '提示',
						content: '支付' + that.price + "元",
						confirmColor: "#7fabf7",
						confirmText: "支付",
						success: async (res) => {
							if (res.confirm) {
								console.log('用户点击确定');
								let request = new Object()
								request.openid = getApp().globalData.openid
								request.realPrice = that.price
								request.orderNo = orderNo
								let res = await getApp().UniRequest("/business/payCoupon", "POST", request, '', 1)
								if (res.code !== 20000) {
									return uni.showToast({
										title: "支付处理错误",
										duration: 1500,
										icon: 'none',
									})
								}
								uni.navigateTo({
									url: '/page_mine/myCoupon/myCoupon'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
								return
							}
						}
					})
				}
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

	.submit-order {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.order-msg {
			display: flex;
			flex-direction: column;
			justify-content: center;
			background-color: #fff;
			margin-top: 15rpx;

			.flex-style {
				display: flex;
				justify-content: space-between;
				padding: 45rpx;
				border-bottom: 2px solid #f6f6f6;

				.reserve_time {
					display: flex;
					justify-content: flex-end;
				}

				.coupon-name {
					font-weight: 200;
				}
			}

			.coupon-style {
				display: flex;
				flex-direction: column;
				padding: 30rpx;
				font-weight: 200;
				border-bottom: 2px solid #f6f6f6;
			}
		}

		.tip {
			background-color: #fff;
			margin-top: 15rpx;
			padding: 25rpx;
		}
	}

	.reservation {
		position: fixed;
		height: 250rpx;
		bottom: 0;
		font-size: 17px;
		width: 100%;
		border-top-right-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		padding: 25rpx;

		.reservation_total {
			color: #f7434d;
		}

		.confirm_btn {
			background-color: #7fa1f7;
			color: #fff;
			height: 100rpx;
			width: 40%;
			border-radius: 35rpx;
			text-align: center;
			padding: 25rpx;
		}
	}

	.coupon_list {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		padding: 20rpx;

		.coupon_item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			border-bottom: 2px solid #e6e6e6;
			height: 100rpx;

			.msg {
				font-size: 16px;
				font-weight: 500;
			}

			.btn {
				font-size: 14px;
				background-color: #7fa1f7;
				height: 80rpx;
				width: 150rpx;
				border-radius: 30rpx;
				padding: 0;
				margin: 0;
				text-align: center;
			}
		}
	}
</style>