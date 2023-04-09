<template>
	<view>
		<view class="dividing-rule">
			<!-- 标记 -->
			<view class="flex-center" style="top: 1px;">
				<view class="triangl-down"></view>
			</view>
			<view class="flex-center" style="top: 7px;">
				<view class="markLine"></view>
			</view>
			<scroll-view scroll-x scroll-with-animation :scroll-left="scrollLeft" :show-scrollbar="false"
				@scroll="scroll" style="border-top:1px solid #ccc;padding-top: 3px;padding-bottom: 10px;">
				<view :style="{width: totalWidth + 'px'}">
					<view style="width: 100%;"
						:style="{paddingLeft: initPosition + 'px', paddingRight: initPosition+1 + 'px'}">
						<!-- 刻度线 -->
						<view style="display: flex;">
							<view v-for="(item,index) in options" :key="index" :class="item.type"
								:style="{minWidth: lineWidth - 1 + 'px'}">
							</view>
						</view>
						<!-- 刻度值 -->
						<view style="display: flex;margin-top: 6px;">
							<view v-for="(item,index) in options" :key="index" :style="{minWidth: lineWidth + 'px'}"
								:class="[selectIndex == index ? 'line-label' : '']">
								<text style="margin-left: -5px;">{{item.val}}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import debounce from './debounce.js'

	export default {
		name: "horizontal-rule",
		props: {
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
				scrollLeft: 0, //初始位置
				initPosition: '', // 最小刻度尺的位置
				totalWidth: '100%', // 尺子总宽度
				currentVal: '0', // 当前值
			};
		},
		watch: {
			value: function(val, oldVal) {
				this.init()
			}
		},
		mounted() {
			var left = 0;
			// 获取页面元素
			let view = uni.createSelectorQuery().in(this).select('.dividing-rule');
			view.boundingClientRect(data => {
				left = data.left
				console.log('获取页面元素', data)
			}).exec()
			// 获取指针位置
			let middleLine = uni.createSelectorQuery().in(this).select('.markLine');
			middleLine.boundingClientRect(data => {
				console.log('获取指针位置', data)
				this.initPosition = data.left - left
				this.init()
			}).exec()
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
				console.log('总刻度', JSON.parse(JSON.stringify(this.options)))
				// 总宽度 = 总格子 * 每个格子的宽度
				this.totalWidth = ((this.max - this.min) * this.multiple) * this.lineWidth
				// 初始位置
				setTimeout(() => {
					// 初始值必须在min 与 max 之间
					if (this.value < this.min) {
						this.scrollLeft = 0
					} else if (this.value > this.max) {
						this.scrollLeft = this.totalWidth
					} else {
						this.scrollLeft = (this.value - this.min) * this.multiple * this.lineWidth
					}
					this.currentVal = this.value
					this.selectIndex = this.options.findIndex((item, index) => this.value == item.val)
					console.log('初始位置---------------》', this.scrollLeft)
					this.$emit('change', this.currentVal)
				}, 40)
			},
			// 监听滚动事件
			scroll: function(e) {
				var result = ((this.max - this.min) / this.totalWidth * e.detail.scrollLeft) + this.min
				this.currentVal = result 
				this.$emit('change', this.currentVal)
				// 处理滑在两个刻度之间，自动靠近最近一个刻度
				debounce(() => {
					var num = Math.round(result * this.multiple)/this.multiple
					this.scrollLeft = (num - this.min) * this.multiple * this.lineWidth
					this.selectIndex = this.options.findIndex((item, index) => num == item.val)
				}, 500)
			}
		}

	}
</script>

<style>
	.dividing-rule {
		position: relative;
	}

	.flex-center {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		position: absolute;
		z-index: 1000;
	}

	.triangl-down {
		width: 0;
		height: 0;
		border-top: 12px solid #7fa1f7;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-radius: 2px;
	}

	.markLine {
		width: 2px;
		height: 20px;
		z-index: 1;
		margin-top: -4px;
		background: #7fa1f7;
	}

	.bg-red {
		background: red;
	}

	.bg-blue {
		background: blue;
	}

	.line {
		display: flex;
		border-top: 1px solid lightgray;
		padding-top: 6px;
		padding-bottom: 6px;
	}

	.line-lg {
		height: 15px;
		border-left: 1px solid #979797;
	}

	.line-md {
		height: 10px;
		border-left: 1px solid #e8e8e8;
	}

	.line-sm {
		height: 5px;
		border-left: 1px solid #e8e8e8;
	}

	.line-label {
		color: #7fa1f7;
	}
</style>
