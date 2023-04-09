<template>
	<view :style="'height:' + height + 'rpx;position: relative;margin:0rpx;padding:0rpx;box-sizing: border-box;'">
    <view class="binding_phone">
      <u-image width="350rpx" height="350rpx" :src="src" mode="widthFix" border-radius="80"/>
      <view>您还未绑定手机号</view>
      <button class="btn" open-type="getPhoneNumber" @getphonenumber="getPhone" >绑定手机</button>
    </view>
		<view class="textcss">
			<p class="text">版权所有 © 2022 winston开发组</p>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			let that = this
			this.height = getApp().globalData.pageHeight - getApp().globalData.navBarHeight;
		},
		data() {
			return {
				height: 0,
				src: '/static/applogo/binding.png',
				loginButton: {
					marginBottom: '30rpx'
				},
				pictureUrl: '',

			}
		},
		methods: {
			async getPhone(e) {
        if(e.detail.errMsg=="getPhoneNumber:fail user deny"){ //用户决绝授权  
          return uni.showToast({
            title: '用户决绝授权',
            duration: 1500,
            icon: 'none',
          })
        }else if(e.detail.errMsg=="getPhoneNumber:fail no permission"){//没有权限
          console.log(e);
          return uni.showToast({
            title: '当前没有权限',
            duration: 1500,
            icon: 'none',
          })
        } else{  //允许授权  
          console.log(e)
          var body = new Object()
          body.code = e.detail.code
          body.openid = getApp().globalData.openid
          let data = await getApp().UniRequest("/user/savePhone", "POST", body, "",1)
          if (data.code !== 20000) {
            return uni.showToast({
              title: '数据请求失败',
              duration: 1500,
              icon: 'none',
            })
          }
          if (data.code === 20000) {
            uni.navigateTo({
              url: "/pages/Home/Home"
            })
          }
        }
			},
		}
	}
</script>

<style lang="scss" scoped>
	.textcss {
		position: absolute;
		width: 100%;
		bottom: 0rpx;
		text-align: center;
		color: #828284;
		.text {
			width: 100%;
			text-align: center;
		}
	}
	.binding_phone{
    display: flex;
    flex-direction: column;
    align-items: center;
    view {
      color: #828284;
    }
      .btn {
      	height: 110rpx;
        margin-top: 45rpx;
        width: 90%;
      	background: #7ea2fa;
      	border-radius: 15px;
      	font-size: 18px;
      	font-weight: 400;
      	color: #FFFFFF;
      	text-align: -webkit-center;
      }
      .btn:active{
      	background: #bbcaff;
      }
  }
  page{
    background-color: #f6f6f6;
  }
</style>
