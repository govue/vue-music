<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li class="search-item"
          v-for="(item,index) in searches"
          :key="index"
          @click="selectItem(item)"
      >
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'search-list',
        props: {
          searches: {
            type: Array,
            default: null
          }
        },
        data() {
            return {}
        },
        computed: {},
        watch: {},
        components: {},
        mixins: [],
        methods: {
          selectItem(item) {
            this.$emit('select', item) // 派发select选择事件
          },
          deleteOne(item) {
            this.$emit('delete', item) // 派发delete删除事件
          }
        },
        created() {
        },
        mounted() {
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
