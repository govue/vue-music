<template>
    <div class="search">
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut-wrapper" v-show="!query">
        <div class="shortcut">
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
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query"
                 @listScroll="blurInput"
                 @select="saveSearchHistory(query)"
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
  import {mapActions, mapGetters} from 'vuex'

  export default {
    name: 'search',
    props: {},
    data() {
      return {
        hotKey: [],
        query: '' // 搜索的字符串
      }
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    watch: {},
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm
    },
    mixins: [],
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
      /**
       * 点击hotKey标签时
       * @param query
       */
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      /**
       * 删除搜索历史(一条)
       */
      deleteQuery(query) {
        this.deleteSearchHistory(query)
      },
      deleteAll() {
        this.clearSearchHistory()
      },
      /**
       * 当搜索组件search-box中的query值有变化时，从子组件派发query事件，这里监听到执行，并将变化后的query值传给suggest组件中去查询，结果显示在suggest组件中
       * @param query
       */
      onQueryChange(query) {
        this.query = query
      },
      /**
       * 监听到有scroll滚动事件，则收起输入法键盘（移动端）
       */
      blurInput() {
        this.$refs.searchBox.blur()
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      /**
       * 监听select事件，保存搜索历史
       */
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
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
