<template>
  <div>
    <img src="">
  </div>
</template>

<script>

</script>

<style lang="stylus" rel="stylesheet/stylus">
  #splash
    position fixed
    top 0
    left 0
    z-index 6
    width 100%
    height 100%
    opacity 1
    transition opacity .3s ease
    box-sizing border-box
    &.fade-enter,&.fade-leave-to
      opacity 0;
</style>

<template>
  <div>
    <transition name="fade">
      <v-splash v-show="splash"></v-splash>
    </transition>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<!--之后在一定时间后将splash变成false就可以让splash组件隐藏，使内容显示出来-->
