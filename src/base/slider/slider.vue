<template>
    <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <div class="dots"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'
    import {addClass} from '../../common/js/dom'

    export default {
      name: 'slider',
      props: {
        loop: {
          type: Boolean,
          default: true
        },
        autoPlay: {
          type: Boolean,
          default: true
        },
        interval: {
          type: Number,
          default: 4000
        }
      },
      methods: {
        _setSliderWidth() {
          this.childrens = this.$refs.sliderGroup.children
          let width = 0
          let sliderWidth = this.$refs.slider.clientWidth
          for (let i = 0; i < this.childrens.length; i++) {
            let child = this.childrens[i]
            addClass(child, 'slider-item')
            child.style.width = sliderWidth + 'px'
            width += sliderWidth
          }
          if (this.loop) {
            width += 2 * sliderWidth
          }
          this.$refs.sliderGroup.style.width = width + 'px'
        },
        _initSlider() {
          this.slider = new BScroll(this.$refs.slider, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: true,
            snapLoop: this.loop,
            snapThreshold: 0.3,
            snapSpeed: 400,
            click: true
          })
        }
      },
      mounted() {
        setTimeout(() => {
          this._setSliderWidth()
          this._initSlider()
        }, 20) // 此处设置20毫秒是因为浏览器刷新是17毫秒
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
</style>
