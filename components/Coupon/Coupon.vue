<template>
  <view class="coupon" @click="toPurchaseCoupon" :style="'background-color:' + couponColor[Math.floor(Math.random() * 7)] +  ';'">
    <view class="coupon-title">
      {{couponMsg.title}}
    </view>
    <view class="coupon-room">
      <text>可用范围：{{couponMsg.availableRange}})</text>
    </view>
    <view class="coupon-time">
      <text>有效期至：购买后{{couponMsg.term}}天内有效</text>
    </view>
    <view class="coupon-price">
      <text>原价￥{{couponMsg.originalPrice}}/现价￥{{couponMsg.price}}</text>
      <u-icon name="arrow-rightward"></u-icon>
    </view>
  </view>
</template>

<script>
  export default {
    name:"Coupon",
    props: {
      couponMsg: {
        voucherId:String,
        title:String,
        availableRange:String,
        term: Number,
        price:Number,
        originalPrice: Number,
      }
    },
    data() {
      return {
        couponColor: ['#a0b4f3', '#f3bce3', '#76bfcd', '#EE7621', '#00BFFF', '#f6cd97', '#4adbc3', '#ff7505'],
      };
    },
    methods: {
      toPurchaseCoupon() {
        this.$emit('purchase',this.couponMsg)
      }
    },
  }
</script>

<style lang="scss">
.coupon{
  //background: rgba(134, 161, 235, 0.2);
  border-radius: 20px;
  height: 360rpx;
  margin-bottom: 25rpx;
  padding: 25rpx;
  .coupon-title{
    font-size: 18px;
    font-weight: bold;
  }
  .coupon-room {
    margin-top: 100rpx;
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