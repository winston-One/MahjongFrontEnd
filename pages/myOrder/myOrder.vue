<template>
  <view>
    <MyLogin v-if="token===''"></MyLogin>
    <template v-else>
      <view class="top">
        <view class="select-dropdown">
        	<u-dropdown active-color="#7fa1f7" ref="selectDropdown">
        		<u-dropdown-item title="订单" v-model="Ordervalue" 
              :options="orderOption" @change="orderChange">
        		</u-dropdown-item>
<!--        		<u-dropdown-item title="排序" v-model="sortValue" 
              :options="sortOption" @change="sortChange">
        		</u-dropdown-item> -->
        		<u-dropdown-item v-model="storeValue" title="门店" 
              :options="storeOption" @change="storeChange">
            </u-dropdown-item>
        	</u-dropdown>
        </view>
      </view>
      <view class="No_result" v-if="orderLists.length===0&&isloadingOrder===0">
        <u-empty text="非常抱歉" mode="order"/>
        <view class="tip">
          您当前没有相关订单哟
        </view>
        <view class="select-button">
        	<u-button type="primary" @click="skipSubscribe" :custom-style="selectcustomStyle">
            <u-icon name="arrow-rightward"></u-icon>前往预约
          </u-button>
        </view>
      </view>
      <view v-if="orderLists.length!==0" class="order-list" v-for="(item ,i) in orderLists" :key="i">
        <OrderCard :order="item" ></OrderCard>
      </view>
    </template>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        token:'winston',
        Ordervalue: 1,
        isloadingOrder: 1,
        orderOption:[{
            value: 0,
            label: '全部订单',
          },
          {
            value: 1,
            label: '使用中',
          },
          {
            value: 2,
            label: '已预约',
          },
          {
            value: 3,
            label: '已完成',
          },
        ],
        sortValue: 0,
        sortOption:[{
            value: 0,
            label: '默认排序',
          },
          {
            value: 1,
            label: '下单时间',
          },
          {
            value: 2,
            label: '预约时间',
          }
        ],
        storeValue: 0,
        storeOption: [{
            value: 0,
            storeId: '',
            label: '',//'马上到国粹交流中心(安鸿店)',
          },
          {
            value: 1,
            storeId: '',
            label: '',//'马上到国粹交流中心(数码街店)',
          },
          {
            value: 2,
            storeId: '',
            label: '',//'马上到国粹交流中心(麦地升平苑店)',
          },
          {
            value: 3,
            storeId: '',
            label: '',//'马上到国粹交流中心(玉兰店)',
          }
        ],
        storeId: '',
        orderStatus: 0,
        orderLists: [],
        selectcustomStyle:{
        	width: '400rpx',
        	backgroundColor:'#7fa1f7',
        	borderRadius:'50rpx'
        },
        loadingShow:true,
        pageNum: 1,
        total:1,
        // 是否正在请求数据
        isloading: false,
      };
    },
    onLaunch() {
      //this.token = uni.getStorageSync('Authority')
    },
    // 上拉触底事件
    onReachBottom() {
      if (this.pageNum * 10 >= this.total) {
        return uni.showToast({
          title: '暂无更多数据',
          duration: 1500,
          icon: 'none',
        })
      }else{
        uni.showToast({
          title: '加载中',
          duration: 1000,
          icon: 'none',
        })
      }
      if (this.isloading) return
      this.pageNum += 1
      this.getOrderData()
    },
    async onLoad() {
      //this.token = uni.getStorageSync('Authority')
      if(this.token === '') {
        return
      }
      this.storeId = getApp().globalData.storeId
      this.isloadingOrder=1
      this.getOrderData()
      this.isloadingOrder=0
      let data = await getApp().UniRequest("/store/selectAllStore", "POST","", "",1)
      if (data.code !== 20000) {
        return uni.showToast({
          title: '数据请求失败！',
          duration: 1500,
          icon: 'none',
        })
      }
      for(let i = 0; i < data.data.length;i++) {
        this.storeOption[i].label = data.data[i].storeName
        this.storeOption[i].storeId = data.data[i].storeId
      }
      
    },
    methods: {
      async getOrderData() {
        uni.showLoading({
        	title:'加载中'
        })
        this.isloading = true
        let orderObj = new Object()
        orderObj.openId = getApp().globalData.openid
        orderObj.orderStatus = this.orderStatus
        orderObj.pageNum = this.pageNum
        orderObj.storeId = this.storeId
        let data = await getApp().UniRequest("/order/getAllOrderByUser", "POST",orderObj, "",1)
        if (data.code !== 20000) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
        uni.hideLoading()
        this.total = data.data.total
        this.orderLists = [...this.orderLists,...data.data.records]
        this.isloading = false
      },
      async orderChange(e) {
        this.pageNum = 1
        this.isloading = false
        this.orderLists = []
        if (e === 0) {
          this.orderStatus = e
        }
        if (e === 1) {
          this.orderStatus = e
        }
        if (e === 2) {
          this.orderStatus = e
        }
        if (e === 3) {
          this.orderStatus = e
        }
        this.getOrderData()
      },
      async storeChange(e) {
        this.pageNum = 1
        this.orderLists = []
        this.storeId = this.storeOption[e].storeId
        this.getOrderData()
      },
      skipSubscribe() {
        uni.navigateTo({
          url: '/page_subscribe/subscribeMain/subscribeMain'
        })
      }
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
  background-color: #fff;
  position: sticky;
  z-index: 9999;
  top: 0;
  height: 80rpx;
  .select-dropdown {
    
  }
}
.No_result{
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .tip{
    text-align: center;
  }
  .select-button{
    margin-top: 15rpx;
  }
}
.order-list{
  padding: 15rpx;
}
</style>
