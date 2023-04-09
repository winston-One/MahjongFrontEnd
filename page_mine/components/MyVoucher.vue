<template>
  <view class="coupon" :style="'background-color:' + couponColor[0] +  ';'">
    <view class="coupon-title">
      {{couponMsg.title}}
    </view>
    <view class="coupon-room">
      <text>适用房型：</text>
      <view>
        {{couponMsg.availableRange}}
      </view>
    </view>
    <view class="coupon-time">
      <text>有效期：购买后{{couponMsg.term}}天过期</text>
    </view>
    <view class="coupon-time">
      <text>支付时间：{{couponMsg.payTime}}</text>
    </view>
    <view class="coupon-time">
      <text>下单时间：{{couponMsg.createTime}}</text>
    </view>
    <view class="coupon-price">
      <text>价格：￥{{couponMsg.price}}</text>
      <view>
        <uni-icons :type="couponMsg.orderStatus==1?'smallcircle':'circle-filled'"/>
        <text>{{couponMsg.orderStatus==2?'已过期':couponMsg.orderStatus==1?'未使用':'已使用'}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"MyVoucher",
    props: {
      couponMsg: {
        voucherId:String,
        id:String,
        title:String,
        availableRange:String,
        term:Number,
        price:Number,
        orderStatus: String,
        payTime: String,
        createTime:String,
      }
    },
    data() {
      return {
        couponColor: ['#fff'],
      };
    },
    methods: {
      
    },
  }
</script>

<style lang="scss">
.coupon{
  //background: rgba(134, 161, 235, 0.2);
  border-radius: 20px;
  width: 100%;
  height: 420rpx;
  margin-bottom: 25rpx;
  padding: 25rpx;
  .coupon-title{
    font-size: 18px;
    font-weight: bold;
  }
  .coupon-room {
    display: flex;
    justify-content: flex-start;
    margin-top: 70rpx;
  }
  .coupon-time{
    margin-top: 15rpx;
  }
  .coupon-price{
    margin-top: 30rpx;
    display: flex;
    justify-content: space-between;
  }
}
</style>