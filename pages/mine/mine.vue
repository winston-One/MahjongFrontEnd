<template>
  <view class="mine">
    <MyLogin v-if="token===''"></MyLogin>
    <template v-else>
      <view class="profily">
      	<view class="base">
          <u-avatar :src="avatarUrl" @click="avatarPreview(avatarUrl)"/>
      		<view class="nick">
            <text style="font-size: 40rpx; font-weight: 900;">
              {{nickName}}
            </text>
          </view>
      		<view class="right">
      			<view class="myHomePage" @click="gotoMyBusiness">
      				<view class="text">
      					我的门店
      				</view>
      				<u-icon size="30" name="arrow-right" color="#7fabf7"></u-icon>
      			</view>
      		</view>
      	</view>
      	<view class="order_status">
          <view class="order_num">
            <view><text>我的券包</text><text>{{quanNum}}</text></view>
            <view><text>我的订单</text><text>{{orderNum}}</text></view>
          </view>
      		<view class="order_menu">
            <view v-for="(item,index) in status" :key="index"
            	@click="topMenusClick(item)">
            	<view class="status">
            		<image class="icon" :src="item.image" mode="aspectFit"/>
            		<text>{{item.title}}</text>
            	</view>
            </view>
          </view>
      	</view>
      </view>
      <view class="center-menu">
        <view v-for="(item,index) in menus" :key="index" @click="menusClick(item.url)" class="center-menu-item">
          <template v-if="item.key!=1&&item.key!=5">
          	<view class="item">
          	  <image :src="item.image" style="width: 30px;height: 30px;"></image>
          	  <view class="item-name">{{item.name}}</view>
          	</view>
          	<u-icon name="arrow-right"></u-icon>
          </template>
          <template v-if="item.key==1">
          	<view class="item">
              <button open-type="contact">8848</button>
              <image :src="item.image" mode="aspectFill" style="width: 30px;height: 30px;"></image>
              <view class="item-name">{{item.name}}</view>
            </view>
            <u-icon name="arrow-right"></u-icon>
          </template>
          <template v-if="item.key==5">
          	<view class="item">
              <button open-type="share">8848</button>
              <image :src="item.image" mode="aspectFill" style="width: 30px;height: 30px;"></image>
              <view class="item-name">{{item.name}}</view>
            </view>
            <u-icon name="arrow-right"></u-icon>
          </template>
          
        </view>
      </view>
      <view style="text-align: center;
            font-size: 8px;
            margin-top: 20rpx;
            position: absolute;
            bottom: 0;
            left:260rpx"> 
        本系统由Winston开发团队提供技术支持
      </view>
      <u-popup v-model="popshow" mode="center" width="600rpx" height="770rpx" border-radius="20">
      	<view class="jieshao">
      		长按扫码添加商家，获取最新优惠活动情况、包厢环境，或咨询相关问题~
      	</view>
      	<view>
      		<image style="width: 600rpx;height: 780rpx;" src="../../static/mine/contactBussiness.png"
      			show-menu-by-longpress="true"></image>
      	</view>
      </u-popup>
      <uni-popup ref="alertDialog" type="dialog">
      	<uni-popup-dialog type="info" cancelText="取消" confirmText="确定"  content="确定要退出登录吗" @confirm="dialogConfirm" @close="dialogClose">
        </uni-popup-dialog>
      </uni-popup>
    </template>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        token: 'winston',
        avatarUrl: '',
        nickName:'Winston Yv',
        idAuth: '1817212',
        orderNum: 0,
        quanNum: 0,
        status: [
          {
            image:'../../static/icon/dingdan_selected.png',
            title:'我的订单',
            url: '/pages/myOrder/myOrder',
            pageType: '1',
            cardType: 2
          },
          {
            image:'../../static/mine/myCoupon.png',
            title:'我的券包',
            url: '/page_mine/myCoupon/myCoupon',
            pageType: '0',
            cardType: 2
          },
          {
            image:'../../static/icon/quan_selected.png',
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
            image:'../../static/mine/usually.png',
            title:'常见问题',
            url: '/page_mine/commonSolution/commonSolution',
            pageType: '0',
            cardType: 2
          },
        ],
        menus: [
          {
            image:'../../static/mine/contact.png',
            name:'联系客服',
            url: '',
            key: 1,
          },
          {
            image:'../../static/mine/bussiness.png',
            name:'联系商家',
            url: '0',
            key: 2,
          },
          {
            image:'../../static/mine/share.png',
            name:'分享小程序',
            url: '',
            key: 5,
          },
          {
            image:'../../static/mine/exit.png',
            name:'退出登录',
            url: '1',
            key: 4,
          },
        ],
        popshow: false,
        
      };
    },
    onLaunch() {
      //this.token = uni.getStorageSync('Authority')
      this.nickName = uni.getStorageSync('nickname')
      this.avatarUrl = uni.getStorageSync('avatarUrl')
    },
    async onLoad() {
      //this.token = uni.getStorageSync('Authority')
      let body = new Object()
      body.openId = getApp().globalData.openid
      body.orderStatus = 0
      body.storeId = getApp().globalData.storeId
      body.pageNum = 1
      let res = await getApp().UniRequest("/order/getAllOrderByUser", "POST", body, "",1)
      if (res.code !== 20000) {
         uni.showToast({
          title: '数据请求失败！',
          duration: 1500,
          icon: 'none',
        })
      }
      this.orderNum = res.data.total
      
      let obj = new Object()
      obj.openId = getApp().globalData.openid
      let data = await getApp().UniRequest("/voucherUser/countVoucher", "GET", obj, "",1)
      console.log(data.data);
      if (data.code !== 20000) {
         uni.showToast({
          title: '数据请求失败！',
          duration: 1500,
          icon: 'none',
        })
      }
      this.quanNum = data.data
     
    },
    onShareAppMessage(res) {
      if (res.form === 'button') {
        return {
          title: '一起预约国粹娱乐中心',
          path: '/pages/index/index',
          fail: function() {
            this.showMessage("分享失败","error")
          },
          success: function() {
            this.showMessage("分享成功","success")
          },
        }
      }
    },
    methods: {
      gotoMyBusiness() {
        uni.showToast({
          icon:'none',
          title: "您当前暂无自己的门店",
          duration: 2000
        })
        // uni.navigateTo({
        //   url:"/page_business/BusinessMain/BusinessMain"
        // })
      },
      avatarPreview(avatarUrl){
        uni.previewImage({
        	current: 0,
        	urls: [avatarUrl]
        })
      },
      topMenusClick(item) {
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
        	url: item.url
        })
      },
      menusClick(url) {
        if (url === '0') {
          this.popshow = true
          return
        }
        if (url === '1') {
          this.$refs.alertDialog.open()
          return
        }
        uni.navigateTo({
        	url: url
        })
      },
      async dialogConfirm() {
        //退出登录
        console.log('退出登录');
        let body = new Object()
        body.openid = getApp().globalData.openid
        let data = await getApp().UniRequest("/user/logout", "GET", body, "",1)
        if (data.code !== 20000) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
        uni.setStorageSync("userInfo", '');
        uni.setStorageSync("Authority", '');
        uni.setStorageSync('pastDueDateNew', '')
        getApp().globalData.openid = '';
        getApp().globalData.isLogin = false;
        uni.setStorageSync("openid", '')
        this.$refs.alertDialog.close()
      },
      dialogClose() {
        this.$refs.alertDialog.close()
      },
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

