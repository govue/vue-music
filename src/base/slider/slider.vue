<template>
    <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <div class="dots">
        <span class="dot" v-for="(dot,index) in dots" :key="index" :class="{active:currentSliderIndex===index}">{{index}}</span>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'
    import {addClass} from '../../common/js/dom'

    export default {
      name: 'slider',
      data() {
        return {
          dots: [],
          currentSliderIndex: 0
        }
      },
      props: {
        // 循环播放
        loop: {
          type: Boolean,
          default: true
        },
        // 自动播放
        autoPlay: {
          type: Boolean,
          default: true
        },
        // 播放时间间隔
        interval: {
          type: Number,
          default: 2000
        }
      },
      methods: {
        // 设置幻灯片宽度
        _setSliderWidth(isResize) {
          this.childrens = this.$refs.sliderGroup.children
          let sliderWidth = this.$refs.slider.clientWidth
          let width = 0 // 幻灯片总宽度
          for (let i = 0; i < this.childrens.length; i++) {
            let child = this.childrens[i]
            addClass(child, 'slider-item') // 给每一个幻灯片添加样式
            child.style.width = sliderWidth + 'px' // 设置每一个幻灯片宽度
            width += sliderWidth
          }
          // 如果是自动轮播将总宽度增加2倍
          if (this.loop && !isResize) {
            width += 2 * sliderWidth
          }
          this.$refs.sliderGroup.style.width = width + 'px'
        },
        // 初始化dost
        _initDots() {
          this.dots = new Array(this.childrens.length)
        },
        // 初始化幻灯片
        _initSlider() {
          this.slider = new BScroll(this.$refs.slider, {
            scrollX: true, // 沿x轴
            scrollY: false, // 沿y轴
            momentum: false, // 开启滑动惯性
            snap: true, // 滚动
            snapLoop: this.loop, // 可以无缝循环轮播
            snapThreshold: 0.3, // 用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
            snapSpeed: 400 // 轮播图切换的动画时间
            // click: true a链接不需要监听click事件
          })
          // 通过事件来获取当前幻灯片的index
          this.slider.on('scrollEnd', () => {
            let sliderIndex = this.slider.getCurrentPage().pageX
            if (this.loop) {
              sliderIndex -= 1
            }
            this.currentSliderIndex = sliderIndex
            // 如果设置了自动轮播，这里调用_play()方法来实现自动轮播
            if (this.autoPlay) {
              clearTimeout(this.sliderTimer)
              this._play()
            }
          })
        },
        // 幻灯片播放
        _play() {
          let sliderIndex = this.currentSliderIndex + 1
          if (this.loop) {
            sliderIndex += 1
          }
          this.sliderTimer = setTimeout(() => {
            this.slider.goToPage(sliderIndex, 0, 400) // 400为幻灯片切换时图片移动时的时间
          }, this.interval) // this.interval为幻灯片图片停留时间
        }
      },
      mounted() {
        setTimeout(() => {
          this._setSliderWidth()
          this._initDots()
          this._initSlider()
          // 如果设置了自动播放
          if (this.autoPlay) {
            this._play()
          }

          // 监听浏览器窗口变化，重新计算幻灯片宽度
          window.addEventListener('resize', () => {
            // 如果还没有初始化
            if (!this.slider) {
              return
            }
            this._setSliderWidth(true)
            this.slider.refresh()
          })
        }, 20) // 此处设置20毫秒是因为浏览器刷新是17毫秒
      },
      destroyed() {
        clearTimeout(this.sliderTimer) // 清除cliderTimer定时器
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background-color: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background-color: $color-text-ll
</style>
