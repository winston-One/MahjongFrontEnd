<template>
  <view>
    <view class="top">
      <view class="subsection">
        <u-subsection :list="cardTypeList" :current="cardType"
          active-color="#7fa1f7" @change="sectionChange"/>
      </view>
    </view>
    <view class="card_list" v-if="cardType === 0">
      <view v-for="(item,i) in meituanLists" :key="i" class="card_item" v-if="meituanLists.length!==0">
        <MeituanCoupon :couponMsg="item"></MeituanCoupon>
      </view>
      <view v-if="meituanLists.length===0" class="card_empty">
        <u-empty text="当前暂无团购券" mode="list"></u-empty>
      </view>
    </view>
    <view class="card_coupon" v-if="cardType === 1">
      <view v-if="cardLists.length===0" class="card_empty">
        <u-empty text="当前暂无卡券" mode="list"></u-empty>
      </view>
      <view v-for="(item,i) in cardLists" :key="i" class="card_item1" v-if="cardLists.length!==0">
        <MyVoucher :couponMsg="item"></MyVoucher>
      </view>
    </view>
  </view>
</template>

<script>
  import MyVoucher from '@/page_mine/components/MyVoucher.vue'
  export default {
    components: {
      MyVoucher
    },
    data() {
      return {
        cardLists:[],
        cardTypeList:[
          {
          	name: '团购券'
          }, 
          {
          	name: '卡券'
          }
        ],
        cardType: 1,
        meituanLists: [],
      };
    },
    async onLoad() {
      //this.cardLists=[{id:'8848',title:'5小时畅玩卡',availableRange:'所有',term:90,price:98.00,vouStatus:1}]
      this.getCardList()
      // this.getMeituanList()
    },
    methods: {
      sectionChange(index) {
        this.cardType = index
        this.getCardList()
        // this.getMeituanList() // 暂时没有美团的券
      },
      async getCardList() {
        let obj = new Object()
        obj.openId = getApp().globalData.openid
        let res = await getApp().UniRequest("/voucherUser/getVoucher", "GET", obj, "",1)
        if (res.code !== 20000) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
        this.cardLists = res.data
      },
      async getMeituanList() {
        let obj = new Object()
        obj.openId = getApp().globalData.openid
        obj.orderStatus = 1
        obj.sortStatus = 1
        obj.pageNum = 1
        obj.storeId = 1
        let data = await getApp().UniRequest("/DianPing/selectDPOrderInRedis", "POST", obj, "",1)
        if (data.code !== 20000) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
        if (data.data === null) {
          this.meituanLists = []
        }
        this.meituanLists = data.data.records
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
.top{
  position: sticky;
  height: 100rpx;
  z-index: 9999;
  background-color: #FFFFFF;
  border-bottom: 2rpx solid #efefef;
  padding-top: 27rpx;
  top: 0;
  .subsection{
    width: 60%;
  }
}
.card_list{
  padding: 15rpx;
  .card_item{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .card_empty{
    padding: 50rpx;
  }
}
.card_coupon {
  padding: 15rpx;
  .card_item1{
    display: flex;
    flex-direction: column;
  }
  .card_empty{
    padding: 50rpx;
  }
}
</style>
