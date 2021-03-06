<!--
* @file recommend.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-10 17:07:00
* @desc 推荐页组件
-->

<template>
    <div class="recommend" ref="recommend">
      <scroll class="recommend-content" :data="dissList" ref="scroll">
        <div>
          <div class="slider-wrapper" v-if="sliders.length">
            <slider>
              <div v-for="(slider,index) in sliders" :key="index">
                <!--<a :href="slider.linkUrl">-->
                <a @click="linkAlert">
                  <img class="needsclick" :src="slider.picUrl" @load="loadImage" alt="">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li class="item"
                  v-for="(item,index) in dissList"
                  :key="index"
                  @click="selectItem(item)"
              >
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl" alt="">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </scroll>
      <div class="loading-wrapper" v-if="!dissList.length">
        <loading></loading>
      </div>
      <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
  import {getSliders, getDissList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin' // 引入playlistMixin：解决当播放器从全屏缩小到mini模式时，底部dom高度不正确的bug
  import {mapMutations} from 'vuex' // vuex提供的写数据的语法糖

  export default {
      name: 'recommend',
      mixins: [playlistMixin],
      data() {
        return {
          sliders: [], // 幻灯片组
          dissList: [], // 歌单列表
          checkLoadedImage: false // 图片没有加载过时为false，加载后置为true
        }
      },
      created () {
        this._getSliders()
        this._getDissList()
      },
      methods: {
        linkAlert() {
          alert('这个功能还没开发哦，请听下其它歌先，~V~')
        },
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
            // console.log(res)
            if (res.code === ERR_OK) {
              this.dissList = res.data.list
            }
          })
        },
        /**
         * 歌单项点击时
         */
        selectItem(item) {
          this.$router.push({
            path: `/recommend/${item.dissid}`
          })
          this.setDiss(item)
        },
        /**
         * @method loadImage
         * @returns {}
         * @desc 有图片加载时,这里解决slide数据加载慢时，Bscroll计算高度错误的bug
         */
        loadImage() {
          if (!this.checkLoadedImage) {
            this.$refs.scroll.refresh() // 如果样式中不指定高度，这里refresh()时会计算出错
            this.checkLoadedImage = true
          }
        },
        /**
         * mixin方法实现当加载mini播放器的时候，scroll高度计算不准确的bug
         */
        handlePlaylist(playlist) {
          const bottom = playlist.length > 0 ? '60px' : 0
          this.$refs.recommend.style.bottom = bottom
          this.$refs.scroll.refresh()
        },
        /**
         * @computed mapMutations
         * @returns {}
         * @desc mapMutations将需要操作的数据做映射
         */
        ...mapMutations({
          setDiss: 'SET_DISS'
        })
      },
      components: {
        Slider,
        Scroll,
        Loading
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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
            flex: 1
            display: flex
            flex-direction: column
            justify-content: center
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-theme
            .desc
              color: $color-text-d
    .loading-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
