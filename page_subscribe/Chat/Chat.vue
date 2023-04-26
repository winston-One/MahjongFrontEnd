<template>
	<view>
		<u-navbar :title="navTitle">
			<view style="margin-left: 30rpx;">
				<image class="navIcon" src="http://1.14.247.152:9797/images/三点.svg" mode="" @click="setting"></image>
			</view>
		</u-navbar>
		<view class="order_card" v-if="showOrderCard">
			<view class="card">
				<view class="left">
					<view class="orderNo">
						{{orderMsg.orderNo}}
					</view>
					<view class="goods_list">
						<view class="goodsItem" v-for="(item,index) in orderMsg.goodsList">
							{{item.goodsName+"x"+item.number}}
						</view>
					</view>
				</view>
				<view class="right">
					<u-button class="btn" type="primary" size="mini" @click="sendOrder">发送订单</u-button>
					<u-button class="btn" type="error" size="mini" @click="cancelSendOrder">取消发送</u-button>
				</view>
			</view>
		</view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory"
				upper-threshold="50">
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="!isDone">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(item,index) in msgList" :key="index" :id="item.id">
					<view class="time" v-if="needToShowTime(index)">
						{{timeFliter(item.createTime)}}
					</view>
					<!-- 用户消息 -->
					<block>
						<!-- 自己发出的消息 -->
						<view class="my" v-if="item.sendId == myOpenid">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="item.type==1" class="bubble">
									<rich-text :nodes="nodesFliter(item.content)"></rich-text>
								</view>
								<image @click="showPic(item.content)" class="image" v-if="item.type==2"
									:src="item.content" mode="widthFix"></image>
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="userInfo.avatarUrl" @click="toMyPage"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-else>
							<!-- 左-头像 -->
							<view class="left">
								<image :src="toUserInfo.avatarUrl" @click="toTaPage"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<!-- 文字消息 -->
								<view v-if="item.type==1" class="bubble">
									<rich-text :nodes="nodesFliter(item.content)"></rich-text>
								</view>
								<image @click="showPic(item.content)" class="image" v-if="item.type==2"
									:src="item.content" mode="widthFix"></image>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
				<swiper-item v-for="(page,pid) in emojiList" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
						<image mode="widthFix" :src="'../../static/emoji/'+em.url"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage">
						<view class="icon tupian2"></view>
					</view>
					<view class="box" @tap="camera">
						<view class="icon paizhao"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<view class="textbox">
				<view class="text-mode" :class="isVoice?'hidden':''">
					<view class="box">
						<textarea class="textarea" @confirm="sendText" maxlength="200" v-model="textMsg"
							@focus="textareaFocus" :showConfirmBar="false" cursor-spacing="14" :hold-keyboard="true" />
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
					<view class="em" @tap="more">
            <u-icon name="more-dot-fill" color="#7fabf7" size="38"></u-icon>
					</view>
				</view>
			</view>
			<view class="send" v-if="sendBtnShow" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<!-- <view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''">
				<view class="icon luyin2"></view>
			</view>
			<view class="cancel" :class="willStop?'':'hidden'">
				<view class="icon chehui"></view>
			</view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view> -->
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<image src="../../static/im/face/face_1.jpg"></image>
					</view>
					<view class="from">来自{{redenvelopeData.from}}</view>
					<view class="blessing">{{redenvelopeData.blessing}}</view>
					<view class="money">{{redenvelopeData.money}}</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						查看领取详情 <view class="icon to"></view>
					</view>
				</view>
			</view>

		</view>
		<u-popup v-model="popShow" mode="left">
			<view class="popubAvatar">
				<image class="popubAvatarImg" :src="toUserInfo.avatarUrl" mode=""></image>
			</view>
			<u-cell-group>
				<u-cell-item title="消息免打扰" :arrow="false">
					<u-switch style="    position: relative;
    top: 10rpx;" @change="popubSwitchChange" v-model="doNotDisturb" active-color="#7fa1f7" size="50"></u-switch>
				</u-cell-item>
				<u-cell-item title="加入黑名单" :arrow="false">
					<u-switch style="    position: relative;
    top: 10rpx;" @change="popubSwitchChange" v-model="blackList" active-color="#7fa1f7" size="50"></u-switch>
				</u-cell-item>
			</u-cell-group>
		</u-popup>
	</view>
