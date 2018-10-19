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
      <li class="item"
          v-for="(song,index) in songs"
          :key="index"
          @click="selectItem(song,index)"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankClass(index)">{{getRankText(index)}}</span>
        </div>
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
      },
      // 是否显示排行图标
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /**
       * @function 拼接desc字符
       * @param song
       * @returns {string}
       */
      getDesc(song) {
        return `${song.singer} . ${song.album}`
      },
      /**
       * 当点击歌曲的时候，向父组件派发一个select事件，并将歌曲和index传出去
       * @param item
       * @param index
       */
      selectItem(item, index) {
        this.$emit('select', item, index)
      },
      getRankClass(index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return `text`
        }
      },
      getRankText(index) {
        return (index > 2) ? index : ''
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
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
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
