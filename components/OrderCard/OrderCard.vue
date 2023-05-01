<template>
  <view class="order-detail">
    <view class="order_status">
      <view>{{order.orderStatus==1? '已完成':order.orderStatus==2? '使用中':'已预约'}}</view>
    </view>
    <view class="order_info">
      <image :src="order.imgUrl"></image>
      <view class="order_item">
        <view class="item_title">
          {{order.storeName}}({{order.roomName}})
        </view>
        <view class="order_duration">
          <view>{{order.duration}}</view>
          <view class="voupon">
            {{order.isVoucher==1? '美团券':order.isVoucher==2? '卡券':'无使用券'}}
          </view>
        </view>
        <view class="order_price">
          <image src="../../static/applogo/app1.png"></image>
          <view>￥{{order.price}}</view>
        </view>
      </view>
    </view>
    <view class="order_btn">
      <view class="btn1">
        <button open-type="contact">联</button>
        <view class="item-name">联系客服</view>
      </view>
      <view class="btn1">
        <view class="item-name" @click="contactBusiness">联系门店</view>
      </view>
      <view @click="skipOrderDetails" class="btn2">
        查看订单
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"OrderCard",
    props:{
      order:{
        orderId:String,
        storeName:String,
        roomName:String,
        startTime:String,
        endTime:String,
        duration:Number,
        price:Number,
        imgUrl: String,
        orderStatus: Number,
        isVoucher: Number,
        voucherId: String,
        payTime:String,
        createTime:String,
      }
    },
    data() {
      return {
        
      };
    }
    methods:{
      skipOrderDetails() {
        uni.navigateTo({
          url: "/page_subscribe/orderDetals/orderDetals?orderDetals=" + encodeURIComponent(JSON.stringify(this.order))
        })
      },
      contactBusiness() {
        uni.navigateTo({
          url:"/page_subscribe/Chat/Chat"
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
.order-detail{
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-content: center;
  .order_status{
    padding: 15rpx;
    margin-top: 10rpx;
    border-bottom: 2px solid #f6f6f6;
  }
  .order_info {
    display: flex;
    justify-content: space-around;
    margin-top: 15rpx;
    image{
      width: 280rpx;
      height: 200rpx;
    }
    .order_item {
      display: flex;
      flex-direction: column;
      .item_title{
        margin-top: 10rpx;
        font-weight: 600;
        font-size: 18px;
      }
      .order_duration{
        display: flex;
        justify-content: flex-start;
        .voupon{
          border: 1px solid #a3c3f9;
        }
      }
      .order_price{
        display: flex;
        justify-content: flex-start;
        image{
          width: 45rpx;
          height: 45rpx;
          border-radius: 10rpx;
        }
      }
    }
  }
  .order_btn{
    display: flex;
    justify-content: flex-end;
    border-top: 2px solid #f6f6f6;
    padding: 15rpx;
    .btn1{
      font-size: 14px;
      padding: 10rpx;
      border: 2px solid #e6e6e6;
      border-radius: 15rpx;
      margin-right: 10rpx;
      //width: 100rpx;
      button {
      	width: 15%;
        height: 3.5%;
      	position: absolute;
      	opacity: 0;
        //background-color: #a3c3f9;
      	z-index: 1;
      }
    }
    .btn2{
      font-size: 14px;
      padding: 10rpx;
      border-radius: 15rpx;
      background-color: #a3c3f9;
      text-align: center;
    }
  }
}
</style>