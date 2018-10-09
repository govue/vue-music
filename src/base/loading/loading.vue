/**
* @file loading.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-09 20:00:00
* @desc 加载动画loading组件
*/

<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'loading',
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
