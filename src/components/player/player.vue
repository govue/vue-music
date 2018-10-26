<!--
* @file play.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-15 10:15:00
* @desc 播放器组件，这是一个全局调用的组件，放在app.vue入口文件里
-->
<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :class="cdClass" class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric-txt">{{playingLyricTxt}}</div>
            </div>
          </div>
          <scroll class="middle-r"
                  ref="lyricList"
                  :data="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   ref="lyricLine"
                   v-for="(line,index) in currentLyric.lines"
                   :key="index"
                   :class="{'current': currentLyricLineNum===index}"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(songPlayingTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(songDurationTime)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" @click="prev" :class="songDisableClass">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlay" :class="songDisableClass">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next" :class="songDisableClass">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon"
                 :class="getFavoriteIcon(currentSong)"
                 @click="toggleFavorite(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdClass" :src="currentSong.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlay">
          <progress-circle :radius="32" :percent="percent">
            <i class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio :src="currentSong.url"
           ref="audio"
           @play="canplay"
           @error="error"
           @timeupdate="timeUpdate"
           @ended="ended"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex' // vues提供的读数据、写数据语法糖
  import Animations from 'create-keyframe-animation' // 引入第三方动画组件库
  import {prefixStyle} from 'common/js/dom' // 引入浏览器能力检测，添加css相应前缀
  import ProgressBar from 'base/progress-bar/progress-bar' // 引入normal播放器底部进度条
  import ProgressCircle from 'base/progress-circle/progress-circle' // 引入mini播放器右下角有圆形进度条
  import {playMode} from 'common/js/config' // 引入播放模式常量
  // import {shuffle} from 'common/js/util' // 引入数组随机打乱函数
  import Lyric from 'lyric-parser' // 引入歌词处理类
  import Scroll from 'base/scroll/scroll' // 自定义的scroll组件
  import Playlist from 'components/playlist/playlist' // 播放列表
  import {playerMixin} from 'common/js/mixin'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
    name: 'player',
    data() {
      return {
        songCanplay: false, // 歌曲能否点击，解决当点击next和prev时异步加载不到歌曲资源用
        songPlayingTime: 0, // 当前播放歌曲的播放用去的时长
        songDurationTime: 0, // 光前播放歌曲的总时间
        currentLyric: null, // 当前播放歌曲的歌词
        currentLyricLineNum: 0, // 当前歌词所在的行
        currentShow: 'cd', // 播放页显示的内容，有cd和lyric，初始为cd
        playingLyricTxt: '' // 当前播放歌词中对应时间的播放歌词项
      }
    },
    created() {
      this.touch = {} // 定义控制cd和lyric左右滑动的touch变量，这里定义是因为该变量不需要setter和getter
    },
    computed: {
      // 监听vuex中playing值有变化时，切换全屏播放器播放的控制图标
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      // 监听vuex中playing值有变化时，切换mini播放器播放的控制图标
      miniIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      // 监听vuex中playing值有变化时，通过cdClass变化的样式值来控制cd旋转动画
      cdClass() {
        return this.playing ? 'play' : 'play pause'
      },
      // 监听this.songCanplay,当canplay为true时class不变化，当canplay为false时添加disable class
      songDisableClass() {
        return this.songCanplay ? '' : 'disable'
      },
      // 计算当前歌曲播放到的百分比，传入progress-bar控制播放进度
      percent() {
        return this.songPlayingTime / this.songDurationTime
      },
      // // 计算播放模式图标
      // iconMode() {
      //   return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      // },
      ...mapGetters([// 通过vuex提供的mapGetter将fullScreen、playlist数据扩展到组件的computed属性中
        'fullScreen',
        // 'sequenceList', // 播放器播放的原始歌曲列表，列表用来做随机等给playlist用
        // 'playlist', // 播放器需要播放的歌曲列表
        'currentIndex', // 当前播放歌曲的index
        'currentSong',
        // 'currentSong', // 当前播放的歌曲
        'playing' // 播放状态
        // 'mode' // 播放状态
      ])
    },
    watch: {
      // watch到currentSong有值变化时就播放
      currentSong(newSong, oldSong) {
        // 如果当前没有歌的时候（比如删除时把歌全部删完了）
        if (!newSong.id) {
          return
        }
        // 当切换到随机模式时，歌曲打乱，但在打乱后的数组中重新找到当前正在播放的歌曲，并重新设置了currentIndex，这时会watch到变化，如果此时是暂停状态，则会触发播放，而播放的歌是另外的歌，这里解决这个bug,即随机前后只要当前播放的歌是同一首（currentSong.id不变）则其它逻辑也不执行
        if (newSong.id === oldSong.id) {
          return
        }
        // 因为currentLyric里面有定时器，当快速切换歌曲的时候如果不清除掉就会造成定时器重替
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        clearTimeout(this.timer) // 解决快速点击切换歌曲时，歌词不同步的bug
        this.timer = setTimeout(() => { // 这里是要等aduio里面有了url值后再播放
          this.$refs.audio.play()
          this.getLyric() // 歌词处理
        }, 1000)
      },
      // watch到playing值有变化时，比如播放暂停
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause() // 为真为播放，为假时暂停
        })
      }
    },
    mixins: [
      playerMixin
    ],
    methods: {
      /**
       * 点击左上返回时，设置vuex中的fullScreen为False,将全屏显示播放器缩小
       */
      back() {
        this.setFullScreen(false)
      },
      /**
       *点击底部的mini播放器时，设置vuex中的fullScreen为False,全屏显示播放器
       */
       open() {
        this.setFullScreen(true)
      },
      /**
       * 播放、暂停切换
       */
      togglePlay() {
        // 解决快速点击时audio加载不到歌曲资源报错
        if (!this.songCanplay) {
          return
        }
        this.setPlayingState(!this.playing) // 播放、暂停切换，这里设置了vuex中的playing值后，在wathc里面还要watch playing值的变化来实现播放器控制
        if (this.currentLyric) {
          this.currentLyric.togglePlay() // 歌词也播放、暂停切换
        }
      },
      /**
       * 下一曲
       */
      next() {
        // 解决快速点击时audio加载不到歌曲资源报错
        if (!this.songCanplay) {
          return
        }
        if (this.playlist.length === 1) { // 如果只有一首歌就单曲循环播放
          this.loop()
          return // 防止next按钮还可以点击
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          // 如果点下一曲的时候，播放状态为暂停，则将歌曲置为播放状态
          if (!this.playing) {
            this.togglePlay()
          }
        }
        this.songCanplay = false // 当播放一首歌开始时同时将songCanplay置为false，等歌曲播放时的canplay事件将songCanplay置为true
      },
      /**
       * 上一曲
       */
      prev() {
        // 解决快速点击时audio加载不到歌曲资源报错
        if (!this.songCanplay) {
          return
        }
        if (this.playlist.length === 1) { // 如果只有一首歌就单曲循环播放
          this.loop()
          return // 防止next按钮还可以点击
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          // 如果点上一曲的时候，播放状态为暂停，则将歌曲置为播放状态
          if (!this.playing) {
            this.togglePlay()
          }
        }
        this.songCanplay = false // 当播放一首歌开始时同时将songCanplay置为false，等歌曲播放时的canplay事件将songCanplay置为true
      },
      // /**
      //  * 切换播放模式
      //  */
      // changeMode() {
      //   const mode = (this.mode + 1) % 3
      //   this.setPlayMode(mode) // 修改vuex里面mode的值
      //   let list = null
      //   if (mode === playMode.random) {
      //     list = shuffle(this.sequenceList) // 根据vuex中顺序的歌曲列表来生成一个随机列表
      //     this.resetCurrentIndex(list) // 在打乱后的数组中打开当前播放的歌曲所在的位置
      //   } else {
      //     list = this.sequenceList
      //   }
      //   this.setPlaylist(list)
      // },
      // /**
      //  * 当随机打乱播放列表后，当前播放的歌曲index对应到随机打乱后的list时就不是当前正在播放的歌曲，这里在打乱后的数组中去找到当前播放歌曲所在的位置
      //  */
      // resetCurrentIndex(list) {
      //   let index = list.findIndex((item) => {
      //     return item.id === this.currentSong.id
      //   })
      //   this.setCurrentIndex(index) // 将当前播放歌的索引重新设置成打乱后list中对应的索引
      // },
      /**
       * audio派发过来的canplay事件执行方法，即歌曲资源加载好了，可以进行播放了
       */
      canplay() {
        this.songCanplay = true
        this.savePlayHistory(this.currentSong) // 写入播放历史记录
      },
      /**
       * audio派发过来的error事件执行方法，这里解决当songCanplay在false时，网络或其它原因造成audio报错而无法将songCangplay置为true，这里next\prev按键就失效的问题
       */
      error() {
        this.songCanplay = true
      },
      /**
       * audio派发过来的timeupdate事件执行方法，即获取到歌曲播放的时间
       */
      timeUpdate(e) {
        this.songPlayingTime = e.target.currentTime // 获取当前播放到的时间点，e.target.currentTime是一个时间戳，也是一个可读写的属性，可以通过修改来控制播放的进度
        this.songDurationTime = e.target.duration // 获取当前播放歌曲的总时间，也可以在div中用{{currentSong.duration}}来获取得到
      },
      /**
       *audio派发过来的ended事件执行方法
       */
      ended() {
        // 如果是单曲循环播放
        if (this.mode === playMode.loop) {
          this.loop()
        } else { // 如果是其它播放模式，则按playlist列表中的顺序播放
          this.next()
        }
      },
      /**
       * 单曲循环播放
       */
      loop() {
        this.$refs.audio.currentTiem = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0) // 单曲循环完成时又将歌词从头开始
        }
      },
      /**
       * 将api获取到歌词转成需要的格式
       */
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          // 防止快速点击时歌词多次获取的bug
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          // 如果歌曲是播放状态，则歌词也开始同步播放
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => { // 如果获取不到歌词，则进行清理操作
          this.currentLyric = null
          this.playingLyricTxt = ''
          this.currentLyricLineNum = 0
        })
      },
      /**
       * Lyric类回调函数
       */
      handleLyric({lineNum, txt}) {
        this.currentLyricLineNum = lineNum // 得到当前播放的歌词所在行
        if (lineNum > 5) { // 如果当前歌词行大于5行
          let lineElement = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineElement, 1000)
        } else { // 如果小于5行，就在顶部
          this.$refs.lyricList.scrollToElement(0, 0, 1000)
        }
        this.playingLyricTxt = txt
      },
      /**
       * timeUpdate得到的时候是时间戳，这里进行格式化处理
       */
      formatTime(interval) {
        interval = interval | 0 // | 或0 为向下取整
        const minute = interval / 60 | 0
        const second = interval % 60
        return `${minute}:${second}`
      },
      /**
       * 根据progress-bar派发过来的percentChange事件来控制歌曲到指定位置播放
       */
      onProgressBarChange(percent) {
        const currentTime = this.songDurationTime * percent
        this.$refs.audio.currentTime = currentTime
        // 如果拖动后，播放状态为暂停，则将歌曲置为播放状态
        if (!this.playing) {
          this.togglePlay()
        }
        // 控制歌词跳转
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      /**
       * 显示播放列表
       */
      showPlaylist() {
        this.$refs.playlist.show()
      },
      /**
       * 显示播放列表
       */
      hidePlaylist() {
        this.$refs.playlist.hide()
      },
      /**
       * mapMutations将需要操作的数据做映射，即将mutations里的操作映射成用户当前组件自定义的方法
       */
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
        // setPlayingState: 'SET_PLAYING_STATE',
        // setCurrentIndex: 'SET_CURRENT_INDEX',
        // setPlayMode: 'SET_PLAY_MODE',
        // setPlaylist: 'SET_PLAYLIST'
      }),
      ...mapActions([
        'savePlayHistory'
      ]),
      // ---------动画开始：下面为fullScreen展开时的动画，从miniPlayer左下角的小图片飞出放大到展开的“光盘”处
      enter(el, done) { // done为下一个执行的函数
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        // 注册动画
        Animations.registerAnimation({
          name: 'move',
          animation,
          presets: { // 预设
            duration: 400, // 动画时间
            easing: 'linear' // 动画轨迹方式
          }
        })

        // 执行动画
        Animations.runAnimation(this.$refs.cdWrapper, 'move', done) // 这里的done为afterEnter()函数
      },
      afterEnter() {
        // 释放资源
        Animations.unregisterAnimation('move')
        // 将dom中的animation属性清空
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done) // 这里是要等动画完成再去执行afterLeave()
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        const targetWidth = 40 // miniPlayer左下角小图片的大小
        const paddingLeft = 40 // miniPlayer左下角小图片padding-left
        const paddingBottom = 30 // miniPlayer左下角小图片padding-bottom
        const paddingTop = 80 // “光盘”离屏幕顶部的距离，通过绝对定位
        const width = window.innerWidth * 0.8 // “光盘”的大小：屏幕尺寸的80%
        const scale = targetWidth / width // 初始的缩放的比例
        const x = -(window.innerWidth / 2 - paddingLeft - targetWidth / 2) // 初始的x坐标（初始坐标为miniPlayer左下角小图片的中心），为-是因为以“光盘”不原坐标，所以x为负
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom - targetWidth / 2 // 初始的y坐标(初始坐标为miniPlayer左下角小图片的中心)
        return {
          x, y, scale
        }
      },
      // ---------动画结束
      // ---------middleTouch开始
      middleTouchStart(e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        // 如果是纵向滑动则不处理
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth) // 滑动的比例
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)` // 因为lyricList是vue组件，这里只能是$el来获取
        this.$refs.lyricList.$el.style[transitionDuration] = 0 // 将middleTouchEnd中设置的值重新设为0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent // 设置cd背景透明度
        this.$refs.middleL.style[transitionDuration] = 0 // 将middleTouchEnd中设置的值重新设为0
      },
      middleTouchEnd() {
        /* eslint-disable */
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)` // 因为lyricList是vue组件，这里只能是$el来获取
        let time = 300
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity // 设置cd背景透明度
        this.$refs.middleL.style[transitionDuration] = `${time}ms` // 动画时间
      }
      // ---------middleTouch结束
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              .image
                position: absolute
                left: 11
                top: 11
                width: 94%
                height: 94%
                border-radius: 50%
                &.play
                  animation: rotate 20s linear infinite
                &.pause
                  animation-play-state: paused

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric-txt
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.5s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 24px
          position: absolute
          left: 4px
          top: 4px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform rotate(360deg)
</style>
