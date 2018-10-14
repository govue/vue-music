<!--
* @file song-list.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-13 23:21:00
* @desc 歌曲列表组件(只显示歌曲，作为子组件给music-list调用)
-->
<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song,index) in songs" :key="index">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'song-list',
    props: {
      songs: {
        type: Array,
        default: null
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer} . ${song.album}`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          colro: $color-text-d
</style>
