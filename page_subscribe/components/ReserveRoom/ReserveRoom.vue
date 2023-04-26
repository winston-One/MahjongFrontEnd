<template>
  <view class="reserve-room-card" >
    <image :src="roomMsg.photoAdd" class="room-image"></image>
    <view class="room_name">{{roomMsg.roomName}}</view>
    <view class="room_server">
      <view v-for="(item,i) in roomMsg.tag" :key="i">
        {{item}}
        <u-icon name="checkmark-circle-fill"
          color="#7fa1f7" size="28"/>
      </view>
    </view>
    <!--当天的一条时间轴，分为可预约，不可预约，待开发-->
    <!-- <view class="reserve-result">
      <view class="time_calibration">
        <u-steps :list="numList" :current="1" active-color="#7fa1f7"></u-steps>
      </view>
      <view class="reserve_tag">
        <view>
          <uni-icons type="smallcircle-filled" color="#7fa1f7" size="10"/>不可预约
        </view>
        <view>
          <uni-icons type="smallcircle-filled" color="#f7434d" size="10"/>已预约
        </view>
        <view>
          <uni-icons type="smallcircle-filled" color="#e6e6e6" size="10"/>可预约
        </view>
      </view>
    </view> -->
    <view class="room_reserve">
      <view class="room_price">
        <view class="price">￥{{roomMsg.pricePerHour}}/半小时</view>
        <view class="room_coupon">可使用卡券/团购券</view>
      </view>
      <view :class="roomMsg.isFree==0? 'reserve':'reserve busy'">
        <u-button type="primary" @click="reserveRoom" :custom-style="selectcustomStyle" >预定</u-button>
        <view class="reserve_free">{{roomMsg.isFree==false? '已满':'空闲'}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'ReserveRoom',
    props:{
      roomMsg:{
        roomId: String,
        photoAdd: String,
        roomName: String,
        tag: Array,
        timeRanges: Array,
        isFree:Boolean,
        pricePerHour: Number,
      }
    },
    data() {
      return {
        selectcustomStyle:{
        	width: '140rpx',
        	backgroundColor:'#7fa1f7',//roomMsg.isFree==0? 'selectcustomStyle':'selectcustomStyle1'
        	borderRadius:'30rpx'
        },
        selectcustomStyle1: {
          width: '140rpx',
          backgroundColor:'#e6e6e6',
          borderRadius:'30rpx'
        }
      };
    },
    onLoad() {
      
    },
    methods: {
      reserveRoom() {
        this.$emit('reserveRoom',this.roomMsg)//.roomName,this.roomMsg.roomId)
      }
    },
  }
</script>

<style lang="scss">
.reserve-room-card{
  padding: 25rpx;
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 15rpx;
  padding: 30rpx;
  .room-image{
    width: 98%;
    height: 330rpx;
  }
  .room_name{
    font-size: 17px;
    font-weight: 600;
    margin-top: 15rpx;
  }
  .room_server{
    display: flex;
    justify-content: flex-start;
    margin-top: 15rpx;
    margin-left: 8rpx;
  }
  .reserve-result{
    display: flex;
    flex-direction: column;
    margin-top: 15rpx;
    
    .reserve_tag{
      display: flex;
      justify-content: flex-start;
    }
  }
  .room_reserve{
    display: flex;
    justify-content: space-between;
    margin-top: 25rpx;
    align-items: center;
    .room_price{
      .price{
        font-size: 16px;
        font-weight: 500;
      }
      .room_coupon{
        font-size: 13px;
        border: 1px solid #7fa1f7;
        font-weight: 100;
      }
    }
    .reserve{
      display: flex;
      flex-direction: column;
      border: 2px solid #7fa1f7;
      border-radius: 36rpx;
      .reserve_free{
        text-align: center;
      }
    }
    .busy {
      border: 2px solid #e6e6e6;
    }
  }
}

</style>