<template>
    <div class="scroll" ref="wrapper">
      <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'

    export default {
        name: 'scroll',
        props: {
          probeType: { // 1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
            type: Number,
            default: 1
          },
          click: { // 是否允许点击，属性里面用
            type: Boolean,
            default: true
          },
          listenScroll: { // 是否监听scroll滚动事件
            type: Boolean,
            default: false
          },
          pullUp: { // 是否上拉加载数据，默认不开启
            type: Boolean,
            default: false
          },
          beforeScroll: { // 是否在滚动前派发一个beforeScroll事件
            type: Boolean,
            default: false
          },
          refreshDelay: { // refresh刷新时间
            type: Number,
            default: 20
          },
          data: { // 传入的业务数据
            type: Array,
            default: null
          }
        },
        mounted() {
          setTimeout(() => {
            this._initScroll()
          }, 20)
        },
        watch: {
          data() {
            setTimeout(() => {
              this.refresh() // 如果data数据有变化则重新刷新dom,因为数据是异步的，初始化bscroll的时候数据还未获取到，通过监听传入的相应数据来刷新dom获取新的高度
            }, this.refreshDelay)
          }
        },
        methods: {
          /**
           * @method _initScroll
           * @returns {}
           * @desc 初始化BScroll
           */
          _initScroll() {
            // 如果better-scroll调用this.$refs.wrapper时如果不存在，会报错，则返回
            if (!this.$refs.wrapper) {
              return
            }
            // 初始化BScroll对象
            this.scroll = new BScroll(this.$refs.wrapper, {
              probeType: this.probeType,
              click: this.click
            })

            // 如果监听scroll滚动事件,则派发一个事件出去
            if (this.listenScroll) {
              let _this = this
              this.scroll.on('scroll', (pos) => {
                _this.$emit('scroll', pos)
              })
            }

            // 如果需要上拉加载数据，则当scroll快到底部的时候派发一个scrollToEnd数据给父组件，再通过父组件来动态加载数据
            if (this.pullUp) {
              this.scroll.on('scrollEnd', () => {
                if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                  this.$emit('scrollToEnd')
                }
              })
            }

            // 如果需要在scroll滚动前派发事件，则向父组件派发beforeScroll事件
            if (this.beforeScroll) {
              this.scroll.on('beforeScrollStart', () => {
                this.$emit('beforeScroll')
              })
            }
          },

          /**
           * @method enable
           * @returns {}
           * @desc 代理BScroll的enable方法
           */
          enable() {
            this.scroll && this.scroll.enable()
          },

          /**
           * @method disable
           * @returns {}
           * @desc 代理BScroll的disable方法
           */
          disable() {
            this.scroll && this.scroll.disable()
          },

          /**
           * @method refresh
           * @returns {}
           * @desc 代理BScroll的refresh方法
           */
          refresh() {
            this.scroll && this.scroll.refresh()
          },
          /**
           * @method scrollTo
           * @returns {}
           * @desc 代理BScroll的scrollTo方法，需要传入一些参数，这里需要用apply
           */
          scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
          },
          /**
           * @method scrollToElement
           * @returns {}
           * @desc 代理BScroll的scrollToElement方法，需要传入一些参数，这里需要用apply
           */
          scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
          }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
