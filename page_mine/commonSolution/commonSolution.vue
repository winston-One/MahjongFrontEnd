<template>
  <view class="main">
    <view class="common">
      <text>如何体验？</text>
      <view style="margin-top: 20rpx;">1、线上预约付费成功</view>
      <view>2、到达门店后，出示预约凭证</view>
      <view>3.找到自己预约的房间包厢</view>
      <view>4.即可开始麻将之旅</view>
    </view>
    <view class="common">
      <text>日期改签，座位更换？</text>
      <view style="margin-top: 20rpx;">1、打开我的订单</view>
      <view>2、选择更换位置/改签</view>
      <view>3.重新选择位置/日期。并且提交订单</view>
    </view>
    <view class="common">
      <text>订单取消？</text>
      <view style="margin-top: 20rpx;">1、打开个人中心-联系商家</view>
      <view>2.致电沟通</view>
      <view>3、确认订单可取消</view>
      <view>4、等待商家退款</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        
      };
    },
    onLoad() {
      
    },
    methods: {
      
    },
  }
</script>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}
page{
  background-color: #fff;
}
.main{
  padding: 25rpx;
  .common{
    padding: 25rpx;
    text{
      font-weight: bold;
      font-size: 18px;
    }
  }
}
</style>
