<template>
  <view class="submit-order">
      <view class="top">
        <view>所属门店</view>
        <view class="top_store">娱乐中心-{{store}}</view>
      </view>
      <view class="room">
        <image :src="imgUrl"></image>
        <view class="room_info">
          {{roomName}}
        </view>
      </view>
      <view class="order-msg">
        <view class="flex-style">
          <view>订单编号</view>
          <view class="reserve_time">
            <view>{{orderNo}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view>状态</view>
          <view class="reserve_time">
            <view>{{orderStatus==1? '已完成':orderStatus==2? '使用中':'已预约'}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view>当前日期</view>
          <view class="reserve_time">
            <view>{{dataTime}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view>开始时间</view>
          <view class="reserve_time">
            <view>{{startTime}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view>结束时间</view>
          <view class="reserve_time">
            <view>{{endTime}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view>下单时间</view>
          <view class="reserve_time">
            <view>{{createTime}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view>付款时间</view>
          <view class="reserve_time">
            <view>{{payTime}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view>预订时长</view>
          <view class="reserve_time">
            <view>{{duration}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view>价钱</view>
          <view class="reserve_time">
            <view>￥{{price}}</view>
          </view>
        </view>
        <view class="coupon-style">
          <view>卡券</view>
          <view class="coupon" @click="readCoupon">
            <view>
              {{isVoucher==2?'':'未使用'}}{{coupon}}
            </view>
            <u-icon name="arrow-right" color="#7fa1f7"size="30"></u-icon>
          </view>
        </view>
        <view class="coupon-style meituan">
          <view>团购券</view>
          <view class="meituan" >
            <view>
              {{isVoucher==1?'使用':'未使用'}}
            </view>
            <u-icon name="arrow-right" color="#7fa1f7"></u-icon>
          </view>
        </view>
      </view>
    </view>
</template>

<script>
  export default {
    data() {
      return {
        store: '安鸿店',
        orderNo:'',
        dataTime: '',
        startTime: '',
        endTime: '',
        duration: 9.0,
        price: 90.00,
        orderStatus: '',
        roomName: '',
        imgUrl: '../../static/applogo/intro1.png',
        isVoucher: '',
        voucherId: '',
        createTime: '',
        payTime:'',
        coupon:'',
      };
    },
    onShow() {
      
    },
    async onLoad(option) {
      var order = JSON.parse(decodeURIComponent(option.orderDetals))
      var date = new Date()
      this.dataTime = this.getNowDate()
      this.store = order.storeName
      this.imgUrl = order.imgUrl
      this.orderNo = order.orderId
      this.startTime = String(order.startTime).substring(0, 10) + ' ' + String(order.startTime).substring(10 + 1);
      this.endTime = String(order.endTime).substring(0, 10) + ' ' + String(order.endTime).substring(10 + 1);
	  // this.createTime = String(order.createTime).substring(0, 10) + ' ' + String(order.createTime).substring(10 + 1);
      this.payTime = String(order.payTime).substring(0, 10) + ' ' + String(order.payTime).substring(10 + 1);
      if(this.payTime == null || typeof(this.payTime)==="undefined") {
        this.payTime = '待支付'
      }
	  console.log("createtime",order.createTime);
      if(order.createTime === null || order.createTime === undefined) {
        this.createTime = this.getNowDate()
      } else {
          this.createTime = String(order.createTime).substring(0, 10) + ' ' + String(order.createTime).substring(10 + 1);
      }
      this.roomName = order.roomName
      this.price = order.price
      this.orderStatus = order.orderStatus
      this.isVoucher = order.isVoucher
      this.duration = order.duration
      this.voucherId = order.voucherId
      var body = new Object()
      body.voucherId = this.voucherId
	  if(this.voucherId === undefined || this.voucherId === null) {
		   body.voucherId = ""
	  }
	  console.log("voucherId", body.voucherId);
      let data = await getApp().UniRequest("/voucher/getOneVoucher", "GET", body, "",1)
      if (data.code !== 20000) {
		  console.log(565656);
        return uni.showToast({
          title: '数据获取失败！',
          duration: 1500,
          icon: 'none',
        })
      }
	if (data.data !== null && data.data !== undefined) {
		this.coupon = data.data.title;
	  }
    },
    methods: {
      getNowDate() {
      	var myDate = new Date;
      	var year = myDate.getFullYear(); //获取当前年
      	var mon = (myDate.getMonth() + 1).toString().padStart(2, '0'); //获取当前月
      	var date =  myDate.getDate().toString().padStart(2, '0'); //获取当前日
      	var hours = myDate.getHours(); //获取当前小时
      	var minutes = myDate.getMinutes(); //获取当前分钟
      	var seconds = myDate.getSeconds(); //获取当前秒
      	var now = year + "-" + mon + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
      	return now;
      },
      readCoupon() {
		if(this.isVoucher!==2){
			return uni.showToast({
				title: '该订单未使用优惠券',
				duration: 1500,
				icon: 'none',
			})
		}
        uni.navigateTo({
          url:"/page_mine/myCoupon/myCoupon"
        })
      }
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
    justify-content: flex-start;
    padding: 25rpx;
    background-color: #fff;
    margin-top: 15rpx;
    image {
      width: 280rpx;
      height: 200rpx;
    }
    .room_info{
      font-size: 16px;
      font-weight: 500;
      margin-left: 25rpx;
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
      height: 90rpx;
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
}
</style>
