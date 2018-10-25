<template>
  <ul class="tabs">
    <li class="tab-item"
        v-for="(item,index) in tabs"
        :key="index"
        :class="{'active':currentIndex===index}"
        @click="switchTab(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'tabs',
    props: {
      tabs: {
        type: Array,
        default: null
      },
      currentIndex: {
        type: Number,
        default: 0
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
      switchTab(index) {
        this.$emit('switch', index)
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

  .tabs
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .tab-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>
