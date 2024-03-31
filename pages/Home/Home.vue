<template>
	<view>
		<view class="top">
      <view class="top-swiper">
        <u-swiper :list="swiperList" height="360"></u-swiper>
      </view>
      <view class="stores">
        <view class="title">
          <view class="store-name">{{title}}</view>
          <view class="select-drop" @click="selectStore">
            切换门店
            <u-icon name="arrow-down-fill"></u-icon>
          </view>
        </view>
        <view class="location">
          <view class="gps">
            <u-icon name="map" color="#7fa1f7" size="28"/>
            <text>
              {{location}}
            </text>
          </view>
          <view class="contact-mes">
              <uni-icons type="paperplane-filled" size="28" color="#7fa1f7" @click="viewMap"/>
              <u-icon name="phone" color="#7fa1f7" size="48" @click="callPhone"/>
          </view>
        </view>
      </view>
		</view>
    <view class="menu-list">
      <view class="menu">
        <view v-for="(item,i) in menuList" 
          :key="i" class="menu-item" @click="skipPage(item)">
          <image :src="item.image"></image>
          <view>{{item.title}}</view>
        </view>
      </view>
      <view class="subscribe">
        <view class="subscribe-title">自助预定</view>
        <view class="select-button">
        	<u-button type="primary" @click="skipSubscribe" :custom-style="selectcustomStyle">预定</u-button>
        </view>
      </view>
    </view>
    <view class="introduct">
      <uni-section title="门店介绍" type="line">
        <view class="content">{{storeIntroduct}}</view>
        <view class="introduct-image">
          <image src="/static/applogo/intro1.png"></image>
          <image src="/static/applogo/intro2.png"></image>
          <image src="/static/applogo/intro3.png"></image>
        </view>
      </uni-section>
    </view>
    <view class="user-step">
      <uni-section title="体验步骤" type="line">
        <u-steps :list="stepList" :current="0" mode="number" direction="column"></u-steps>
      </uni-section>
    </view>
    <view class="precautions">
      <uni-section title="注意事项" type="line">
        <view class="precautions_item">
          <text>【关于声音】</text>
          <view>这里是智能无人值守的共享空间，我们提倡'不给别人添麻烦'的使用理念,请您务必遵守以下规则，帮助我们一起维护好空间内的环境设施，谢谢!</view>
          <text>在棋牌室内，请勿高声喧哗!</text>
        </view>
        <view class="precautions_item">
          <text>【关于包房】</text>
          <view>在门店内，严禁黄赌毒</view>
          <view>请勿占用无人包厢，请勿随意涂鸦</view>
        </view>
        <view class="precautions_item">
          <text>【特别提示】</text>
          <view>离开包厢前请将随身物品带走，并将椅子归位，到时间自动断电，不必担心资源浪费问题</view>
        </view>
      </uni-section>
    </view>
    <view style="text-align: center;
          font-size: 8px;
          margin-top: 20rpx;"> 
      本系统由Winston开发团队提供技术支持
    </view>
    <!-- <view class="orderBtn">
    	<u-button class="inputbtn" type="primary" @click="toContinueOrder()" :custom-style="suspensionStyle">
        <view>续单</view>
    	</u-button>
    </view> -->
    <u-popup v-model="storePopup" mode="bottom" border-radius="30">
    	<view class="store_popup">
        <view v-for="(item,i) in filterOptions" :key="i" class="store-item" @click="confirmStore(item,i)">
          <view>{{item.storeName}}</view>
          <u-icon name="checkbox-mark" color="#7fa1f7" size="28" v-if="storeIndex===i"></u-icon>
        </view>
    	</view>
    </u-popup>
    <u-popup v-model="wifiPopup" mode="center" border-radius="20" width="500rpx" height="250rpx">
      <view class="wifi_box">
        <view >门店WiFi</view>
        <view>账号：{{wifi}}</view>
        <view>密码：{{wifiPsd}}</view>
        <view class="wifi_btn">
          <view>
          	<u-button type="primary" @click="copyPassword" :custom-style="wifiBtnStyle">复制密码</u-button>
          </view>
          <view>
          	<u-button type="primary" @click="oneKeyConnect" :custom-style="wifiBtnStyle">一键连接</u-button>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
	export default {
		data() {
			return {
        wifiPsd: 'mahjong@888',
        wifi: 'mahjong',
        token: 'winston',
				title: '国粹娱乐中心',
        store: '安鸿店',
        storeId: '97901',
        storeIndex: 0,
        selectcustomStyle:{
        	marginLeft:'160rpx',
        	marginTop:'25rpx',
        	width: '400rpx',
          color: '#fff',
        	backgroundColor:'#7fa1f7',
        	borderRadius:'50rpx'
        },
        wifiBtnStyle:{
        	marginTop:'25rpx',
        	width: '170rpx',
        	backgroundColor:'#7fa1f7',
        	borderRadius:'20rpx'
        },
        suspensionStyle:{
          width: '90rpx',
          height: '90rpx',
          color: '#fff',
          textAlign:'center',
          backgroundColor:'#7fa1f7',
          borderRadius:'50%',
        },
        swiperList: [
          {
          	image: '/static/applogo/intro1.png',
          	title: ''
          },
          {
          	image: '/static/applogo/intro2.png',
          	title: ''
          },
          {
          	image: '/static/applogo/intro3.png',
          	title: ''
          },
        ],
        filterOptions: [],
        location: '海珠区仲恺路500号',
        isBusiness: 1,
        menuList: [
          {
            image:'../../static/mine/myCoupon.png',
            title:'卡券套餐',
            url: '/pages/CardVoucher/CardVoucher',
            pageType: '1',
            cardType: 0
          },
          {
            image:'../../static/applogo/tuangou.png',
            title:'团购验券',
            url: '/pages/CardVoucher/CardVoucher',
            pageType: '1',
            cardType: 1
          },
          {
            image:'../../static/applogo/wifi.png',
            title:'WiFi连接',
            url: 'wifi',
            pageType: '0',
            cardType: 2
          }
        ],
        storeIntroduct: '国粹娱乐中心提供自助棋牌室，清一色的包厢很宽敞，全天24小时营业。',
        stepList: [
          {name: '预约下单'}, 
          {name: '出示凭证'}, 
          {name: '进入房间'}, 
          {name: '愉快离开'}, 
        ],
        storePopup:false,
        phone: '18688317496',
        couponColor: ['#a0b4f3', '#f3bce3', '#76bfcd', '#EE7621', '#00BFFF', '#f6cd97', '#4adbc3', '#FF4500'],
        wifiPopup: false,
			}
		},
    onLaunch() {
      //this.token = uni.getStorageSync('Authority')
    },
    onShow() {
      //this.token = uni.getStorageSync('Authority')
      //console.log('缓存里的：'+uni.getStorageSync('Authority'));
    },
		async onLoad() {
      //this.token = uni.getStorageSync('Authority')
      let data = await getApp().UniRequest("/store/selectAllStore", "POST","", "",1)
      if (data.code !== 20000) {
        return uni.showToast({
          title: '数据请求失败！',
          duration: 1500,
          icon: 'none',
        })
      }
      this.filterOptions = data.data
		},
    onShareAppMessage() {
      return {
        title: '国粹娱乐中心预约来了',
        path: '/page/index/index'
      }
    },
    onShareTimeline() {
    	return {
    		title: '国粹娱乐中心预约来了',
    		path: '/page/index/index',
        desc: '三缺一，就差你一个'
    	};
    },
		methods: {
      skipSubscribe() {
        if (this.token === '') {
          uni.navigateTo({
            url:"/page_login/login/login"
          })
          return;
        }
        uni.navigateTo({
          url: '/page_subscribe/subscribeMain/subscribeMain'
        })
      },
      skipPage(item) {
        if (item.url === 'wifi') {
          this.wifiPopup = true
          return
        }
        if (item.pageType === '1'){
          if (item.cardType !== 2) {
            uni.setStorageSync('couponType', item.cardType)
          }
          uni.switchTab({
          	url: item.url
          })
          return
        }
        uni.navigateTo({
          url:item.url
        })
      },
      // toContinueOrder() {
      //   if (this.token === '') {
      //     uni.navigateTo({
      //       url:"/page_login/login/login"
      //     })
      //     return;
      //   }
      //   uni.navigateTo({
      //     url: '/page_subscribe/continueOrder/continueOrder'
      //   })
      // },
      selectStore() {
        this.storePopup = true
      },
      confirmStore(item,index){
        this.store = item.storeName
        this.storeId = item.storeId
        getApp().globalData.store = this.store
        getApp().globalData.storeId = this.storeId
        this.storeIndex = index
        this.phone = item.phone
        this.location = item.address
        this.isBusiness = item.status
        this.storePopup = false
      },
      callPhone() {
        uni.makePhoneCall({
        	phoneNumber: this.phone 
        });
      },
      viewMap() {
        console.log("查看地图");
      },
      copyPassword() {
        uni.setClipboardData({
        	data: this.wifiPsd,
        	success() {
        		uni.showToast({
        			title:'已复制到剪贴板',
        			icon:'none',
        			position:'top'
        		})
        	}
        })
      },
      oneKeyConnect() {
        let that = this
        uni.startWifi({
        	success: (res) => {
        		that.connected()
        	},
        	fail: (error) => {
        		console.log(error)
        		uni.showToast({
              duration:1000,
        			title:'连接失败',
        			icon:'error'
        		})
        	}
        })
      },
      connected(){
      	let that = this
      	uni.connectWifi({
      		SSID: this.wifi, //Wi-Fi 设备名称
      		password: this.wifiPsd,//Wi-Fi 密码
      		success: (res) => {
      			uni.showToast({
              duration:1000,
              icon:'none',
      				title:"连接成功"
      			})
      		},
      		fail: (error) => {
      			uni.showToast({
              duration:1000,
      				title:'连接失败',
      				icon:'error'
      			})
      		}
      	})
      }
		},
	}
