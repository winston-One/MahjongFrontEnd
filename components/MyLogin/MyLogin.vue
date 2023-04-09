<template>
  <view class="login-container">
      <!-- 提示登录的图标 -->
    <view class="avatar">
      <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    </view>
    <view>您还未登录账号！</view>
      <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="login">一键登录</button>
      <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  export default {
    name:"MyLogin",
    data() {
      return {
        
      };
    },
    onLoad() {
      
    },
    methods: {
      // 获取微信用户的基本信息
      login() {
        uni.navigateTo({
          url: "/page_login/login/login"
        })
      },
      getPhone() {
        
      },
      // 退出登录
      // outsign: function () {
      //   if (this.data.token != '') {
      //     uni.showModal({
      //       title: '确定要退出吗？',
      //       success: (res) => {
      //         if (res.confirm) {
      //           getApp().globalData.token = '';
      //           uni.setStorageSync('token', '');
      //         } else if (res.cancel) {
      //           console.log('用户点击取消')
      //         }
      //       }
      //     })
      //   } else {
      //     uni.showToast({
      //       title: '请登录',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   },
    }
  }
</script>

<style lang="scss">
.login-container {
  height: 1276rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f6f6;
  position: relative;
  overflow: hidden;

  //绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }
  .avatar{
    margin-top: 100rpx;
  }
  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #7fa1f7;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>