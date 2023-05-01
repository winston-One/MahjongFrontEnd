<template>
  <view class="coupon" :style="'background-color:' + couponColor[0] +  ';'">
    <view class="coupon-title">
      {{couponMsg.duration}}小时畅玩券
    </view>
    <view class="coupon-room">
      <text>适用房型：</text>
      <view class="room">
        <view v-for="(item, i) in couponMsg.room" :key="i" >
          {{item}}<text v-if="item!==couponMsg.room[couponMsg.room.length-1]">、</text>
        </view>
      </view>
    </view>
    <view class="coupon-time">
      <text>备注：{{couponMsg.ps}}</text>
    </view>
    <view class="coupon-price">
      <text>价格：￥{{couponMsg.price}}</text>
      <view>
        <uni-icons :type="couponMsg.status==1? 'smallcircle':'circle-filled'"/>
        <text>{{couponMsg.status==1?'已使用':'未使用'}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"MeituanCoupon",
    props: {
      couponMsg: {
        id:String,
        duration:String,
        room: Array,
        price:Number,
        status: String,
      }
    },
    data() {
      return {
        couponColor: ['#fff'],
      };
    }
  }
</script>

<style lang="scss">
.coupon{
  border-radius: 20px;
  height: 350rpx;
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
    .room {
      display: flex;
      justify-content: space-between;
    }
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