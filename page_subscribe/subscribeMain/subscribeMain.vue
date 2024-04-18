<template>
	<view>
		<view class="reserve_datatime">
			<button v-for="(item,i) in DataList" :key="i"
				:class="selectedIndex===i?'datatime-item1 datatime-item':'datatime-item'"
				@click="switchDate(i,item.year,item.data)">
				<view>{{item.week}}</view>
				<view class="data">{{item.data}}</view>
			</button>
		</view>
		<view class="reserve_store">
			{{store}}
		</view>
		<view class="sub_room">
			<view v-for="(item,i) in reserveRoomList" :key="i">
				<ReserveRoom :roomMsg="item" @reserveRoom="reserveRoom" />
			</view>
		</view>
		<view style="height: 30px;"><!--安全区域--></view>
		<u-popup v-model="popshow" mode="bottom" width="600rpx" height="1100rpx" border-radius="30">
			<view class="reserve-time-list">
				<view class="top">
					<view class="reserve-type-select">
						<u-tabs ref="tabs" :list="cardTypeList" active-color="#7fa1f7" inactive-color="#606266"
							font-size="30" />
					</view>
					<view class="notice">
						<uni-notice-bar :text="reserveNotice" :single="true" showIcon background-color="#f6f6f6" />
					</view>
					<view class="reserve-data">
						<uni-section :title="selectedRoom" type="line">
							<view class="reserve_datatime">
								<view v-for="(item,i) in DataList" :key="i"
									:class="selectedIndex==i?'datatime-item1 datatime-item':'datatime-item'"
									@click="switchDate1(i,item.year,item.data)">
									<view>{{item.week}}</view>
									<view class="data">{{item.data}}</view>
								</view>
							</view>
						</uni-section>
					</view>
				</view>
				<scroll-view>
					<view class="free-time">
						<button v-for="(item,i) in freeList" :key="i"
							:class="ranges[i]===1?'busy-time-item free-time-item':'free-time-item'"
							:disabled="item.isFree===0?false:true" @click="selectTime(i)">
							<view>
								{{item.isNextDay==1?'次日':''}}{{item.time}}
							</view>
							<view>
								<uni-icons :type="item.isFree===1?'person-filled':''" size="15" color="#7fa1f7" />
								{{item.isFree===0?'空闲':'已预定'}}
							</view>
						</button>
					</view>
				</scroll-view>
				<view class="sub_subscribe">
					<view class="sub_total">共计：{{totalHour}}小时</view>
					<view>
						<u-button type="primary" @click="reserve" :custom-style="selectcustomStyle">
							立即预定
						</u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import ReserveRoom from "../components/ReserveRoom/ReserveRoom.vue"
	import parseData from "../lib/parseData.js"
	export default {
		components: {
			ReserveRoom,
		},
		data() {
			return {
				reserveRoomList: [],
				popshow: false,
				DataList: [],
				selectedRoom: '',
				freeList: [],
				store: '',
				selectedIndex: 0,
				cardTypeList: [{
					name: '按小时'
				}],
				reserveNotice: '24小时营业，可提前6天预约,4小时起约',
				totalHour: 0,
				selectcustomStyle: {
					width: '200rpx',
					backgroundColor: '#7fa1f7',
					borderRadius: '30rpx'
				},
				localTime: '',
				roomId: '',
				// 当前房间可以预约的24个时间段中，被点击了为1，否则为0
				ranges: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				],
				selectedTime: [],
				room: '',
			};
		},
		async onLoad() {
			this.store = getApp().globalData.store
			// 通过自定义工具类获取近七天的日期
			this.DataList = parseData.getSevenDay()

			const dataList = parseData.getSevenDay()
			// console.log("时间")
			for (var a = 0; a < dataList.length; a++) {
				console.log(dataList[a].year + dataList[a].data)
			}

			this.localTime = this.DataList[0].year + '-' + this.DataList[0].data
			let body = new Object()
			// 在全局变量中获取门店id 
			body.storeId = getApp().globalData.storeId
			body.date = this.localTime
			console.log("预约房间：" + body.storeId)
			// 获取门店所有房间信息，包括是否空闲和预约信息
			let data = await getApp().UniRequest("/reservation/getAll", "GET", body, "", 1)
			if (data.code !== 20000) {
				return uni.showToast({
					title: '数据请求失败！',
					duration: 1500,
					icon: 'none',
				})
			}
			this.reserveRoomList = data.data
		},
		methods: {
			// 点击预约，打开弹窗，并且开始选择预约时间
			async reserveRoom(room) {
				this.ranges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				]
				this.roomId = room.roomId
				this.room = room
				this.getDateTime()
				this.selectedRoom = room.roomName
				this.popshow = true
			},
			// 切换日期
			async switchDate(id, year, date) {
				this.localTime = year + '-' + date
				this.selectedIndex = id
			},
			// 切换日期时间，
			async switchDate1(id, year, date) {
				this.ranges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
				];
				this.localTime = year + '-' + date
				this.selectedIndex = id
				this.getDateTime()
			},
			// 获取该房间可以预约的24时间段，从当前时间开始算起，半个小时为一个时间段，当天不足24就算到次日中
			async getDateTime() {
				let body = new Object()
				body.roomId = this.roomId
				body.date = this.localTime
				uni.showLoading({
					title: '加载中'
				})
				let data = await getApp().UniRequest("/reservation/get", "GET", body, "", 1)
				if (data.code !== 20000) {
					return uni.showToast({
						title: '数据请求失败！',
						duration: 1500,
						icon: 'none',
					})
				}
				uni.hideLoading()
				this.freeList = data.data
				console.log(this.freeList)
				uni.setStorageSync("freeRanges", JSON.stringify(this.freeList))
			},
			async reserve() {
				if (this.totalHour < 4) {
					return uni.showToast({
						title: '4小时起订！',
						duration: 1500,
						icon: 'none',
					})
				}
				// let data = await getApp().UniRequest("/order/selectIsDoingOrder", "GET", '', "",1)
				// if (data.code === 20000) {
				//   return uni.showToast({
				//     title: '当前有尚未支付的订单',
				//     duration: 1500,
				//     icon: 'none',
				//   })
				// }
				const start = this.ranges.findIndex(item => item == 1)
				const end = this.ranges.lastIndexOf(1)
				var orderBody = new Object()
				orderBody.store = this.store
				orderBody.room = this.room
				var date = new Date(this.localTime)
				date.setDate(date.getDate() + 1);
				var newdate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') +
					'-' + date.getDate().toString().padStart(2, '0');
				// 如果所选的开始时间段是次日，就得需要解析日期
				if (this.freeList[start].isNextDay === 1) {
					orderBody.startDateTime = newdate + ' ' + String(this.freeList[start].time).substring(0, 5)
				} else {
					orderBody.startDateTime = this.localTime + ' ' + String(this.freeList[start].time).substring(0, 5)
				}
				// 如果所选的结束时间段是次日，就得需要解析日期
				if (this.freeList[end].isNextDay === 1) {
					orderBody.endDateTime = newdate + ' ' + String(this.freeList[end+1].time).substring(0, 5)
				} else {
					orderBody.endDateTime = this.localTime + ' ' + String(this.freeList[end+1].time).substring(0, 5)
				}
				// 次日时间有问题.
				orderBody.date = this.localTime
				orderBody.totalHour = this.totalHour
				orderBody.price = Number(this.totalHour * this.room.pricePerHour)
				uni.navigateTo({
					url: '/page_subscribe/submitOrder/submitOrder?orderResults=' + encodeURIComponent(JSON
						.stringify(orderBody))
				})
			},
			// 选定预约的时间段，可以选择多个，最少选择8个
			async selectTime(index) {
				// 如果当前的时间段还没选了，那么再点一次就是已选
				if (this.ranges[index] == 0) {
					this.ranges[index] = 1
					// isHaveOne和isHaveOne1方法的意思看下方注释
					if (this.isHaveOne(index) && this.isHaveOne1(index)) {
						this.ranges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
							0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
						];
						this.ranges[index] = 1
					}
					this.selectContinuous(index)
					// 每次点击选中时间段都需要刷新一下24个时间段数据，为了展示选中后的色体边框
					this.freeList = JSON.parse(uni.getStorageSync('freeRanges') || '[]')
				} else { // 如果当前的时间段已经被选了，那么再点一次就是不选
					this.ranges[index] = 0
					this.isBreakReserve(index)
					this.freeList = JSON.parse(uni.getStorageSync('freeRanges') || '[]')
				}
				// 过滤掉时间段数组中非0的数据，保留下1的就是已经选中的时间段
				var newArrays = this.ranges.filter(function(item) {
					return item == 1;
				});
				// 算出最终预约的小时数
				this.totalHour = Number(newArrays.length * 0.5);
			},
			// 如果当前点击的位置，在它之前没有一个被选中，那么从当前选的位置开始的后面全部都设置为未选中
			isBreakReserve(index) {
				var isSelected = true
				this.ranges[index] = 1
				for (let i = 0; i < index; i++) {
					if (this.ranges[i] == 1) {
						isSelected = false
					}
				}
				if (isSelected) {
					this.ranges[index] = 0
					return
				}
				for (let i = index + 1; i < this.ranges.length; i++) {
					if (this.ranges[i] == 1) {
						this.ranges[i] = 0
					}
				}
			},
			// 判断当前要选的时间段的前面时间段是否已经没有点击过
			isHaveOne(index) {
				for (let i = 0; i < index; i++) {
					if (this.ranges[i] == 1) {
						return false;
					}
				}
				return true;
			},
			// 判断当前要选的时间段的后面时间段是否已经点击过
			isHaveOne1(index) {
				for (let i = index + 1; i < this.ranges.length; i++) {
					if (this.ranges[i] == 1) {
						return true;
					}
				}
				return false;
			},
			// 如果当前点击的位置，在它之前有选中过一个，那么从那个开始到当前选的位置，全部都设置为选中
			selectContinuous(index) {
				for (let i = 0; i < index; i++) {
					if (this.ranges[i] == 1) {
						for (let j = i + 1; j < index; j++) {
							this.ranges[j] = 1
						}
						return
					}
				}
			}
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

	.reserve_datatime {
		display: flex;
		justify-content: space-between;
		padding-top: 25rpx;
		padding-bottom: 25rpx;
		background-color: #fff;

		.datatime-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			background: rgba(134, 161, 235, 0.3);
			padding: 15rpx;
			border-radius: 8px;
			margin-right: 8rpx;
			margin-left: 8rpx;
			font-size: 10px;

			.data {
				margin-top: 18rpx;
			}
		}

		.datatime-item1 {
			background-color: #7fa1f7;
		}
	}

	.reserve_store {
		padding: 15rpx;
		font-size: 18px;
		font-weight: 500;
	}

	.reserve-time-list {
		.top {
			background-color: #fff;
			position: sticky;
			z-index: 9999;
			top: 0;
			height: 400rpx;

			.notice {
				height: 80rpx;
			}

			.reserve-data {
				.reserve_datatime {
					display: flex;
					justify-content: space-between;
					padding-top: 25rpx;

					.datatime-item {
						display: flex;
						flex-direction: column;
						justify-content: center;
						background: rgba(134, 161, 235, 0.3);
						padding: 15rpx;
						border-radius: 8px;
						margin-right: 8rpx;
						margin-left: 8rpx;
						font-size: 10px;

						.data {
							margin-top: 18rpx;
						}
					}

					.datatime-item1 {
						background-color: #7fa1f7;
					}
				}
			}
		}

		.free-time {
			display: flex;
			flex-wrap: wrap;

			.free-time-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				width: 23%;
				margin-right: 6rpx;
				margin-left: 6rpx;
				margin-top: 28rpx;
				background: rgba(134, 161, 235, 0.3);
				border-radius: 30rpx;
				font-size: 9px;
				padding: 15rpx 4rpx;
				// view{
				//   text-align: center;
				//   background: rgba(134, 161, 235, 0);
				//   border: 0px solid rgba(134, 161, 235, 0);
				// }
			}

			.busy-time-item {
				border: 2px solid #7fa1f7;
				// view{
				//   background: #e6e6e6;
				//   border: 0px solid #e6e6e6;
				//   color: #000;
				// }
			}
		}

		.sub_subscribe {
			background-color: #fff;
			position: sticky;
			width: 100%;
			height: 150rpx;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx;

			.sub_total {
				color: #f7434d;
			}
		}
	}
</style>