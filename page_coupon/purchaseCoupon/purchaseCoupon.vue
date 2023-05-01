<template>
  <view class="submit-order">
      <view class="order-msg">
        <view class="flex-style">
          <view class="coupon-name">卡券名称</view>
          <view class="reserve_time">
            <view>{{voucherName}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view class="coupon-name">可用范围</view>
          <view class="reserve_time">
            <view>{{availableRange}}</view>
          </view>
        </view>
        <view class="flex-style">
          <view class="coupon-name">有效期至</view>
          <view class="reserve_time">
            <view>购买后{{validityPeriod}}天内有效</view>
          </view>
        </view>
        <view class="coupon-style">
          <view>该卡券可用次数：1次</view>
          <view>该卡券周一、二、三、四、五、六、日，全天可用</view>
          <view>该卡券购买后立即生效</view>
        </view>
      </view>
      <view class="tip">
        <view>温馨提示</view>
        <view>如有不可抗力因素，请致电商家并且初始不可抗力因素证明!!!</view>
      </view>
      <view class="reservation">
        <view class="reservation_total">
          总计：￥{{price}}
        </view>
        <view class="confirm_btn" @click="purchaseReserve">确定购买</view>
      </view>
    </view>
</template>

<script>
  export default {
    data() {
      return {
        voucherId:'',
        voucherName:'',
        title:'',
        availableRange:'',
        price:0,
        room: '',
        validityPeriod:30,
        duration: 3,
        ip:[],
      };
    },
    onLoad(option) {
      let that = this
      uni.request({ // 获取ip地址
      	url: 'https://pv.sohu.com/cityjson?ie=utf-8',
      	method: 'POST',
      	success: (res) => {
      		const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
      		let ip = reg.exec(res.data);
          that.ip = ip;
      	}
      })
      console.log(this.ip[0]);
      var data = JSON.parse(decodeURIComponent(option.coupon))
      this.voucherId = data.voucherId
      this.voucherName = data.title
      this.availableRange = data.availableRange
      this.price = data.price
      this.validityPeriod = data.term
    },
    methods: {
      setTimeDateFmt(s) {  // 个位数补齐十位数
        return s < 10 ? '0' + s : s;
      },
      createordernum() {
          const now = new Date()
          let month = now.getMonth() + 1
          let day = now.getDate()
          let hour = now.getHours()
          let minutes = now.getMinutes()
          let seconds = now.getSeconds()
          month = this.setTimeDateFmt(month)
          day = this.setTimeDateFmt(day)
          hour = this.setTimeDateFmt(hour)
          minutes = this.setTimeDateFmt(minutes)
          seconds = this.setTimeDateFmt(seconds)
          let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000)).toString();
          return orderCode;
          //基于年月日时分秒+随机数生成订单编号
      },
      async purchaseReserve() {
        // 下单并且支付
        uni.showLoading({
        	title: "加载中",
        	mask: true
        })
        if (this.price <= 0) {
        	uni.showModal({
        		title: '提示',
        		content: '无法支付，请联系客服',
        		showCancel: false,
        		success: res => {
        			uni.navigateBack()
        		}
        	})
        }
        var orderNo = this.createordernum()
        var that = this
        let request = new Object()
        request.openid = getApp().globalData.openid
        request.realPrice = this.price
        request.orderNo = orderNo
        request.ip = this.ip[0]
        let res = await getApp().UniRequest("/business/pay", "POST", request, '', 1)
        console.log('res-----', res)
        uni.hideLoading()
        if (res.code == 20000) {
        	let payRes = res.data
        	console.log('payRes-----', payRes)
        	uni.requestPayment({
        		provider: 'wxpay', // 服务提供商，通过 uni.getProvider 获取。
        		timeStamp: payRes.timeStamp, // 时间戳从1970年1月1日至今的秒数，即当前的时间。
        		nonceStr: payRes.nonceStr, // 随机字符串，长度为32个字符以下。
        		package: payRes.packageValue, // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。
        		signType: payRes.signType, // 签名算法，应与后台下单时的值一致
        		paySign: payRes.paySign, // 签名，具体签名方案参见 微信小程序支付文档
        		success: async function(e) {
              let body = new Object()
              body.voucherId = that.voucherId
              body.orderId = orderNo
              body.openid = getApp().globalData.openid
              let data = await getApp().UniRequest("/voucherUser/booking", "GET", body, "",1)
              if(data.code === 2000) {
                console.log('购买成功');
              }
        			console.log('success---------' + JSON.stringify(e));
        		},
        		async fail(err) {
        			//支付失败后调用接口取消订单
        			console.log('取消支付')
        		}
        	});
        }
      },
    },
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
  .order-msg{
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #fff;
    margin-top: 15rpx;
    .flex-style{
      display: flex;
      justify-content: space-between;
      padding: 45rpx;
      border-bottom: 2px solid #f6f6f6;
      .reserve_time{
        display: flex;
        justify-content: flex-end;
      }
      .coupon-name{
        font-weight: 200;
      }
    }
    .coupon-style{
      display: flex;
      flex-direction: column;
      padding: 30rpx;
      font-weight: 200;
      border-bottom: 2px solid #f6f6f6;
    }
  }
  .tip{
    background-color: #fff;
    margin-top: 15rpx;
    padding: 25rpx;
  }
}
.reservation{
  position: fixed;
  height: 250rpx;
  bottom: 0;
  font-size: 17px;
  width: 100%;
  border-top-right-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 25rpx;
  .reservation_total{
    color: #f7434d;
  }
  .confirm_btn{
    background-color: #7fa1f7;
    color: #fff;
    height: 100rpx;
    width: 40%;
    border-radius: 35rpx;
    text-align: center;
    padding: 25rpx;
  }
}
.coupon_list{
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20rpx;
  .coupon_item{ 
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;
    border-bottom: 2px solid #e6e6e6;
    height: 100rpx;
    .msg{
      font-size: 16px;
      font-weight: 500;
    }
    .btn{
      font-size: 14px;
      background-color: #7fa1f7;
      height: 80rpx;
      width: 150rpx;
      border-radius: 30rpx;
      padding: 0;
      margin: 0;
      text-align: center;
    }
  }
}
</style>
