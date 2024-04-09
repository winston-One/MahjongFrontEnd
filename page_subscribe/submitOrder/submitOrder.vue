<template>
  <view class="submit-order">
    <view class="top">
      <view>所属门店</view>
      <view class="top_store">国粹娱乐中心-{{store}}</view>
    </view>
    <view class="room">
      <image :src="imgUrl"></image>
      <view class="room_info">
        <view>{{room}}</view>
        <view class="room_server">
          <view v-for="(item,i) in roomServer" :key="i">
            {{item}}
            <u-icon name="checkmark-circle-fill" color="#7fa1f7" size="28"></u-icon>
          </view>
        </view>
      </view>
    </view>
    <view class="order-msg">
      <view class="flex-style">
        <view>当前日期</view>
        <view class="reserve_time">
          <view>{{dataTime}}</view>
          <u-icon name="arrow-right" color="#7fa1f7"></u-icon>
        </view>
      </view>
      <view class="flex-style">
        <view>开始时间</view>
        <view class="reserve_time">
          <view>{{startTime}}</view>
          <u-icon name="arrow-right" color="#7fa1f7"></u-icon>
        </view>
      </view>
      <view class="flex-style">
        <view>结束时间</view>
        <view class="reserve_time">
          <view>{{endTime}}</view>
          <u-icon name="arrow-right" color="#7fa1f7"></u-icon>
        </view>
      </view>
      <view class="coupon-style">
        <view>卡券</view>
        <view class="coupon" @click="useCouponPop">
          <view>
            {{couponList === [] || couponList === null ?'暂无可用卡券':coupon!==null?coupon.title:'选择卡券'}}
          </view>
          <u-icon name="arrow-right" color="#7fa1f7"></u-icon>
        </view>
      </view>
      <view class="coupon-style meituan">
        <view>团购券</view>
        <view class="meituan" @click="useMeituanPop">
          <view>
            {{meituanList === [] || meituanList === null ?'暂无可用团购券':meituan!==null?meituan.title+'小时畅玩券':'选择团购券'}}
          </view>
          <u-icon name="arrow-right" color="#7fa1f7"></u-icon>
        </view>
      </view>
    </view>
    <view class="tip">
      <view>温馨提示</view>
      <view>如有不可抗力因素，请致电商家并且初始不可抗力因素证明；普通房间最多仅5人使用，VIP房最多仅限8人使用。</view>
    </view>
    <view class="reservation">
      <view class="reservation_total">
        <view class="price">总计：￥{{price}}</view>
        <view class="duration">共计：{{duration}}小时/{{singlePrice}}</view>
        <view class="duration">每半小时{{singlePrice}}元</view>
      </view>
      <view class="confirm_btn" @click="confirmReserve">确定预约</view>
    </view>
    <u-popup v-model="popshowMeittuan" mode="center" width="600rpx" border-radius="30">
      <view class="coupon_list">
        <view v-for="(item,i) in meituanList" class="coupon_item">
          <view class="msg">{{item.title}}小时畅玩￥{{item.price}}</view>
          <button class="btn" @click="useMeituan(item,i)">{{meituanIndex==i?'正使用':'去使用'}}</button>
        </view>
        <view class="cancel_btn" @click="cancelMeituan">取消使用</view>
      </view>
    </u-popup>
    <u-popup v-model="popshowCoupon" mode="center" width="600rpx"  border-radius="30"><!-- height="700rpx" -->
      <view class="coupon_list">
        <view v-for="(item,i) in couponList" class="coupon_item">
          <view class="msg">{{item.title}}￥{{item.price}}</view>
          <button class="btn" @click="useCoupon(item,i)">{{couponIndex==i?'正使用':'去使用'}}</button>
        </view>
        <view class="cancel_btn" @click="cancelCoupon">取消使用</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        store: '安鸿店',
        dataTime: '',
        startTime: '',
        endTime: '',
        duration: 0,
        coupon: null,
        meituan: null,
        meituanList: [],//{id:'12313',title:5,price:80},{id:'1313',title:6,price:80}],
        couponList: [],//{voucherId:'12313',title:'5小时畅玩卡',price:80,duration:5},{id:'1313',title:'6小时白天卡',price:80,duration:6}],
        price: 90.00,
        originPrice: 90,
        popshowMeittuan:false,
        popshowCoupon:false,
        room: '',
        roomServer: ['茶水','空调','有窗'],
        imgUrl: '../../static/applogo/intro1.png',
        singlePrice: 10,
        roomId:'',
        ip:[],
        meituanIndex: -1,
        couponIndex: -1,
      };
    },
    async onLoad(option) {
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
      var order = JSON.parse(decodeURIComponent(option.orderResults))
      this.store = order.store
      this.imgUrl = order.room.photoAdd
      this.roomServer = order.room.tag
      this.room = order.room.roomName
      this.roomId = order.room.roomId
      this.dataTime = order.date
      this.startTime = order.startDateTime
      this.endTime = order.endDateTime
      this.singlePrice = order.room.pricePerHour
      this.price = order.price
      this.originPrice = order.price
      this.duration = order.totalHour
      let body = new Object()
      body.userId = getApp().globalData.openid
      let data = await getApp().UniRequest("/DianPing/selectCanDoDPOrderInRedis", "GET", body, "",1)
      if (data.code !== 20000) {
        uni.showToast({
          title: '数据请求失败！',
          duration: 1500,
          icon: 'none',
        })
      }
      this.meituanList = data.data
      var request = new Object()
      request.openId = getApp().globalData.openid
      request.roomName = this.room
      request.userTime = this.duration
      let data1 = await getApp().UniRequest("/voucherUser/judgeVoucher", "GET", request, "",1)
      if (data1.code !== 20000) {
        uni.showToast({
          title: '数据请求失败！',
          duration: 1500,
          icon: 'none',
        })
      }
      this.couponList = data1.data
    },
    methods: {
      async confirmReserve() {
        // 下单并且支付
        uni.showLoading({
        	title: "加载中",
        	mask: true
        })
        let body = new Object()
        body.roomId = this.roomId
        body.userId = getApp().globalData.openid
        body.status = 3
        body.storeId = getApp().globalData.storeId
        body.price = this.price
        body.startTime = Date.parse(this.startTime)
        body.endTime = Date.parse(this.endTime)
        let data = await getApp().UniRequest("/order/saveOneUserOrder", "POST", body, "", 1)
        uni.hideLoading()
        if (data.code !== 20000) {
          return uni.showToast({
            title: data.errorMsg,
            duration: 1500,
            icon: 'none',
          })
        }else {
          uni.showModal({
          	title: '提示',
          	content: '支付' + this.price + "元",
            confirmColor: "#7fabf7",
            confirmText: "支付",
          	success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                uni.switchTab({
                  url: "/pages/myOrder/myOrder"
                })
                // 模拟支付扣钱
                
              } else if (res.cancel) {
                console.log('用户点击取消');
                return
              }
            }
          })
        }
        var orderNo = data.data
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
        // var that = this
        // let request = new Object()
        // request.openid = getApp().globalData.openid
        // request.realPrice = this.price
        // request.orderNo = orderNo
        // let res = await getApp().UniRequest("/business/pay", "POST", request, '', 1)
        // console.log('res-----', res)
        // let request1 = new Object()
        // request1.userId = getApp().globalData.openid
        // var isVoucher = 0
        // var voucherId = 'winston'
        // if(this.meituan!==null&&this.coupon==null) {
        //   isVoucher=1
        //   voucherId = this.meituan.id
        // }
        // if(this.coupon!==null&&this.meituan==null) {
        //   isVoucher=2
        //   voucherId = this.coupon.id
        // }
        // request1.isVoucher = isVoucher
        // request1.orderId = orderNo
        // request1.voucherId = voucherId
        // uni.hideLoading()
        // 下单成功之后就调用支付API，并且后端处理支付回调逻辑
        // if (res.code == 20000) {
        // 	let payRes = res.data
        // 	console.log('payRes-----', payRes)
          // 调用uniapp的支付API，底层会调用微信的API
        	// uni.requestPayment({
        	// 	provider: 'wxpay', // 服务提供商，通过 uni.getProvider 获取。
        	// 	timeStamp: payRes.timeStamp, // 时间戳从1970年1月1日至今的秒数，即当前的时间。
        	// 	nonceStr: payRes.nonceStr, // 随机字符串，长度为32个字符以下。
        	// 	package: payRes.packageValue, // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。
        	// 	signType: payRes.signType, // 签名算法，应与后台下单时的值一致
        	// 	paySign: payRes.paySign, // 签名，具体签名方案参见 微信小程序支付文档
        		// success: async function(e) {
          //     let calldata = await getApp().UniRequest("/PointAfter/pointAfterDo", "POST", request1, '', 1);
          //     if (calldata.code === 20000) {
          //       uni.navigateTo({
          //       	url: "/pages/myOrder/myOrder"
          //       })
          //     }
        		// },
        		// async fail(err) {
        		// 	//支付失败后调用接口取消订单
        		// 	let body = new Object()
        		// 	body.userId = getApp().globalData.openid
          //     body.id = orderNo
        		// 	let cancelPayRes = await getApp().UniRequest("/order/deleteOrder","POST", body, "", 1)
        		// 	console.log('取消支付。。。')
        		// }
        	// });
        // }
      },
      cancelMeituan() {
        this.meituan = null
        this.meituanIndex = -1
        if(this.coupon == null && this.meituan == null) {
          this.price = this.originPrice
        }
        this.popshowMeittuan = false
      },
      useMeituan(item,i){
        this.meituanIndex = i
        this.meituan = item
        this.coupon = null
        if(this.duration>item.title) {
          this.price = Number((this.duration-item.title)*this.singlePrice)
        } else {
          this.price = 0.01
        }
        this.popshowMeittuan = false
      },
      cancelCoupon() {
        this.coupon = null
        this.couponIndex = -1
        if(this.coupon==null&&this.meituan==null) {
          this.price = this.originPrice
        }
        this.popshowCoupon = false
      },
      useCoupon(item,i) {
        this.couponIndex = i
        this.coupon = item
        this.meituan = null
        if(this.duration>item.duration) {
          this.price = Number((this.duration-item.duration)*this.singlePrice)
        } else {
          this.price = 0.01
        }
        this.popshowCoupon = false
      },
      useMeituanPop() {
        if (this.meituanList.length === 0){
          return
        }
        this.popshowMeittuan = true
      },
      useCouponPop() {
        if (this.couponList.length === 0){
          return
        }
        this.popshowCoupon = true
      },
    }
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
.submit-order{
  display: flex;
  flex-direction: column;
  justify-content: center;
  .top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 25rpx;
    .top_store{
      font-size: 15px;
      font-weight: 600;
    }
  }
  .room{
    display: flex;
    justify-content: space-between;
    padding: 25rpx;
    background-color: #fff;
    margin-top: 15rpx;
    image {
      width: 280rpx;
      height: 200rpx;
    }
    .room_info{
      display: flex;
      flex-direction: column;
      .room_server{
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .order-msg{
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #fff;
    margin-top: 15rpx;
    .flex-style{
      display: flex;
      justify-content: space-between;
      padding: 25rpx;
      border-bottom: 2px solid #f6f6f6;
      .reserve_time{
        display: flex;
        justify-content: flex-end;
      }
    }
    .coupon-style{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 2px solid #f6f6f6;
      .coupon {
        display: flex;
        justify-content: space-between;
        padding: 15rpx;
        border: 2px solid #a3c3f9;
        border-radius: 20rpx;
      }
      .meituan{
        display: flex;
        justify-content: space-between;
        border: 2px solid #a3c3f9;
        padding: 15rpx;
        border-radius: 20rpx;
      }
    }
  }
  .tip{
    background-color: #fff;
    margin-top: 15rpx;
    padding: 25rpx;
  }
}
.reservation{
  position: fixed;
  height: 200rpx;
  bottom: 0;
  font-size: 17px;
  width: 100%;
  border-top-right-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 25rpx;
  .reservation_total{
    display: flex;
    flex-direction: column;
    align-items: center;
    .price{
      color: #f7434d;
    }
    .duration{
      font-size: 14px;
      color: #a3c3f9;
    }
  }
  .confirm_btn{
    background-color: #7fa1f7;
    color: #fff;
    height: 86rpx;
    width: 40%;
    border-radius: 35rpx;
    text-align: center;
    padding: 15rpx;
  }
}
.coupon_list{
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20rpx;
  .cancel_btn{
    font-size: 16px;
    font-weight: 400;
    padding: 15rpx;
    text-align: center;
  }
  .coupon_item{ 
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;
    border-bottom: 2px solid #e6e6e6;
    height: 100rpx;
    .msg{
      font-size: 16px;
      font-weight: 500;
    }
    .btn{
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
