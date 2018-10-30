<template>
  <div class="splash" v-show="isShow">
    <slider>
      <div>
        <a @click="linkAlert">
          <img class="needsclick" src="./01.jpg" alt="" width="100%" height="100%">
        </a>
      </div>
      <div>
        <a @click="linkAlert">
          <img class="needsclick" src="./02.jpg" alt=""  width="100%" height="100%">
        </a>
      </div>
      <div>
        <a @click="linkAlert">
          <img class="needsclick" src="./03.jpg" alt=""  width="100%" height="100%">
        </a>
      </div>
    </slider>
    <div class="start-btn" @click="start">
      <i class="icon-play"></i>
      <span class="text">开始体验</span>
    </div>
  </div>
</template>

<script>
  import storage from 'good-storage'
  import Slider from 'base/slider/slider'

  export default {
    name: 'splash',
    data() {
      return {
        isShow: false
      }
    },
    watch: {
      // isShow(news, olds) {
      //   if (news !== olds) {
      //     return true
      //   }
      // }
    },
    methods: {
      start() {
        this.isShow = false
        storage.set('__SPLASH__', true)
      },
      linkAlert() {
        return false
      }
    },
    mounted() {
      // storage.remove('__SPLASH__')
      if (!storage.get('__SPLASH__')) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    components: {
      Slider
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .splash slider
    position fixed
    top -100px
    left 0
    bottom: 0
    right: 0
    z-index 10
    /*width 100%*/
    /*height 100%*/
    opacity 1
    transition opacity .3s ease
    box-sizing border-box
    /*&.fade-enter,&.fade-leave-to*/
      /*opacity 0*/
  /*.splash*/
    /*display: flex*/
    /*justify-content: center*/
  .splash .start-btn
    position: absolute
    left: 30%
    top: 75%
    z-index: 10
    box-sizing: border-box
    width: 135px
    padding: 7px 0
    margin: 0 auto
    text-align: center
    border: 1px solid $color-theme
    color: $color-theme
    border-radius: 16px
    font-size: 0
    .icon-play
      display: inline-block
      vertical-align: middle
      margin-right: 6px
      font-size: $font-size-medium-x
    .text
      display: inline-block
      vertical-align: middle
      font-size: $font-size-small
</style>
