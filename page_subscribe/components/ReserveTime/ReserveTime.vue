<!-- <template>
  <view class="reserve-time-list">
    <view class="top">
      <view class="reserve-type-select">
        <u-tabs ref="tabs" :list="cardTypeList" active-color="#7fa1f7" inactive-color="#606266" font-size="30"/>
      </view>
      <view class="notice">
        <uni-notice-bar :text="reserveNotice" :single="true" showIcon  background-color="#f6f6f6"/>
      </view>
      <view class="reserve-data">
        <uni-section :title="room" type="line">
          <view class="reserve_datatime">
            <view v-for="(item,i) in dataList" :key="i"
              :class="selectedIndex==i?'datatime-item1 datatime-item':'datatime-item'" @click="switchDate(i)">
              <view>{{item.week}}</view>
              <view class="data">{{item.data}}</view>
            </view>
          </view>
        </uni-section>
      </view>
    </view>
    
    <scroll-view>
      <view class="free-time">
        <button v-for="(item,i) in freeDate" :key="i" :class="item.isFree===0?'free-time-item':'free-time-item busy-time-item'" :disabled="item.isFree===0?false:true" @click="selectTime">
          <view>
            {{item.isNextDay==1?'次日':''}}{{item.time}}
          </view>
          <view>
            <uni-icons :type="item.isFree===0?'person-filled':''" size="15" color="#7fa1f7"/>
            {{item.isFree===0?'空闲':'已预定'}}
          </view>
        </button>
      </view>
    </scroll-view>
    <view class="sub_subscribe">
      <view class="sub_total">共计：{{totalHour}}小时</view>
      <view>
        <u-button type="primary" @click="reserve" 
        :custom-style="selectcustomStyle">
          立即预定
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'ReserveTime',
    props:{
      room: String,
      id: String,
      dataList: Object,
      freeList: Object,
      selectedDateIndex: Number,
      selectedDate: String,
    },
    data() {
      return {
        selectcustomStyle:{
        	width: '200rpx',
        	backgroundColor:'#7fa1f7',
        	borderRadius:'30rpx'
        },
        isNextDay: false,
        DateList: ['00:00-00:30','00:30-1:00','01:00-1:30','01:30-2:00','02:00-02:30','02:30-03:00','03:00-03:30','03:30-04:00','04:00-04:30','04:30-05:00','05:00-5:30','05:30-06:00','06:00-06:30','06:30-07:00','07:00-07:30','07:30-08:00','08:00-08:30','08:30-09:00','09:00-09:30','09:30-10:00','10:00-10:30','10:30-11:00','11:00-11:30','11:30-12:00','12:00-12:30','12:30-13:00','13:00-13:30','13:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-16:00','16:00-16:30','16:30-17:00','17:00-17:30','17:30-18:00','18:00-18:30','18:30-19:00','19:00-19:30','19:30-20:00','20:00-20:30','20:30-21:00','21:00-21:30','21:30-22:00','22:00-22:30','22:30-23:00','23:00-23:30','23:30-00:00'],
        freeDate: this.freeList,
        cardTypeList:[{name: '按小时'}],
        reserveNotice:'24小时营业，可提前6天预约',
        totalHour: 0,
        roomId:this.id,
        selectedIndex: this.selectedDate,
        localTime: this.selectedDate,
      };
    },
    onLoad() {
      
    },
    methods: {
      reserve() {
        this.$emit('reserve')
      },
      async switchDate(id,year,date) {
        this.localTime = year+'-'+date
        this.selectedIndex = id
      },
      async getDateTime() {
        let body = new Object()
        body.roomId = this.roomId
        body.date = this.localTime
        let data = await getApp().UniRequest("/reservation/get", "GET", body, "",1)
        if (data.code !== 20000) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
        this.freeDate = data.data
      },
      selectTime() {
        
      }
    },
  }
</script>

<style lang="scss">
.reserve-time-list{
  .top{
    background-color: #fff;
    position: sticky;
    z-index: 9999;
    top: 0;
    height: 400rpx;
    .notice{
      height: 80rpx;
    }
    .reserve-data{
      .reserve_datatime{
        display: flex;
        justify-content: space-between;
        padding-top: 25rpx;
        .datatime-item{
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: rgba(134, 161, 235, 0.3);
          padding: 15rpx;
          border-radius: 8px;
          margin-right: 8rpx;
          margin-left: 8rpx;
          font-size: 11px;
          .data {
            margin-top: 18rpx;
          }
        }
        .datatime-item1{
          background-color: #7fa1f7;
        }
      }
    }
  }
    .free-time{
      display: flex;
      flex-wrap: wrap;
      .free-time-item{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 23%;
        margin-right: 6rpx;
        margin-left: 6rpx;
        margin-top: 28rpx;
        background: rgba(134, 161, 235, 0.3);
        border-radius: 30rpx;
        font-size: 9px;
        padding: 15rpx 4rpx;
        view{
          text-align: center;
          background: rgba(134, 161, 235, 0);
          border: 0px solid rgba(134, 161, 235, 0);
        }
      }
      .busy-time-item{
        background-color: #e6e6e6;
        view{
          background: #e6e6e6;
          border: 0px solid #e6e6e6;
          color: #000;
        }
      }
    }
  
  .sub_subscribe{
    background-color: #fff;
    position: sticky;
    width: 100%;
    height: 150rpx;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx;
    .sub_total{
      color: #f7434d;
    }
  }
}
</style>
 -->