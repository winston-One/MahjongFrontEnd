<template>
	<view class="container" style="background: linear-gradient(168deg, #7fc9f7, #feffff);">
		<view style="padding-top: 54px;font-size: 20px;text-align: center;">我的店铺</view>
		<view class="cont1" @click="toEditShop">
			<view class="flexStyle">
				<image style="width: 150rpx;height: 150rpx;border-radius: 30rpx;" :src="obj.image"
					@click.stop="watchImage(imgList,0)"></image>
				<view style="position: relative;right: 10px;">
					<view class="flexStyle titleAnd">
						<image v-if="obj.isGroup == 0" style="" class="yingyeStyle3"
							src="http://1.14.247.152:9797/myImages/tuangougou.png"></image>
						<text class="title_n">{{nameStr}}</text>
					</view>
					<view class="yingyeshijian">
						<view v-if="hoursList[0] != undefined && obj.isTime == 0"
							style="padding: 2rpx 0 0 0;font-size: 13px;color: #717171;">
							营业时间：{{hoursList[0].startTime}} ~ {{hoursList[0].endTime}}
						</view>
						<view v-else-if="obj.isTime == 1" style="padding: 2rpx 0 0 0;font-size: 13px;color: #717171;">
							集中配送，点击“配送管理”查看详情
						</view>
					</view>
					<view class="flexStyle">
						<view class="wayStyle">
							<view v-if="obj.way == 0" class="flexStyle2">
								<image class="yingyeStyle" src="http://1.14.247.152:9797/myImages/pzt.png"></image>
								<view style="font-size: 13px;color: #717171;">配送+自取</view>
								<!-- width: 35rpx;height: 35rpx; -->
							</view>
							<view v-else-if="obj.way == 1" class="flexStyle2">
								<image class="yingyeStyle" src="http://1.14.247.152:9797/myImages/qishouyi.png"></image>
								<view style="font-size: 13px;color: #717171;">仅自取</view>
							</view>
							<view v-else-if="obj.way == 2" class="flexStyle2">
								<image class="yingyeStyle" src="http://1.14.247.152:9797/myImages/dingweiwei.png">
								</image>
								<view style="font-size: 13px;color: #717171;">仅配送</view>
							</view>
						</view>
						<view class="yingye">
							<view v-if="obj.isSuspend == 0 && obj.state == 1" class="flexStyle2">
								<image style="" class="yingyeStyle2" src="http://1.14.247.152:9797/myImages/yingyz.png">
								</image>
								<view style="font-size: 13px;color: #717171;">营业中</view>
							</view>
							<view v-else-if="obj.isSuspend == 0 && obj.state == 0" class="flexStyle2">
								<image style="" class="yingyeStyle2" src="http://1.14.247.152:9797/myImages/xiuxz.png">
								</image>
								<view style="font-size: 13px;color: #717171;">已休息</view>
							</view>
							<view v-else-if="obj.isSuspend == 1" class="flexStyle2">
								<image style="" class="yingyeStyle2" src="http://1.14.247.152:9797/myImages/xiuxz.png">
								</image>
								<view style="font-size: 13px;color: #717171;">暂停营业</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cont2" @click="toData">
			<view class="flexStyle" style="height: 66px;">
				<view class="flexStyle4">
					<view class="jinrishoukuan">今日营业额</view>
					<view v-if="todayData.turnOver != undefined && todayData.turnOver == 0" class="jinridingdanliang">
						暂无已完成</view>
					<view v-else-if="todayData.turnOver != undefined" class="yingyee">{{todayData.turnOver}}&nbsp;元
					</view>
				</view>
				<view class="order_t">
					<view class="border_r">
						1
					</view>
				</view>
				<view class="flexStyle4">
					<view class="dingdanliang">今日订单</view>
					<view v-if="todayData.orderNum != undefined && todayData.orderNum == 0" class="jinridingdanliang">
						暂无已完成</view>
					<view v-else-if="todayData.orderNum != undefined && todayData.orderNum > 0"
						class="jinridingdanliang">
						{{todayData.orderNum}}&nbsp;单
					</view>
				</view>
				<view class="order_t">
					<view class="border_r">
						1
					</view>
				</view>
				<view class="flexStyle4">
					<view class="dingdanliang">今日顾客</view>
					<view v-if="todayData.custNum != undefined && todayData.custNum == 0" class="jinridingdanliang">
						暂无已完成</view>
					<view v-else-if="todayData.custNum != undefined" class="jinridingdanliang">
						{{todayData.custNum}}&nbsp;名
					</view>
				</view>
			</view>
		</view>

		<view class="cont3" @click="order" v-if="todayData.unDoneOrderNum > 0">
			<view class="flexStyle" style="place-content: center;padding: 20rpx 0;">
				<view class="unDoneStyle">今天还有{{todayData.unDoneOrderNum}}单待完成</view>
			</view>
		</view>

		<view class="cont">
			<view class="order_list2 border_b" @click="order">
				<view class="order_list_l">
					<image style="width: 42rpx;height: 42rpx;" src="http://1.14.247.152:9797/myImages/dingdandan.png">
					</image>
					<text class="textStyle">订单管理</text>
				</view>
				<view class="order_list_r">
					<image src="../../static/youjiantou.png"></image>
				</view>
			</view>
			<view class="order_list2" @click="toRecord">
				<view class="order_list_l">
					<image style="width: 42rpx;height: 42rpx;" src="http://1.14.247.152:9797/myImages/gkxx.png"></image>
					<text class="textStyle">顾客消息</text>
				</view>
				<view class="item-msg-icon" v-if="unreadCount > 0">{{unreadCount}}</view>
				<view class="order_list_r">
					<image src="../../static/youjiantou.png"></image>
				</view>
			</view>
		</view>
		<view class="cont">
			<view class="order_list2 border_b" @click="goods">
				<view class="order_list_l">
					<image style="width: 42rpx;height: 42rpx;" src="http://1.14.247.152:9797/myImages/caipinpin.png">
					</image>
					<text class="textStyle">商品管理</text>
				</view>
				<view class="order_list_r">
					<image src="../../static/youjiantou.png"></image>
				</view>
			</view>
			<view class="order_list2 border_b" @click="group" v-if="obj.type == 0">
				<view class="order_list_l">
					<image style="width: 42rpx;height: 42rpx;" src="http://1.14.247.152:9797/myImages/tuangougou.png">
					</image>
					<text class="textStyle">拼团管理</text>
				</view>
				<view class="order_list_r">
					<image src="../../static/youjiantou.png"></image>
				</view>
			</view>
			<view class="order_list2" @click="delivery">
				<view class="order_list_l">
					<!-- <image style="width: 42rpx;height: 42rpx;" src="http://1.14.247.152:9797/myImages/motuotuo.png"></image> -->
					<image style="width: 42rpx;height: 42rpx;" src="http://1.14.247.152:9797/myImages/qishouyi.png">
					</image>
					<text class="textStyle">配送管理</text>
				</view>
				<view class="order_list_r">
					<image src="../../static/youjiantou.png"></image>
				</view>
			</view>

		</view>
		<view class="cont">
			<view class="order_list2 border_b" @click="youhui">
				<view class="order_list_l">
					<image style="width: 42rpx;height: 42rpx;" src="http://1.14.247.152:9797/myImages/youhuihui.png">
					</image>
					<text class="textStyle">优惠活动</text>
				</view>
				<view class="order_list_r">
					<image src="../../static/youjiantou.png"></image>
				</view>
			</view>
			<view class="order_list2 border_b" @click="toData">
				<view class="order_list_l">
					<image style="width: 42rpx;height: 42rpx;" src="http://1.14.247.152:9797/myImages/shujuju.png">
					</image>
					<text class="textStyle">数据统计</text>
				</view>
				<view class="order_list_r">
					<image src="../../static/youjiantou.png"></image>
				</view>
			</view>
			<view class="order_list2" @click="toWork">
				<view class="order_list_l">
					<image style="width: 42rpx;height: 42rpx;" src="../../static/gzcb.png"></image>
					<text class="textStyle">工作餐表</text>
				</view>
				<view class="order_list_r">
					<image src="../../static/youjiantou.png"></image>
				</view>
			</view>
		</view>
		<view class="footStyle">
			<image style="  height: 80rpx; width: 80rpx; left: 200rpx; position: relative;" src="../../static/mine/contactBussiness.png"/>
			<view style="position: relative;top: 20rpx;right: 190rpx;color: #a9a9a9;">
				WinstonYv提供技术支持
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				obj: {},
				list: [],
				dingdan: {},
				imgList: [''],
				hoursList: [],
				todayData: {},
				unreadCount: 0, //消息未读数,
				nameStr: ''
			}
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中...'
			})
			this.onShowAndonLoad()
		},
		onShow() {
			this.onShowAndonLoad(1)
		},
		methods: {
			onPullDownRefresh(value) {
				console.log('触发下拉刷新了');
				this.onShowAndonLoad();
			},
			async onShowAndonLoad(value) {
				uni.showLoading({
					title: '正在加载'
				})
				this.$myRequest('/business/store/authority/getShopInfo', 'get', '')
					.then(res => {
						console.log(res, 'getShopInfo');
						if (res.data.code == 555) {
							uni.showModal({
								title: '提示',
								content: '请截图发给管理员，配置营业时间',
								showCancel: false
							})
							return
						}
						this.obj = res.data.data.data;
						this.nameStr = this.obj.shopName.length > 11 ? this.obj
							.shopName.substring(0, 11) + '...' : this.obj.shopName
						getApp().globalData.shopInfo = this.obj
						// console.log(getApp().globalData.shopInfo,'getApp().globalData.shopInfo')
						this.imgList[0] = this.obj.image
						// console.log(this.imgList[0],'this.imgList[0]')
						// console.log(this.obj,'this.obj');
						uni.setStorageSync('shopId', res.data.data.data.id)
						uni.setStorageSync('shopInfo', res.data.data.data)
					})

				this.$myRequest('/business/store/authority/getBusinessHours', 'get',
					'').then(res => {
					this.hoursList = res.data.data.data
					for (let i = 0; i < this.hoursList.length; i++) {
						this.hoursList[i].startTime = this.hoursList[i]
							.startTime.substring(0, 5)
						this.hoursList[i].endTime = this.hoursList[i].endTime
							.substring(0, 5)
						// console.log(this.hoursList[i].startTime,'this.hoursList[i].startTime')
						// console.log(this.hoursList[i].endTime,'this.hoursList[i].endTime')
					}
					// console.log(this.hoursList,'营业时间');
				});
				let shopId = uni.getStorageSync('shopId')
				this.$myRequest(`/IM/controller/shopUnreadCount?shopId=${shopId}`,
					'get', '').then(res => {
					if (res.data.code === 20000) {
						this.unreadCount = res.data.data.unreadCount
						// console.log('消息未读数',res)
					}
				});
				// console.log('---------------今日数据-----------------')
				console.log('请求今日数据..............')
				this.$myRequest(`/business/store/authority/getTodaySettle`, 'get',
					'').then(res => {
					console.log('今日数据', res)
					if (res.data.code === 20000) {
						this.todayData = res.data.data.todayData;
					}
				});
				uni.hideLoading()
			},
			toEditShop() {
				uni.navigateTo({
					url: '/pages/shopinfo/shopinfo'
				})
			},
			msg() {
				uni.navigateTo({
					url: '/pages/goods/goods'
				})
			},
			order() {
				uni.navigateTo({
					url: '/pages/order/order'
				})
			},
			watchImage(imglist, indexs) {
				// console.log(this.imgList,'imgList')
				uni.previewImage({
					current: indexs,
					urls: imglist
				});
			},
			goods() {
				uni.navigateTo({
					url: '/pages/goods/goodsList_scroll'
				})
			},
			delivery() {
				uni.navigateTo({
					url: '/pages/shopPlace/choose'
				})
			},
			toRecord() {
				uni.navigateTo({
					url: `/page_chat/typeRecord/typeRecord?type=2`
				})
			},
			group() {
				if (this.obj.type != 0) {
					uni.showToast({
						title: '您不是团购商家',
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/classifyGroup/classifyGroup'
				})
			},
			toWork() {
				uni.navigateTo({
					url: '/page_work/work/work'
				})
			},
			toData() {
				uni.navigateTo({
					url: '/page_data/data/data'
				})
			},
			toGuKe() {
				uni.navigateToMiniProgram({
					appId: "wx07ba00d351fa34c4"
				})
			},
			onShareAppMessage(res) {
				console.log(res, '转发')
				if (res.from === 'button') {
					return {
						title: 'Hi校园商家端',
						path: '/pages/function/function'
					}
				}
			},
			fenxiang() {
				uni.navigateToMiniProgram({
					appId: "wx07ba00d351fa34c4"
				})
			},
			youhui() {
				uni.navigateTo({
					url: '/pages/youhui/chooseyouhui'
				})
			},
		}
	}
