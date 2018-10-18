<!--
* @file siger-detail.vue
* @author qubo
* @copyright govue.cn
* @createDate 2018-10-13 10:41:00
* @desc 歌手详情页组件
-->
<template>
  <transition name="slide">
    <music-list :title="title"
                :bg-image="bgImage"
                :songs="songs"
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex' // vuex提供的读数据语法糖
  import {getSingerDetail} from 'api/singer' // 获取singerDetail数据
  import {ERR_OK} from 'api/config'
  import {createSong} from '../../common/js/class/Song' // 引入创建歌曲的工厂方法
  import MusicList from 'components/music-list/music-list' // 歌曲列表组件

  export default {
    name: 'singer-detail',
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() { // 通过vuex获取到的singer获致到title，再传入music-list组件
        return this.singer.name
      },
      bgImage() { // 通过vuex获取到的背景图片bg-image获致到title，再传入music-list组件
        return this.singer.pic
      },
      ...mapGetters([ // 通过vuex提供的mapGetter将singer数据扩展到组件的computed属性中
        'singer'
      ])
    },
    created() {
      this._getSongList()
    },
    methods: {
      /**
       * @method _getSongList
       * @returns {json} jsonp歌手对应歌曲列表
       * @desc 获取歌手对应歌曲列表
       */
      _getSongList() {
        if (!this.singer.id) { // 如果在singerDetail页刷新时，是获取不到歌曲列表数据的，
          this.$router.push('/singer') // 则返回到歌手列表
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list) // 得到每一个歌手对应的歌曲列表
          }
        })
      },
      /**
       * @function对传过来的list进行重新按规则处理
       * @param list
       * @returns {Array}
       * @private
       */
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item // 因为item传过来里面有很多数据，其中musicData是item里面一项，这里 {musicData} 赋值是自动匹配item里面的musicData项数据
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 2
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
</style>
