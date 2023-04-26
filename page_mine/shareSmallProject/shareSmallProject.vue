<template>
  <view>
    <image src="../../static/mine/server.png" class="server"></image>
    <view>
      <view class="msg">
        长按扫码关注公众号“全栈大学堂”
      </view>
      <view class="msg">
        在公众号底部点击“国粹娱乐中心”按钮进入小程序
      </view>
      <view class="msg">
        即可进行预约订房，兑换美团卡券，购买平台的卡券
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        
      };
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
.server{
  margin: auto;
  width: 400rpx;
  height: 400rpx;
  display: flex;
  justify-content: center;
}
.msg{
  text-align: center;
}
</style>