</script>

<style>
	.item-msg-icon {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #f06c7a;
		color: #fff;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		position: absolute;
		left: 210rpx;
	}

	.timeAndUpdate {
		display: flex;
		justify-content: space-between;
	}

	.cont_us_t_icon {
		color: #FFFFFF;
		border-radius: 40rpx;
		padding: 5rpx 15rpx;
		font-size: 28rpx;
		background: #debadb;
		;
		display: inline-block;
		margin-left: -20rpx;
	}

	.font_list {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 60rpx 0;
		color: #69646a;
		font-size: 28rpx;
		text-align: center;
	}

	.order_list_r image {
		height: 40rpx;
		width: 40rpx;
	}

	.order_list_l {
		font-size: 30rpx;
		color: #333333;
		display: flex;
		align-items: center;
	}

	.order_list_l image {
		height: 50rpx;
		width: 50rpx;
		margin-right: 10rpx;
	}

	.order_list {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.order_list2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 15px 30rpx 15px;
	}

	.order_list2:active {
		background: #f8f8f8;
	}

	.border_b {
		border-bottom: 4rpx solid #f6f6f6;
	}

	.order_t_num {
		padding: 30rpx 0;
		font-size: 38rpx;
		color: #333333;
	}

	.order_t {
		text-align: center;
		padding-top: 30rpx;
		font-size: 26rpx;
		color: #9d9b8e;
		margin-bottom: 40rpx;
		height: 150rpx;
	}

	.cont1 {
		border-radius: 30rpx;
		background: #ffffff;
		padding: 30rpx;
		margin: 0 30rpx 20rpx;
		transform: translateY(-100rpx);
		top: 150rpx;
		position: relative;
		height: 205rpx;
	}

	.cont {
		border-radius: 30rpx;
		background: #ffffff;
		/* padding: 10rpx 30rpx 10rpx 30rpx; */
		margin: 0 30rpx 20rpx;
		transform: translateY(-100rpx);
		top: 150rpx;
		position: relative;
	}

	.cont2 {
		border-radius: 30rpx;
		background: #ffffff;
		padding: 30rpx;
		margin: 0 30rpx 20rpx;
		transform: translateY(-100rpx);
		top: 150rpx;
		position: relative;
	}

	.cont3 {
		border-radius: 30rpx;
		background: #ffffff;
		margin: 0 30rpx 20rpx;
		transform: translateY(-100rpx);
		top: 150rpx;
		position: relative;
	}

	.cont1:active {
		background: #f8f8f8;
	}

	.cont2:active {
		background: #f8f8f8;
	}

	.cont3:active {
		background: #f8f8f8;
	}

	.title {
		background: #f6f6f6;
		padding: 0 30rpx 140rpx;
	}

	.title_t {
		font-size: 28rpx;
		display: flex;
		justify-content: space-between;
		padding-bottom: 10rpx;
	}

	.title_btn text {
		margin-left: 10rpx;
	}

	.title_btn {
		background: #c9c7ba;
		border-radius: 40rpx;
		padding: 6rpx 20rpx;
	}

	.title_n {
		font-size: 36rpx;
		float: right;
		/* 		position: relative;
		right: 360rpx; */
		font-weight: 600;
		width: 225px;
	}

	.container {
		box-sizing: border-box;
	}

	page {
		background: #fafeff;
	}

	.flexStyle {
		display: flex;
		justify-content: space-between;
	}

	.titleAnd {
		position: relative;
	}

	.flexStyle2 {
		display: flex;
	}

	.flexStyle3 {
		display: flex;
		position: relative;
		top: 10rpx;
	}

	.flexStyle4 {
		width: 320rpx;
		justify-content: space-between;
	}
	.yingyeStyle {
		width: 30rpx;
		height: 30rpx;
		padding: 2.5px 5px 1px 0;
		position: relative;
		bottom: 1rpx;
	}

	.yingyeStyle3 {
		width: 45rpx;
		height: 45rpx;
		padding: 2.5px 5px 1px 0;
		position: relative;
		bottom: 1rpx;
	}

	.yingyeStyle2 {
		width: 30rpx;
		height: 30rpx;
		padding: 2.5px 5px 1px 0;
		position: relative;
		bottom: 1rpx;
	}

	.yingyeshijian {
		position: relative;
		margin: 15rpx 0 23rpx 0;
	}

	.wayStyle {
		position: relative;
	}

	.shenfen {
		position: absolute;
		left: 200rpx;
		bottom: 50rpx;
	}

	.textStyle {
		font-weight: 600;
		font-size: 34rpx;
	}

	.footStyle {
		display: flex;
		justify-content: space-between;
		position: relative;
		top: 120rpx;
		padding: 0 0 150rpx 0;
	}

	.border_r {
		color: #FFFFFF;
		border-right: 3.5rpx solid #e4e4e4;
		height: 140rpx;
		position: relative;
		bottom: 36rpx;
	}

	.jinrishoukuan {
		text-align: center;
		position: relative;
		font-weight: 600;
		font-size: 36rpx;
	}

	.dingdanliang {
		font-weight: 600;
		position: relative;
		font-size: 36rpx;
		text-align: center;
	}

	.yingyee {
		position: relative;
		font-size: 36rpx;
		color: #7fa1f7;
		font-weight: 600;
		text-align: center;
		top: 30rpx;
	}

	.unDoneStyle {
		position: relative;
		font-size: 35rpx;
		font-weight: 700;
		color: #7fa1f7;
	}

	.jinridingdanliang {
		position: relative;
		font-size: 36rpx;
		color: #7fa1f7;
		font-weight: 600;
		top: 30rpx;
		text-align: center;
	}

	.jinridingdanliang2 {
		position: relative;
		font-size: 36rpx;
		color: #7fa1f7;
		font-weight: 600;
		top: 3px;
		text-align: center;
	}

	.unreadCount {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #f06c7a;
		color: #fff;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		position: relative;
	}
</style>
