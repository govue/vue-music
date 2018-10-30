<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
    <transition name="fade">
      <div class="splash-wrapper">
        <splash></splash>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player' // 引入播放器组件
  import Splash from 'base/splash/splash' // 引入splash启动欢迎页

  export default {
    name: 'App',
    components: {
      MHeader,
      Tab,
      Player,
      Splash
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  #app
    color: $color-theme
    .splash-wrapper
      position: relative
      top: -87px
      left: 0
</style>
