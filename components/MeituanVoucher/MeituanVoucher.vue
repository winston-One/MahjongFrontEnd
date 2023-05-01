<template>
  <view class="voucher_info">
    <uni-section title="团购详情" type="line" titleFontSize="20px">
      <view class="voucher_list">
        <view class="voucher_item">
          <view class="title">券码</view>
          <view>{{meituanMsg.receiptCode}}</view>
        </view>
        <view class="voucher_item">
          <view class="title">使用时长</view>
          <view>{{meituanMsg.duration}}小时畅玩</view>
        </view>
        <view class="voucher_item">
          <view class="title">适用状态</view>
          <view>{{meituanMsg.status==1?'已使用':'未使用'}}</view>
        </view>
        <view class="voucher_item">
          <view class="title">适用房型</view>
          <view class="room">
            <view v-for="(item, i) in meituanMsg.room" :key="i">{{item}}
            </view>
          </view>
        </view>
        <view class="voucher_item">
          <view class="title">数量</view>
          <view>{{meituanMsg.count}}张</view>
        </view>
        <view class="voucher_item">
          <view class="title">价格</view>
          <view>￥{{meituanMsg.price}}</view>
        </view>
        <view class="voucher_tip">
          <view>注意：</view>
          <view>若您需要在预约中使用美团团购券，请点击此处进行消券</view>
        </view>
        <view class="voucher_item">
          <u-button type="primary" @click="cancel" :custom-style="selectcustomStyle1">取消</u-button>
          <u-button type="primary" @click="eliminate" :custom-style="selectcustomStyle">消券</u-button>
        </view>
      </view>
    </uni-section>
  </view>
</template>

<script>
  export default {
    name:"MeituanVoucher",
    props: {
      meituanMsg: {
        receiptCode:String,
        duration: Number,
        status: Number,
        room: Array,
        count: Number,
        price: String,
      }
    },
    data() {
      return {
        selectcustomStyle:{
        	width: '260rpx',
        	backgroundColor:'#7fa1f7',
        	borderRadius:'50rpx'
        },
        selectcustomStyle1:{
        	width: '260rpx',
        	backgroundColor:'#e6e6e6',
        	borderRadius:'50rpx',
          color: '#000'
        },
      };
    },
    methods: {
      cancel() {
        this.$emit('cancel')
      },
      eliminate() {
        this.$emit('eliminate',this.meituanMsg.receiptCode)
      }
    }
  }
</script>

<style lang="scss">
	.voucher_info {
		padding: 0 20rpx 0 20rpx;
		margin-top: 20rpx;
    .voucher_list{
      display: flex;
      font-size: 18px;
      flex-direction: column;
      justify-content: center;
      padding: 15rpx;
      .voucher_item {
        display: flex;
        justify-content: space-between;
        margin-top: 25rpx;
        .title{
          font-weight: 600;
          font-size: 19px;
        }
      }
      .voucher_tip {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin-top: 25rpx;
        font-size: 12px;
        font-weight: 50;
      }
      .room {
        display: flex;
        justify-content: space-between;
      }
    }
	}
</style>