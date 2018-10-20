<template>
  <scroll class="suggest"
          :data="result"
          :pullUp="pullUp"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item"
          v-for="(item,index) in result"
          :key="index"
          @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper">
      <no-result title='没有搜索内容' v-show="!hasMore && !result.length"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search' // 获取搜索内容api
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/class/Singer'
  import {createSong} from 'common/js/class/Song' // 引入歌曲类来对搜索到的歌曲进行处理
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import {mapMutations, mapActions} from 'vuex'

  const TYPE_SINGER = 'singer'
  const perpage = 20 // 每次搜索数据的条数

  export default {
    name: 'suggest',
    props: {
      query: { // 搜索的关键词
        type: String,
        default: ''
      },
      showSinger: { // 控制从api获取数据时是否搜索歌手数据，对应aip中的zhida
        type: Boolean,
        default: true
      }
    },
    data() {
        return {
          page: 1, // 搜索结果的页码
          result: [], // 存放搜索结果数组
          pullUp: true, // 需要动态下拉加载数据
          beforeScroll: true, // 需要监听scroll滚动前事件
          hasMore: true // 下拉时判断是否加载完数据的标志位,为true时可以继续searchMore数据，为false时则不再执行searchMore
        }
    },
    computed: {},
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    },
    mixins: [],
    methods: {
      /**
       * 请求服务端搜索数据
       */
      search() {
        // 第一次执行search时重置hasMore,page,scroll（scroll到底部起始值）
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data) // 检查是否还有数据未加载完
          }
        })
      },
      /**
       * 下拉动态获取更多数据
       */
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data) // 检查是否还有数据未加载完
          }
        })
      },
      /**
       * 检查是否还有数据未加载完
       */
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      /**
       * 对search从api获取的数据进行处理:如果有歌手数据则放在ret[0]，里面有type='singer'，如果是歌曲则放在数组下标1开始的位置，type=0
       * @param data
       * @returns {Array}
       * @private
       */
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSong(data.song.list))
        }
        return ret
      },
      _normalizeSong(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      /**
       * 当点击搜索结果列表项的时候，根据歌手和歌曲进行路由跳转处理
       */
      selectItem(item) {
        if (item.type === TYPE_SINGER) { // 如果是歌手
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else { // 如果是歌曲
          this.insertSong(item)
        }
      },
      /**
       * 当监听到beforeScroll事件时，派发listScroll事件
       */
      listScroll() {
        this.$emit('listScroll')
      },
      /**
       * 获取搜索列表项对应的图标，有歌手和歌曲两种
       * @param item
       */
      getIconClass(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name} - ${item.singer}`
        }
      },
      ...mapMutations({
        'setSinger': 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    created() {
    },
    mounted() {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
      .no-result-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
