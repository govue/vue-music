<!--
* @file progress-bar.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-16 15:25:00
* @desc normal播放器底部的进度条组件，通过传入100%数值来控制
-->
<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper"
             ref="progressBtn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend="progressTouchEnd"
        >
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom' // 引入浏览器能力检测，添加css相应前缀

  const progressBtnWidth = 16 // 进度条拖动按钮宽度
  const transform = prefixStyle('transform')

  export default {
    name: 'progress-bar',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {} // 用在progressTouchStart、progressTouchMove、progressTouchEnd三个回调函数上共享数据的对象
    },
    watch: {
      percent(newPercent) {
        if (newPercent > 0 && !this.touch.initiated) { //  !this.touch.initiated解决当歌在播放时，拖动的时候会歌会跳来跳去播放的bug,因为touch事件的优先级高
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条总宽度
          const offsetWidth = barWidth * newPercent // 偏移的宽度
          this._offset(offsetWidth)
        }
      }
    },
    methods: {
      /**
       * 进度条拖动开始
       */
      progressTouchStart(e) {
        this.touch.initiated = true // 开始touch
        this.touch.startX = e.touches[0].pageX // touch时第一个手指的x坐标值
        this.touch.left = this.$refs.progress.clientWidth // touch的偏移值，即进度条的宽度
      },
      /**
       * 进度条拖动中
       */
      progressTouchMove(e) {
        // 如果没有经过touchStart，直接进入touchMove就return
        if (!this.touch.initiated) {
          return
        }
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条总宽度
        const deltaX = e.touches[0].pageX - this.touch.startX // 偏移量
        const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX)) // 偏移宽度，不能小于0，也不能大于进度条总宽度
        this._offset(offsetWidth)
      },
      /**
       * 进度条拖动结束
       */
      progressTouchEnd(e) {
        this.touch.initiated = false // 结束touch
        this._triggerPercent() // 派发一个事件，控制歌曲跳转到拖动的地方
      },
      /**
       * 点击进度条时
       * @param e
       */
      progressClick(e) {
        console.log('e')
        const offsetWidth = e.offsetX
        this._offset(offsetWidth) // 控制进度条跳转
        this._triggerPercent()// 派发一个事件，控制歌曲跳转到拖动的地方
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条总宽度
        const progressWidth = this.$refs.progress.clientWidth // 拉动的进度条的宽度
        const percent = progressWidth / barWidth
        this.$emit('percentChange', percent) // 派发拖动的事件，并把拖动的比例一并派发出去
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px` // 将偏移的宽度应用到dom上
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background-color: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background-color: $color-theme
</style>