.profily {
  background: #FEFEFE;
  box-sizing: border-box;
  box-shadow: 0px 2px 5px #EDEDED;
  height: 350rpx;
  .base {
  	display: flex;
  	align-items: center;
  	padding-bottom: 35rpx;
  	position: relative;
  	padding: 13px 15px 13px 14px;
    background-color: #fff;
    .nick{
      display: flex;
      flex-direction: column;
      text {
      	margin-left: 20px;
      	font-size: 30upx;
      }
    }
  	.right {
  		display: flex;
  		flex-direction: column;
  		.myHomePage {
  			position: absolute;
  			top: 58rpx;
  			left: 560rpx;
  			display: flex;
  			justify-content: flex-start;
        .text {
          margin-right: 15rpx;
        }
  		}
  	}
    .right:active {
    	background: #f6f6f6;
    }
  }
  // .base:active {
  // 	background: #f8f8f8;
  // }
  .order_status{
    width: 90%;
    position: absolute;
    margin: 0 auto;
    top: 200upx;
    height: 300rpx;
    left: 5%;
    background: #dddddd;
    box-sizing: border-box;
    box-shadow: 0px 2px 5px #EDEDED;
    border-radius: 30px;
    .order_num{
      display: flex;
      justify-content: space-between;
      padding: 50rpx;
      text{
        margin-right: 10rpx;
        font-weight: bold;
      }
    }
    .order_menu{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .status {
      	font-size: 24rpx;
      	text-align: center;
      	letter-spacing: .5px;
      	display: flex;
      	flex-direction: column;
      	border-radius: 10px;
      	padding: 16rpx 10rpx 16rpx 10rpx;
      	.icon {
      		width: 70rpx;
      		height: 70rpx;
      		margin: 0 auto;
      		margin-bottom: 5px;
      	}
      }
    }
  }
}
.center-menu{
  width: 95%;
  border-radius: 30px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  padding: 20rpx;
  margin-top: 200rpx;
  .center-menu-item{
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    border-bottom: 2px solid #f6f6f6;
    height: 130rpx;
    .item{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      button {
      	width: 100%;
      	position: absolute;
      	opacity: 0;
      	z-index: 1;
      }
      .item-name{
        margin-left: 15rpx;
      }
    }
  }
}
	.jieshao {
		text-align: -webkit-center;
		font-size: 15px;
		font-weight: 600;
		padding: 0 20rpx 0 20rpx;
		margin-top: 20rpx;
	}
</style>