</template>
<script>
	import commen from '../lib/commen.js'
	import config from '@/mahjongConfig.js'
	export default {
		data() {
			return {
				isDone: false,
				//TIM变量
				conversationActive: null,
				toUserId: '',
				toUserInfo: null,
				userInfo: null,
				nextReqMessageID: '',
				count: 15,
				isCompleted: '',
				msgList: [],
				TIM: null,
				//文字消息
				textMsg: '',
				//消息列表
				isHistoryLoading: false,
				scrollAnimation: false,
				scrollTop: 0,
				scrollToView: '',
				msgImgList: [],
				myuid: 0,
				RECORDER: uni.getRecorderManager(),
				// #endif
				isVoice: false,
				recording: false,
				willStop: false,
				initPoint: {
					identifier: 0,
					Y: 0
				},
				recordTimer: null,
				recordLength: 0,
				//播放语音相关参数
				AUDIO: uni.createInnerAudioContext(),
				playMsgid: null,
				VoiceTimer: null,
				// 抽屉参数
				popupLayerClass: '',
				// more参数
				hideMore: true,
				//表情定义
				hideEmoji: true,
				emojiList: commen.emojiList,
				onlineEmoji: {
					"100.gif": "AbNQgA.gif",
					"101.gif": "AbN3ut.gif",
					"102.gif": "AbNM3d.gif",
					"103.gif": "AbN8DP.gif",
					"104.gif": "AbNljI.gif",
					"105.gif": "AbNtUS.gif",
					"106.gif": "AbNGHf.gif",
					"107.gif": "AbNYE8.gif",
					"108.gif": "AbNaCQ.gif",
					"109.gif": "AbNN4g.gif",
					"110.gif": "AbN0vn.gif",
					"111.gif": "AbNd3j.gif",
					"112.gif": "AbNsbV.gif",
					"113.gif": "AbNwgs.gif",
					"114.gif": "AbNrD0.gif",
					"115.gif": "AbNDuq.gif",
					"116.gif": "AbNg5F.gif",
					"117.gif": "AbN6ET.gif",
					"118.gif": "AbNcUU.gif",
					"119.gif": "AbNRC4.gif",
					"120.gif": "AbNhvR.gif",
					"121.gif": "AbNf29.gif",
					"122.gif": "AbNW8J.gif",
					"123.gif": "AbNob6.gif",
					"124.gif": "AbN5K1.gif",
					"125.gif": "AbNHUO.gif",
					"126.gif": "AbNIDx.gif",
					"127.gif": "AbN7VK.gif",
					"128.gif": "AbNb5D.gif",
					"129.gif": "AbNX2d.gif",
					"130.gif": "AbNLPe.gif",
					"131.gif": "AbNjxA.gif",
					"132.gif": "AbNO8H.gif",
					"133.gif": "AbNxKI.gif",
					"134.gif": "AbNzrt.gif",
					"135.gif": "AbU9Vf.gif",
					"136.gif": "AbUSqP.gif",
					"137.gif": "AbUCa8.gif",
					"138.gif": "AbUkGQ.gif",
					"139.gif": "AbUFPg.gif",
					"140.gif": "AbUPIS.gif",
					"141.gif": "AbUZMn.gif",
					"142.gif": "AbUExs.gif",
					"143.gif": "AbUA2j.gif",
					"144.gif": "AbUMIU.gif",
					"145.gif": "AbUerq.gif",
					"146.gif": "AbUKaT.gif",
					"147.gif": "AbUmq0.gif",
					"148.gif": "AbUuZV.gif",
					"149.gif": "AbUliF.gif",
					"150.gif": "AbU1G4.gif",
					"151.gif": "AbU8z9.gif",
					"152.gif": "AbU3RJ.gif",
					"153.gif": "AbUYs1.gif",
					"154.gif": "AbUJMR.gif",
					"155.gif": "AbUadK.gif",
					"156.gif": "AbUtqx.gif",
					"157.gif": "AbUUZ6.gif",
					"158.gif": "AbUBJe.gif",
					"159.gif": "AbUdIO.gif",
					"160.gif": "AbU0iD.gif",
					"161.gif": "AbUrzd.gif",
					"162.gif": "AbUDRH.gif",
					"163.gif": "AbUyQA.gif",
					"164.gif": "AbUWo8.gif",
					"165.gif": "AbU6sI.gif",
					"166.gif": "AbU2eP.gif",
					"167.gif": "AbUcLt.gif",
					"168.gif": "AbU4Jg.gif",
					"169.gif": "AbURdf.gif",
					"170.gif": "AbUhFS.gif",
					"171.gif": "AbU5WQ.gif",
					"172.gif": "AbULwV.gif",
					"173.gif": "AbUIzj.gif",
					"174.gif": "AbUTQs.gif",
					"175.gif": "AbU7yn.gif",
					"176.gif": "AbUqe0.gif",
					"177.gif": "AbUHLq.gif",
					"178.gif": "AbUOoT.gif",
					"179.gif": "AbUvYF.gif",
					"180.gif": "AbUjFU.gif",
					"181.gif": "AbaSSJ.gif",
					"182.gif": "AbUxW4.gif",
					"183.gif": "AbaCO1.gif",
					"184.gif": "Abapl9.gif",
					"185.gif": "Aba9yR.gif",
					"186.gif": "AbaFw6.gif",
					"187.gif": "Abaiex.gif",
					"188.gif": "AbakTK.gif",
					"189.gif": "AbaZfe.png",
					"190.gif": "AbaEFO.gif",
					"191.gif": "AbaVYD.gif",
					"192.gif": "AbamSH.gif",
					"193.gif": "AbaKOI.gif",
					"194.gif": "Abanld.gif",
					"195.gif": "Abau6A.gif",
					"196.gif": "AbaQmt.gif",
					"197.gif": "Abal0P.gif",
					"198.gif": "AbatpQ.gif",
					"199.gif": "Aba1Tf.gif",
					"200.png": "Aba8k8.png",
					"201.png": "AbaGtS.png",
					"202.png": "AbaJfg.png",
					"203.png": "AbaNlj.png",
					"204.png": "Abawmq.png",
					"205.png": "AbaU6s.png",
					"206.png": "AbaaXn.png",
					"207.png": "Aba000.png",
					"208.png": "AbarkT.png",
					"209.png": "AbastU.png",
					"210.png": "AbaB7V.png",
					"211.png": "Abafn1.png",
					"212.png": "Abacp4.png",
					"213.png": "AbayhF.png",
					"214.png": "Abag1J.png",
					"215.png": "Aba2c9.png",
					"216.png": "AbaRXR.png",
					"217.png": "Aba476.png",
					"218.png": "Abah0x.png",
					"219.png": "Abdg58.png"
				},
				//红包相关参数
				windowsState: '',
				redenvelopeData: {
					rid: null, //红包ID
					from: null,
					face: null,
					blessing: null,
					money: null
				},
				myOpenid: '',
				//对方的openid
				otherOpenid: '',
				//对话的类型 1：用户与用户 2：用户与商家
				getType: 1, //1：用户端获取用户消息列表 2：用户获取与商家的消息列表 3：商家获取与用户的消息列表
				conversationId: '', //会话id
				page: 1,
				socketTask: '',
				//导航栏文字
				navTitle: '',
				popShow: false,
				//是否开启免打扰
				doNotDisturb: false,
				//是否加入黑名单
				blackList: false,
				sendBtnShow: false, //显示发送按钮
				showOrderCard: false, //展示订单卡片
				orderMsg: {},
				customStyle: {
					width: '400rpx',
					height: '10rpx'
				}
			};
		},
		watch: {
			currentMessageList(newVal, oldVal) {
				this.msgList = newVal
				this.screenMsg(newVal, oldVal)
			},
			textMsg(newVal, oldVal) {
				if (newVal != '') {
					this.sendBtnShow = true
				} else {
					this.sendBtnShow = false
				}
			}
		},
		async onLoad(option) {
			let vm = this
			vm.otherOpenid = "" //option.otherOpenid
			vm.getType = 1//option.getType
			// vm.otherOpenid = 'ohpVk5XeOL8loKJw1rTBvQ7C4ygI'
			// vm.getType = 5
			vm.getMyUserInfo()
			if (option.conversationId) {
				vm.conversationId = "123"//option.conversationId
			}
			if (option.orderMsg) {
				vm.showOrderCard = true
				vm.orderMsg = "123"//JSON.parse(option.orderMsg)
				console.log("orderMsg", vm.orderMsg)
			}
			console.log('otherOpenid', vm.otherOpenid)
			// let res = await getApp().UniRequest(
			// 	`/IM/controller/userInfo?otherId=${vm.otherOpenid}&getType=${vm.getType}`, 'GET', '', '', true)
			//if (res.code == 20000) {
				this.isDone = true;
			//}
			// console.log("userInfo", res)
			// let toUserInfo = res.data.userInfo
			// vm.toUserInfo = toUserInfo
			// vm.navTitle = vm.toUserInfo.nickName
			// if (res.data.permission) {
			// 	let permission = res.data.permission
			// 	if (permission.type === 2) {
			// 		vm.doNotDisturb = true
			// 	} else if (permission.type === 3) {
			// 		vm.blackList = true
			// 	} else if (permission.type === 4) {
			// 		vm.doNotDisturb = true
			// 		vm.blackList = true
			// 	}
			// }
			vm.page = 2
			vm.count = 15
			this.getMsgList();
			let id
			//用户端和商家的会使用不同的识别id
			if (vm.getType == 1 || vm.getType == 2 || vm.getType == 4) {
				id = getApp().globalData.userInfo.openid
			} else if (vm.getType == 3) { //商家端
				let shopId = uni.getStorageSync('storeId')
				id = shopId
			}
			let socketTask = uni.connectSocket({
				url: `ws://localhost:9790/IM/chat/${id}/${vm.getType}/${config.university}`, 
				complete: () => {}
			});
			vm.socketTask = socketTask
			socketTask.onOpen(callback => {
				console.log("连接成功：" + callback.data)
			})
			socketTask.onError(callback => {
				console.log("发送错误：" + callback.errMsg)
			})
			socketTask.onClose(callback => {
				console.log("连接关闭")
			})
			socketTask.onMessage(callback => {
				let msg = JSON.parse(callback.data)
				let vm = this
				vm.msgList = [...vm.msgList, msg]
				console.log("msg", msg)
				this.$nextTick(() => {
					this.scrollToView = vm.msgList[vm.msgList.length - 1].id
				});
			})
		},
		onShow() {
			this.scrollTop = 9999999;
		},
		onUnload() {
			//退出页面 将所有的会话内的消息设置为已读
			// let promise = this.tim.setMessageRead({
			// 	conversationID: this.conversationActive.conversationID
			// });
			// promise.then(function(imResponse) {
			// 	console.log('全部已读')
			// 	// 已读上报成功
			// }).catch(function(imError) {
			// 	// 已读上报失败
			// 	console.warn('setMessageRead error:', imError);
			// });
			let vm = this
			vm.socketTask.close()
		},
		methods: {
      discard() {
        
      },
			sendOrder() {
				let vm = this
				let content = "订单编号："
				content += vm.orderMsg.orderNo + "\n"
				for (let i in vm.orderMsg.goodsList) {
					content += vm.orderMsg.goodsList[i].goodsName + "x" + vm.orderMsg.goodsList[i].number + "\n"
				}
				let remark = ""
				if (vm.orderMsg.contact.shopRemark && vm.getType == 2) {
					remark = vm.orderMsg.contact.shopRemark
				} else {
					remark = vm.orderMsg.contact.delRemark
				}
				content += "备注：" + remark + "\n"
				content += "下单时间：" + vm.orderMsg.createTime
				let data = {
					sendId: vm.myOpenid,
					recvId: vm.otherOpenid,
					type: 1,
					content: content
				}
				let msg = {}
				msg.text = content
				vm.sendMsg(msg, 1)
				vm.showOrderCard = false
			},
			cancelSendOrder() {
				let vm = this
				vm.showOrderCard = false
			},
			//获取自己的信息
			getMyUserInfo() {
				let vm = this
				if (vm.getType == 1 || vm.getType == 2 || vm.getType == 4) {
					vm.myOpenid = getApp().globalData.userInfo.openid
					vm.userInfo = uni.getStorageSync('userInfo')
				} else if (vm.getType == 3) {
					let shopId = uni.getStorageSync('storeId')
					vm.myOpenid = shopId
					let shop = uni.getStorageSync('shop')
					console.log('shop', shop)
					let userInfo = new Object()
					userInfo.nickName = shop.shopName
					userInfo.avatarUrl = shop.image
					vm.userInfo = userInfo
				} else if (vm.getType == 5) {
					vm.myOpenid = uni.getStorageSync('openid')
					console.log('我的openid', vm.myOpenid)
					vm.userInfo = uni.getStorageSync('userInfo')
				}
			},
			async toTaPage() {
				uni.navigateTo({
					//url: "../../page_mine/myPage/myPage?openid=" + this.otherOpenid
				})
			},
			async toMyPage() {
				uni.navigateTo({
					//url: "../../page_mine/myPage/myPage?openid=" + this.myOpenid
				})
			},
			async popubSwitchChange() {
				let vm = this
				//console.log("权限改变了")
				let type = 1
				if (vm.doNotDisturb && vm.blackList) {
					type = 4
				} else if (vm.doNotDisturb) {
					type = 2
				} else {
					type = 3
				}
				// let res = await getApp().UniRequest("/IM/controller/doNotDisturb", "POST", {
				// 	type: type,
				// 	toOpenId: vm.otherOpenid
				// }, "", true)
				//console.log("权限",res)
			},
			setting() {
				let vm = this
				vm.popShow = true
			},
			needToShowTime(index) {
				let vm = this
				if (index == 0) {
					return true
				}
				let nowTime = vm.msgList[index].createTime
				let preTime = vm.msgList[index - 1].createTime
				if ((nowTime - preTime) > 5 * 60 * 1000) {
					return true;
				}
				return false
			},
			//聊天的节点加上外层的div
			nodesFliter(str) {
				let nodeStr = '<div style="align-items: center;word-wrap:break-word;">' + str + '</div>'
				return nodeStr
			},
			//时间过滤
			timeFliter(timer) {
				let timeData = new Date(timer)
				let str = commen.dateTimeFliter(timeData)
				return str.substr(0, 16)
			},
			// 接受消息(定位消息)
			screenMsg(newVal, oldVal) {
				if (newVal[0].ID && oldVal[0].ID) {
					if (newVal[0].ID != oldVal[0].ID && newVal.length >= this.count) {
						this.$nextTick(() => {
							this.scrollToView = oldVal[0].ID
						});
					} else {
						this.$nextTick(() => {
							this.scrollToView = newVal[newVal.length - 1].ID
						});
					}
				} else {
					this.$nextTick(() => {
						this.scrollToView = newVal[newVal.length - 1].ID
					});
				}
			},
			//触发滑动到顶部(加载历史信息记录)
			async loadHistory(e) {
				let vm = this
				// let res = await getApp().UniRequest(
				// 	`/IM/controller/history?conversationId=${vm.conversationId}&page=${vm.page}&size=${vm.count}`,
				// 	"GET", "", "", true)
				// let list = res.data.message
				// if (list.length != 0) {
				// 	vm.page++
				// }
				// vm.msgList = [...list, ...vm.msgList]
				// //这段代码很重要，不然每次加载历史数据都会跳到顶部
				// this.$nextTick(function() {
				// 	this.scrollToView = this.nextReqMessageID; //跳转上次的第一行信息位置
				// 	this.$nextTick(function() {
				// 		this.scrollAnimation = true; //恢复滚动动画
				// 	});

				// });
				this.isHistoryLoading = false;
			},
			// 加载初始页面消息
			async getMsgList() {
				let vm = this
				// let res = await getApp().UniRequest(
				// 	`/IM/controller/history?conversationId=${vm.conversationId}&page=${1}&size=${vm.count}&otherId=${vm.otherOpenid}`,
				// 	"GET",
				// 	"", "", true)
				// console.log("历史记录", res)
				// vm.msgList = res.data.message
				// // 滚动到底部
				// this.$nextTick(function() {
				// 	//进入页面滚动到底部
				// 	this.scrollTop = 9999;
				// 	this.$nextTick(function() {
				// 		this.scrollAnimation = true;
				// 	});
				// });
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content) {
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
				let maxH = uni.upx2px(350); //350是定义消息图片最大高度
				if (content.w > maxW || content.h > maxH) {
					let scale = content.w / content.h;
					content.w = scale > 1 ? maxW : maxH * scale;
					content.h = scale > 1 ? maxW / scale : maxH;
				}
				return content;
			},
			//更多功能(点击+弹出) 
			showMore() {
				this.isVoice = false;
				this.hideEmoji = true;
				if (this.hideMore) {
					this.hideMore = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer() {
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer() {
				this.popupLayerClass = '';
				setTimeout(() => {
					this.hideMore = true;
					this.hideEmoji = true;
				}, 150);
			},
			// 选择图片发送
			chooseImage() {
				this.getImage('album');
			},
			//拍照发送
			camera() {
				this.getImage('camera');
			},
			//发红包
			// handRedEnvelopes() {
			// 	uni.navigateTo({
			// 		url: 'HM-hand/HM-hand'
			// 	});
			// 	this.hideDrawer();
			// },
			//选照片 or 拍照
			getImage(type) {
				this.hideDrawer();
				let vm = this
				uni.chooseImage({
					sourceType: [type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image) => {
									console.log(image.width);
									console.log(image.height);
									let msg = {
										url: res.tempFilePaths[i],
										w: image.width,
										h: image.height
									};
									//上传图片
									uni.showLoading({
										title: "正在上传图片"
									})
									uni.uploadFile({
										url: 'https://www.zcjn.top/hiUploadImg/uploadImage',
										filePath: res.tempFilePaths[i],
										name: 'file',
										success(res) {
											console.log('上传图片成功', res)
											let img = {
												url: res.data
											}
											uni.hideLoading()
											vm.sendMsg(img, 2);
										}
									})
								}
							});
						}
					}
				});
			},
			// 选择表情
			chooseEmoji() {
				this.hideMore = true;
				if (this.hideEmoji) {
					this.hideEmoji = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			more() {
				this.hideEmoji = true
				if (this.hideMore) {
					this.hideMore = false
					this.openDrawer()
				} else {
					this.hideDrawer()
				}
			},
			//添加表情
			addEmoji(em) {
				this.textMsg += em.alt;
			},

			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus() {
				if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
					this.hideDrawer();
				}
			},
			// 发送文字消息
			sendText() {
				this.hideDrawer(); //隐藏抽屉
				if (!this.textMsg) {
					return;
				}
				let content = this.replaceEmoji(this.textMsg);
				let msg = {
					text: content
				}
				this.sendMsg(msg, 1);
				this.textMsg = ''; //清空输入框
			},
			//替换表情符号为图片
			replaceEmoji(str) {
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
					console.log("item: " + item);
					for (let i = 0; i < this.emojiList.length; i++) {
						let row = this.emojiList[i];
						for (let j = 0; j < row.length; j++) {
							let EM = row[j];
							if (EM.alt == item) {
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								let onlinePath = 'https://s2.ax1x.com/2019/04/12/'
								let imgstr = '<img src="' + onlinePath + this.onlineEmoji[EM.url] + '">';
								console.log("imgstr: " + imgstr);
								return imgstr;
							}
						}
					}
				});
				return replacedStr;
			},

			// 发送消息
			sendMsg(content, type) {
				// let message = this.tim.createTextMessage({
				// 	to: this.toUserId,
				// 	conversationType: 'C2C',
				// 	payload: {
				// 		text: content.text
				// 	}
				// });
				// this.$store.commit('pushCurrentMessageList', message)
				// let pomise = this.tim.sendMessage(message)
				// pomise.then(res => {
				// 	this.$nextTick(() => {
				// 		// 滚动到底
				// 		this.scrollToView = res.data.message.ID
				// 	});
				// })
				let vm = this
				let data
				if (type === 1) {
					data = {
						sendId: vm.myOpenid,
						recvId: vm.otherOpenid,
						type: type,
						content: content.text
					}
				} else if (type === 2) {
					data = {
						sendId: vm.myOpenid,
						recvId: vm.otherOpenid,
						type: type,
						content: content.url
					}
				}
				vm.socketTask.send({
					data: JSON.stringify(data)
				})

			},
			// 预览图片
			showPic(url) {
				uni.previewImage({
					indicator: "none",
					urls: [url]
				});
			}
		}
	}
</script>
<style lang="scss">
	@import "../static/css/style.scss";

	page {
		background-color: #F5F5F5
	}

	.order_card {
		width: 100%;
		position: fixed;
		top: 220rpx;
		z-index: 10;
		display: flex;
		justify-content: center;

		.card {
			width: 500rpx;
			height: 180rpx;
			border-radius: 15rpx;
			background-color: #ffffff;
			display: flex;
			padding: 20rpx 20rpx;

			.left {
				display: flex;
				flex-direction: column;
				width: 50%;

				.orderNo {
					font-size: 50rpx;
					font-weight: bold;
				}
			}

			.right {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-end;
				width: 50%;

				.btn:nth-child(2) {
					margin-top: 10rpx;
				}
			}
		}
	}

	.navIcon {
		height: 50rpx;
		width: 50rpx;
	}

	.popubAvatar {
		height: 100rpx;
		width: 350rpx;
		margin: 50rpx auto 25rpx;

		.popubAvatarImg {
			height: 100rpx;
			width: 100rpx;
			border-radius: 12rpx;
			position: relative;
			left: 120rpx;
			top: 20rpx;
		}
	}

	.textarea {
		height: 50rpx;
		font-size: 32rpx;
	}
</style>
