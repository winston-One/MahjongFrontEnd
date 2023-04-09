<template>
	<view>
		<view class="flex justify-start align-items">
			<scroll-view :scroll-y="true" :scroll-with-animation="true" :scroll-top="scrollTop" :show-scrollbar="false"
				:style="{height: height + 'px'}" @scroll="scroll" style="width: auto;">
				<view class="flex" :style="{paddingTop: height/2 + 'px', paddingBottom: height/2 - lineWidth + 'px'}">
					<!-- 数值 -->
					<view>
						<!-- :class="index%2==0 ? 'bg-red' : 'bg-blue'" -->
						<view v-for="(item,index) in options" :key="index" :style="{height: lineWidth + 'px'}"
							style="width: 30px;position: relative;">
							<view style="margin-top: -20rpx;position: absolute;" :class="selectIndex == index ? 'line-label' : ''">{{item.val}}</view>
						</view>
					</view>
					<!-- 刻度线 -->
					<view class="line" style="border-right: 1px solid #ccc;">
						<view v-for="(item,index) in options" :key="index" :style="{height: lineWidth - 1 + 'px'}"
							:class="item.type">
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 标记 -->
			<view class="flex align-items mark">
				<view class="markLine"></view>
				<view class="triangl-left"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import debounce from './debounce.js'
	export default {
		name: "vertical-rule",
		props: {
			height: {
				type: Number,
				default: 100
			},
			min: { // 最小值
				type: Number,
				default: 0,
				validator: function(val) {
					return parseFloat(val) >= 0
				}
			},
			max: { // 最大值
				type: Number,
				default: 100,
				validator: function(val) {
					return parseFloat(val) >= 0
				}
			},
			value: { // 初始值
				type: Number,
				default: 50,
				validator: function(val) {
					return parseFloat(val) >= 0
				}
			},
			multiple: { // 倍数 只支持10的倍数； multiple = 1 表示每个刻度的值等于1；multiple = 10 表示每个刻度的值等于0.1
				type: [Number],
				default: 1
			},
			lineWidth: { // 每个刻度之间的宽度
				type: Number,
				default: 6,
				validator: function(val) {
					return parseFloat(val) >= 0
				}
			}
		},
		data() {
			return {
				options: [], // 刻度线
				selectIndex: -1,
				scrollTop: 0, //初始位置
				currentVal: '0', // 当前值
				totalHeight: 0,
			};
		},
		mounted() {
			this.init()
		},
		methods: {
			// 初始化刻度尺
			init: function() {
				// 最大值不能小于最小值
				if (this.min >= this.max) return
				this.options = []
				let index = this.min
				let length = this.max * this.multiple
				for (let i = this.min * this.multiple; i <= length; i++) {
					let type = ''
					if (i % 5 == 0) {
						type = 'line-md'
						if (i % 10 == 0) {
							type = 'line-lg'
						}
					} else {
						type = 'line-sm'
					}
					// 每 10 格 显示一个刻度值
					let val = ''
					if (i % 10 == 0) {
						val = i / this.multiple
					}
					this.options.push({
						type: type,
						val: val
					})

				}
				// 总高度 = 总格子 * 每个格子的高度
				this.totalHeight = ((this.max - this.min) * this.multiple) * this.lineWidth
				console.log('总高度 = 总格子 * 每个格子的高度', this.totalHeight)
				// 初始位置
				setTimeout(() => {
					// 初始值必须在min 与 max 之间
					if (this.value < this.min) {
						this.scrollTop = 0
					} else if (this.value > this.max) {
						this.scrollTop = this.heigh
					} else {
						this.scrollTop = (this.value - this.min) * this.multiple * this.lineWidth
					}
					this.currentVal = this.value
					this.selectIndex = this.options.findIndex((item, index) => this.value == item.val)
					this.$emit('change', this.currentVal)
				}, 40)
			},
			scroll: function(e) {
				var result = ((this.max - this.min) / this.totalHeight * e.detail.scrollTop) + this.min
				this.currentVal = result 
				this.$emit('change', this.currentVal)
				// 处理滑在两个刻度之间，自动靠近最近一个刻度
				debounce(() => {
					var num = Math.round(result * this.multiple)/this.multiple
					this.scrollTop = (num - this.min) * this.multiple * this.lineWidth
					this.selectIndex = this.options.findIndex((item, index) => num == item.val)
				}, 500)
			}
		}
	}
</script>

<style>
	.flex {
		display: flex;
	}

	.justify-start {
		justify-content: flex-start;
	}

	.align-items {
		align-items: center;
	}

	.mark {
		z-index: 100;
		margin-left: -30px;
	}

	.markLine {
		width: 23px;
		height: 2px;
		background: #3F86FF;
	}

	.triangl-left {
		width: 0;
		height: 0;
		border-right: 12px solid #3F86FF;
		border-top: 6px solid transparent;
		border-bottom: 6px solid transparent;
		border-radius: 2px;
		margin-left: -5px;
	}

	.bg-red {
		background: red;
	}

	.bg-blue {
		background: blue;
	}

	.line {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.line-lg {
		width: 30px;
		border-top: 1px solid #979797;
	}

	.line-md {
		width: 20px;
		border-top: 1px solid #e8e8e8;
	}

	.line-sm {
		width: 10px;
		border-top: 1px solid #e8e8e8;
	}

	.line-label {
		color: #3F86FF;
	}
</style>
