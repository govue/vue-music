<!--
* @file music-list.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-13 23:21:00
* @desc 歌曲列表组件，该组件的调用需要传入三个值：title\bg-image\songs，没有数据时可以绑定空数据：:songs="[]"，不然会报错,title\bg-image通过计算属性得到
-->
<template>
    <div class="music-list">
      <div class="back" @click="back">
        <i class="icon-back"></i> <!-- 这里的图标是在入口的main.js文件中引入的 -->
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="play-wrapper"
             v-show="songs.length>0"
             ref="playButton"
             @click="random"
        >
          <div class="play">
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
          </div>
        </div>
        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="bgLayer"></div>
      <scroll class="list"
              :data="songs"
              :probe-type="probeType"
              :listen-scroll="listenScroll"
              @scroll="scroll"
              ref="list">
        <div class="song-list-wrapper">
          <song-list :songs="songs"
                     @select="selectItem"
          ></song-list>
          <div class="loading-container" v-show="!songs.length">
            <loading></loading>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll' // 引入自定义的scrlll组件
  import SongList from 'base/song-list/song-list' // 引入歌曲列表组件
  import {prefixStyle} from 'common/js/dom' // 引入浏览器能力检测，添加css相应前缀
  import Loading from 'base/loading/loading' // 异步加载动画
  import {mapActions} from 'vuex' // vuex提供的代理actions的语法糖
  import {playlistMixin} from 'common/js/mixin' // 引入playlistMixin：解决当播放器从全屏缩小到mini模式时，底部dom高度不正确的bug

  const RESERVED_HEIGHT = 40 // bg-laye层向上滚动时预留的高度，即滚动不超过标题部分

  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    name: 'music-list',
    mixins: [playlistMixin],
    props: {
      bgImage: { // 列表上部的图片
        type: String,
        default: ''
      },
      songs: { // 歌曲清单
        type: Array,
        default: null
      },
      title: { // 顶部标题
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scrollY: 0 // 通过监听子组件派发过来的Scroll事件动态记录scrollY值，给song-list滚动时做动画用
      }
    },
    created() {
      this.probeType = 3 // 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
      this.listenScroll = true // 监听是否滚动
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})` // 背景是通过background-url显示的，需要通过计算属性来计算
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT // minTranslateY为限制bgLaye滚动时超过图片高度的最小值，RESERVED_HEIGHT为预留标题的高度，在下面watch scrollY时用
      // 加载页面的时候scroll先载入，这时top图片的高度无法获取，需要通过下面的方法来重新计算获取到
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y // 实时记录子组件派发过来的scroll事件
      },
      back() {
        this.$router.back()
      },
      /**
       * 当点击歌曲时，通过vuex的mapActions映射过来的selectPlay方法将点击的歌曲传入vuex，这里是传的当前歌下下的歌曲列表
       * @param item
       * @param index
       */
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs, // 这里不传item是因为把所有歌曲列表传进去，也可以传item，但这时就是传了一首歌
          index
        })
      },
      /**
       * 随机播放歌曲
       */
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      /**
       * mixin方法实现当加载mini播放器的时候，scroll高度计算不准确的bug
       */
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      ...mapActions([
        'selectPlay', // 当点击歌曲时执行
        'randomPlay' // 当点击 随机播放全部 按钮时执行
      ])
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)` // 时实监听scrollY变化来实现bg-layer层跟随song-list列表移动
        // this.$refs.bgLayer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`

        // 这里解决当bg-layer层滚动到标题部分时，song-list里的文字会浮在标题上，这时通过下面方法将图片z-index设置高过文字部分，并重新设置图片高度来实现像是h2遮住song-list的效果
        let zIndex = 0
        if (newY < this.minTranslateY) { // 往上推动song-list到达标题下部时
          zIndex = 2
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playButton.style.display = 'none'
        } else { // 往下拉动song-list到达标题下部时
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playButton.style.display = ''
        }
        // this.$refs.bgImage.style.zIndex = zIndex

        // 这里实现当song-list拉动到图片下方时再继续拉实现图片有种被拉放大的效果
        let scale = 1
        const percent = Math.abs(newY / this.imageHeight) // 滑动的比例
        if (newY > 0) { // 当song-list在图片下面拉动时
          scale = 1 + percent
          zIndex = 1
          this.$refs.bgImage.style[transform] = `scale(${scale})`
          // this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
        }

        // 这里实现当song-list推动到图片上方时图片实现高斯模糊的效果（安卓无效）
        let blur = 0
        if (newY <= 0) {
          blur = Math.min(20 * percent, 20)
          this.$refs.filter.style[backdrop] = `blur(${blur}px)`
          // this.$refs.filter.style['webkitBackgrop-filter'] = `blur(${blur}px)`
        }

        this.$refs.bgImage.style.zIndex = zIndex // 放这里是上面两个效果都要用到
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 2
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-color: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 4
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      /*left: 10px*/
      z-index: 3
      width: 100%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-size
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      /*z-index: 2*/
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 3
        width: 100%
        .play
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background-color: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      /*overflow: hidden*/
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: relative
        /*width: 100%*/
        top: 150px
        transform: translateY(-50%)

</style>
