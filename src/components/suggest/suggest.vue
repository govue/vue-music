<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search' // 获取搜索内容api
  import {ERR_OK} from 'api/config'
  import {filterSinger} from 'common/js/class/Song'

  const TYPE_SINGER = 'singer'

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
          result: [] // 存放搜索结果数组
        }
    },
    computed: {},
    watch: {
      query() {
        this.search()
      }
    },
    components: {},
    mixins: [],
    methods: {
      /**
       * 请求服务端搜索数据
       */
      search() {
        search(this.query, this.page, this.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
          }
        })
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
          ret = ret.concat(data.song.list)
        }
        return ret
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
          return `${item.songname}-${filterSinger(item.singer)}`
        }
      }
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
