<!--
* @file progress-circle.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-16 20:00:00
* @desc mini播放器右下部的进度条组件，通过传入100%数值来控制，还可以通过传入radius值来控制大小
-->
<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="strokeDasharray" :stroke-dashoffset="percentstrokeDashoffset" />
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'progress-circle',
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        strokeDasharray: Math.PI * 100
      }
    },
    computed: {
      percentstrokeDashoffset() {
        return this.strokeDasharray * (1 - this.percent)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
