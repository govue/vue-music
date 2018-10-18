<!--
* @file listview.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-12 08:15:00
* @desc listview组件
-->
<template>
  <scroll class="listview"
          :data="data"
          :listenScroll="listenScroll"
          :probeType="probeType"
          v-if="data.length"
          ref="listview"
          @scroll="scroll"> <!-- 这里监听子组件派发过来的scroll事件,接收到派发过来的事件后再去执行本组件的scroll函数 -->
    <ul>
      <li class="list-group" v-for="(group,index) in data" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item"
              v-for="(item,index) in group.items"
              :key="index"
              @click="selectItem(item)"
          >
            <img class="avatar" v-lazy="item.pic" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item"
            v-for="(item, index) in shortcutList"
            :key="index"
            :data-index="index"
            :class="{'current':currentIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed"
         v-if="fixedTitle"
         ref="listfixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-if="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading' // 数据载入动画
  import {getData} from 'common/js/dom.js'

  const ANCHOR_HEIGHT = 20 // 右则shortcur中元素的高度，通过样式计算出来，touch时根据此数据来计算touch到的终点位置
  const TITLE_HEIGHT = 30 // 给wathc this.diff时用

  export default {
      name: 'listview',
      data() {
        return {
          scrollY: -1, // 监听派发来的Scroll事件时需要维护scrollY数据,在watch里监听，在_scrollTo通过传入index修改相应值，从而联运currentIndex
          currentIndex: 0, // 当前shortcut高亮显示的index
          diff: -1 // 用来实现fixed-title动画效果用
        }
      },
      props: {
        data: { // data为调用组件时传入进来的数据
          type: Array,
          default: null
        }
      },
      created() {
        this.touch = [] // 存放touch时的数据，在data()与props里的数据vue会自动添加getter与setter并监听数据变化，放created里则不会
        this.listenScroll = true // 是否监听scroll组件滚动事件
        this.listGroupHeight = [] // 存放listGroup高度的数组
        this.probeType = 3 // 监听模式
      },
      computed: {
        /**
         * @computed shortcutList
         * @returns {Object}
         * @desc 返回右则点击的shortcutList列表
         */
        shortcutList() {
          return this.data.map((group) => {
            return group.title.substr(0, 1)
          })
        },
        /**
         * @computed fixedTitle
         * @returns {Strieng}
         * @desc 根据currentIndex获取fixedTitle
         */
        fixedTitle() {
          return this.data[this.currentIndex].title ? this.data[this.currentIndex].title : ''
        }
      },
      methods: {
        /**
         * @method onShortcutTouchStart
         * @returns {}
         * @desc shortcut点击时执行方法,让listview跳转到相应的元素
         */
        onShortcutTouchStart(event) {
          let anchorIndex = getData(event.target, 'index') // 获取到shortcut点击时的data-index数据，即index
          let firstTouch = event.touches[0] // 获取到touches时的数据，touches[0]为第一个touch时的数据
          this.touch.y1 = firstTouch.pageY // 将touches[0]的pageY数据传给this.touch.y1，给onShortcutTouchMove()用
          this.touch.anchorIndex = anchorIndex // 记录点击时的锚点anchorIndex
          this._scrollTo(anchorIndex) // 跳转
        },
        /**
         * @method onShortcutTouchMove
         * @returns {}
         * @desc shortcut滑动move时执行方法,让listview跳转到相应的元素,根据move时起始位置和结束位置的差来计算跳转的index
         */
        onShortcutTouchMove(event) {
          let firstTouch = event.touches[0] // 获取到touches时的数据，touches[0]为第一个touch时的数据，此时数据为touch时停止位置的数据
          this.touch.y2 = firstTouch.pageY
          let deviation = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 计算偏移数据，（或0与Math.floor是一样的效果）
          let anchorIndex = parseInt(this.touch.anchorIndex) + deviation
          this._scrollTo(anchorIndex) // 跳转
        },
        /**
         * @method scroll
         * @returns {}
         * @desc scroll组件$emit派发来的scroll事件处理
         */
        scroll(pos) {
          this.scrollY = pos.y
        },
        /**
         * @method selectItem
         * @returns {}
         * @desc 派发一个select事件给父元素
         */
        selectItem(item) {
          this.$emit('select', item)
        },
        /**
         * @method scrollTo
         * @returns {}
         * @desc 跳转到指定的index位置
         */
        _scrollTo(index) {
          // 这里解决点击sortcurList数字两端空白区域时currentIndex为null的bug
          if (!index && index !== 0) {
            return
          }
          // 这里解决move滑动到sortcurList两端时，currentIndex不在高亮显示需要的index时的bug
          if (index < 0) {
            index = 0
          } else if (index > this.listGroupHeight.length - 2) {
            index = this.listGroupHeight.length - 2
          }
          this.scrollY = -this.listGroupHeight[index]
          this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // 跳转(这里能直接调用scroll组件里的scrollToElement方法是因为scroll组件里有apply())
        },
        /**
         * @method calculateHeight
         * @returns {}
         * @desc 计算listview中listGroup元素dom高度
         */
        _calculateHeight() {
          this.listGroupHeight = [] // 将this.listGroupHeight置为空
          const listElement = this.$refs.listGroup
          let tempHeight = 0
          this.listGroupHeight.push(tempHeight) // push进第一个数据
          for (let i = 0; i < listElement.length; i++) {
            let item = listElement[i]
            tempHeight += item.clientHeight
            this.listGroupHeight.push(tempHeight)
          }
        },
        /**
         * scroll refresh方法，重新计算dom,singer组件里mixinPlaylist方法用
         */
        refresh() {
          // 如果这里不延时执行，就会报refresh方法找不到
          setTimeout(() => {
            this.$refs.listview.refresh()
          }, 100)
        }
      },
      watch: {
        // 监听传入进来data数据的变化
        data() {
          setTimeout(() => {
            this._calculateHeight() // 计算dom高度
          }, 20) // 20毫秒为浏览器dom加载完后的时间18毫秒+2
        },
        // 监听scrollY，计算出当前currentIndex
        scrollY(newY) {
          const listGroupHeight = this.listGroupHeight
          // 当newY滚动到最顶部上面
          if (newY > 0) {
            this.currentIndex = 0
            return
          }
          // 当newY在中间部分滚动
          for (let i = 0; i < listGroupHeight.length - 1; i++) { // length-1保证了newY计算是在两个元素中间
            let height1 = listGroupHeight[i]
            let height2 = listGroupHeight[i + 1]
            if (!height2 || (-newY >= height1 && -newY < height2)) { // !height为如果是最后一个元素之后
              this.currentIndex = i
              this.diff = height2 + newY // 获取diff，给实现fixed-title动画用
              return
            }
            // 当滚到最底部，且-newY大于最后一个元素的上限
            this.currentIndex = listGroupHeight - 2 // -2是因为listGroupHeight.length比实际元素是要大1
          }
        },
        // 监听this.diff变化，实现fixed-title动画
        diff(newVal) {
          let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
          if (this.fixedTop === fixedTop) { // 如果没有移动到一起的时候不需要动画，直接return
            return
          }
          this.fixedTop = fixedTop
          this.$refs.listfixed.style.transform = `translate3d(0,${fixedTop}px,0`
        }
      },
      components: {
        Scroll,
        Loading
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background-color: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background-color: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 1
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background-color: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-medium
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background-color: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
