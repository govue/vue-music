<template>
    <div class="search">
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut-wrapper"
           v-show="!query"
           ref="shortcutWrapper"
      >
        <Scroll class="shortcut"
                :data="shortcut"
                :refreshDelay="refreshDelay"
                ref="shortcut">
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li class="item"
                    v-for="(item,index) in hotKey"
                    :key="index"
                    @click="addQuery(item.k)"
                >
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
            <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory"
                         @select="addQuery"
                         @delete="deleteSearchHistory"
            ></search-list>
          </div>
          </div>
        </Scroll>
      </div>
      <div class="search-result"
           v-show="query"
           ref="searchResult"
      >
        <suggest :query="query"
                 @listScroll="blurInput"
                 @select="saveSearch(query)"
                 ref="suggest"
        ></suggest>
      </div>
      <confirm ref="confirm"
               text="是否清空搜索历史"
               confirmBtnText="清空"
               @confirm="clearSearchHistory()"
      ></confirm>
      <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box' // 搜索框
  import {getHotKey} from 'api/search' // 获取 搜索热点数据
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest' // 提示，即搜索时从api获取提示的搜索列表
  import SearchList from 'base/search-list/search-list' // 搜索历史列表
  import Confirm from 'base/confirm/confirm' // 弹窗
  import Scroll from 'base/scroll/scroll' // Scroll滚动组件
  import {playlistMixin, searchMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'

  export default {
    name: 'search',
    props: {},
    data() {
      return {
        hotKey: []
        // query: '' // 搜索的字符串
      }
    },
    computed: {
      /**
       * 传给Scroll组件计算整个dom列表（热门搜索和搜索历史）的高度
       */
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
      // ...mapGetters([
      //   'searchHistory'
      // ])
    },
    watch: {
      /**
       * 解决：在搜索页输入搜索内容搜索后，再切换到搜索页，因为搜索页dom切换造成切换后无法重新计算，scroll获取不到高度无法重新滚动
       */
      query(newQuery) {
        if (!newQuery) { // 如果检测到从有内容到无内容的变化时
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
    mixins: [
      playlistMixin,
      searchMixin
    ],
    methods: {
      /**
       * 从api获取hotKey数据
       */
      getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      // /**
      //  * 点击hotKey标签时
      //  * @param query
      //  */
      // addQuery(query) {
      //   this.$refs.searchBox.setQuery(query)
      // },
      /**
       * 删除搜索历史(一条)
       */
      deleteQuery(query) {
        this.deleteSearchHistory(query)
      },
      deleteAll() {
        this.clearSearchHistory()
      },
      // /**
      //  * 当搜索组件search-box中的query值有变化时，从子组件派发query事件，这里监听到执行，并将变化后的query值传给suggest组件中去查询，结果显示在suggest组件中
      //  * @param query
      //  */
      // onQueryChange(query) {
      //   this.query = query
      // },
      // /**
      //  * 监听到有scroll滚动事件，则收起输入法键盘（移动端）
      //  */
      // blurInput() {
      //   this.$refs.searchBox.blur()
      // },
      showConfirm() {
        this.$refs.confirm.show()
      },
      // /**
      //  * 监听select事件，保存搜索历史
      //  */
      // saveSearch() {
      //   this.saveSearchHistory(this.query)
      // },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      ...mapActions([
        // 'saveSearchHistory',
        // 'deleteSearchHistory',
        'clearSearchHistory'
      ])
    },
    created() {
      this.getHotKey()
    },
    mounted() {
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background-color: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
