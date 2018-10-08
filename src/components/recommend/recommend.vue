<!--
* @file recommend.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-10 17:07:00
* @desc 推荐页组件
-->

<template>
    <div class="recommend">
      <div class="recommend-content">
        <div class="slider-wrapper" v-if="sliders.length">
          <slider>
            <div v-for="(slider,index) in sliders" :key="index">
              <a :href="slider.linkUrl">
                <img :src="slider.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul></ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import {getSliders, getDissList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import Slider from '../../base/slider/slider'

  export default {
      name: 'recommend',
      data() {
        return {
          sliders: [],
          dissList: []
        }
      },
      created () {
        this._getSliders()
        this._getDissList()
      },
      methods: {
        // 获取轮播图数据
        _getSliders() {
          getSliders().then((res) => {
            if (res.code === ERR_OK) {
              this.sliders = res.data.slider
            }
          })
        },
        // 获取歌单数据
        _getDissList() {
          getDissList().then((res) => {
            if (res.code === ERR_OK) {
              this.dissList = res.data.list
              console.log(this.dissList)
            }
          })
        }
      },
      components: {
        Slider
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden;
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-theme
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
