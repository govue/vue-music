<template>
    <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <div class="dots"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    // import BScroll from 'better-scroll'
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
        },
        _initSlider() {

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
          color: red
</style>
