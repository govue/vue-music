<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box"
           :placeholder="placeholder"
           v-model="query"
           ref="queryInput"
    >
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from '../../common/js/util'

  export default {
    name: 'search-box',
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    computed: {},
    watch: {},
    components: {
    },
    mixins: [],
    methods: {
      /**
       * 清空input搜索框内容
       */
      clear() {
        this.query = ''
      },
      /**
       * 设置查询的query
       * @param query
       */
      setQuery(query) {
        this.query = query
      },
      /**
       * 收起输入法（移动端），根据派发的beforeScroll事件来执行
       */
      blur() {
        this.$refs.queryInput.blur()
      }
    },
    created() {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 500))
    },
    mounted() {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background-color: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background-color: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
      .icon-dismiss
        font-size: 16px
        color: $color-background
</style>