</script>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}
page{
  background-color: #f6f6f6;
}
.top{
  position: sticky;
  z-index: 9999;
  border-bottom: 2rpx solid #efefef;
  top: 0;
  height: 520rpx;
  .top-swiper{
    
  }
  .stores{
    background-color: #FFFFFF;
    width: 95%;
    border-radius: 10px;
    position: absolute;
    top: 300rpx;
    left: 20rpx;
    padding: 25rpx;
    .title{
      display: flex;
      justify-content: space-between;
      .store-name{
        font-size: 18px;
        font-weight: inherit;
      }
    }
    .location{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 23rpx;
      .gps{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text {
          font-size: 12px;
        }
      }
      .contact-mes{
        display: flex;
        width: 20%;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
.menu-list{
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  .subscribe{
    margin-top: 50rpx;
    .subscribe-title{
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-top: 10rpx;
    }
    .select-button {
      margin: auto auto;
    }
  }
  .menu {
    display: flex;
    flex-wrap: wrap;
    .menu-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10rpx;
      margin-right: 15rpx;
      image{
        width: 60rpx;
        height: 60rpx;
      }
    }
  }
}
.introduct {
  margin-top: 15rpx;
  background-color: #fff;
  padding: 15rpx;
  .content{
    margin-bottom: 15rpx;
    font-size: 17px;
  }
  .introduct-image{
    image{
      width: 100%;
    }
  }
}
.user-step{
  margin-top: 15rpx;
  background-color: #fff;
}
.precautions{
  margin-top: 15rpx;
  background-color: #fff;
  padding: 25rpx;
  .precautions_item{
    margin-top: 16rpx;
  }
}
.orderBtn {
  z-index: 1000;
  opacity: 0.8;
  position: fixed;
  bottom: 80rpx;
  right: 10rpx;
  .inputbtn {
  	view {
      margin-right: 5rpx;
    }
  }
}
.store_popup{
  background-color: #FFFFFF;
  .store-item {
    padding: 30rpx;
    border-bottom: 2px solid #e6e6e6;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
  }
  .cancel{
    padding: 30rpx;
    margin-top: 20rpx;
    border-top: 2px solid #e6e6e6;
    font-size: 18px;
    text-align: center;
  }
}
.wifi_box{
  padding: 20rpx;
  :first-child{
    font-weight: bold;
    font-size: 17px;
    text-align: center;
  }
  .wifi_btn{
    display: flex;
    justify-content: space-around;
  }
}
</style>
