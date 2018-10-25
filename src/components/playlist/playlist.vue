<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"
               :class="iconMode"
               @click="changeMode"
            ></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content"
                :data="sequenceList"
                ref="listContent"
        >
          <transition-group name="list" tag="ul">
            <li class="item"
                v-for="(item,index) in sequenceList"
                :key="item.id"
                @click="selectItem(item,index)"
                ref="listItem"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm text="是否清空播放列表"
               confirmBtnText="清空"
               @confirm="confirmClear"
               ref="confirm"
      ></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import {playMode} from 'common/js/config'
  import Confirm from 'base/confirm/confirm'
  import AddSong from 'components/add-song/add-song'
  import {playerMixin} from 'common/js/mixin'

  export default {
    name: 'playlist',
    data() {
      return {
        showFlag: false
      }
    },
    props: {},
    computed: {
      // ...mapGetters([
      //   'sequenceList',
      //   'currentSong',
      //   'playlist',
      //   'mode'
      // ])
      /**
       * 播放模式字符串显示
       */
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        // 如果showFlag为false时或，点击同一首歌时
        if (!this.showFlag || newSong.id === oldSong) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    },
    mixins: [
      playerMixin
    ],
    methods: {
      show() {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh() // 当playlist从无到有显示时，scroll组件是计算不出高度的，这里通过延时来刷新重新计算
          this.scrollToCurrent(this.currentSong) // 将当前播放的歌曲滚动到playlist顶部
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
      /**
       * 将当前播放歌曲前面显示图标
       */
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        } else {
          return ''
        }
      },
      /**
       * 点击playlist中的歌曲时播放歌曲
       */
      selectItem(item, index) {
        if (this.mode === playMode.random) {
          index = this.playlist.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true) // 如果暂停时点playlist中的歌，这时播放状态还是暂停，但歌却在播放，这里调用setPlayingState解决这个问题
      },
      /**
       * 在playlist窗口，将当前播放的歌曲滚动到第一条位置，在watch里面监听currentSong切换成功时调用，和在showFlag为true时调用
       */
      scrollToCurrent(currentSong) {
        const index = this.sequenceList.findIndex((song) => {
          return currentSong.id === song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 200)
      },
      /**
       * 删除playlist里面的一首歌
       */
      deleteOne(item) {
        this.deleteSong(item)
        // 修复当删除最后一首歌时，再点击一首歌，playlist会跟着播放器同时显示的bug
        if (!this.playlist.length) {
          this.hide()
        }
      },
      /**
       * 显示confirm对话框
       */
      showConfirm() {
        this.$refs.confirm.show()
      },
      /**
       * 点击确认框删除playlist
       */
      confirmClear() {
        this.deleteSongList()
        this.hide()
      },
      /**
       * 显示添加歌曲到列表组件
       */
      addSong() {
        this.$refs.addSong.show()
      },
      // ...mapMutations({
      //   'setCurrentIndex': 'SET_CURRENT_INDEX',
      //   'setPlayingState': 'SET_PLAYING_STATE'
      // }),
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
