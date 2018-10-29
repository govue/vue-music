<template>
    <transition name="slide">
      <music-list :title="title"
                  :bg-image="bgImage"
                  :songs="songs"
      ></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list' // 音乐列表组件
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend' // 根据dissid获取对应歌曲api
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/class/Song' // 引入创建歌曲的工厂方法

  export default {
    name: 'diss',
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.diss.dissname
      },
      bgImage() {
        return this.diss.imgurl
      },
      ...mapGetters([
        'diss'
      ])
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.diss.dissid) { // 如果在diss.vue页刷新时，是获取不到歌曲列表数据的，
          this.$router.push('/recommend') // 则返回到歌单列表
          return
        }
        getSongList(this.diss.dissid).then((res) => {
          // console.log(res)
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
