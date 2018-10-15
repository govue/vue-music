<template>
    <div class="singer">
      <list-view :data="singers"
                 @select="showSingerDetail"
      ></list-view>
      <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import {getSingerList} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import Mtils from 'mtils' // Mtils是一套前端代码集合，提供常用的数据校验、数据加密、扩展函数、便捷函数:https://github.com/MisterChangRay/Mtils2
    import Singer from 'common/js/class/Singer' // Singer类，处理数据时用
    import ListView from 'base/listview/listview'
    import {mapMutations} from 'vuex' // vuex提供的写数据的语法糖

    const HOT_NAME = '热门'
    const HOT_SINGER_LENGTH = 10

    export default {
        name: 'singer',
        data() {
          return {
            singers: []
          }
        },
        created() {
          this._getSingerList() // 获取歌手数据
        },
        methods: {
          /**
           * @computed showSingerDetail
           * @returns {}
           * @desc 根据子组件派发过来的select事件，执行显示歌手详情页
           */
          showSingerDetail(singer) {
            this.$router.push({
              path: `/singer/${singer.id}`
            })
            this.setSinger(singer) // 将singer数据写入vuex中，该方法通过...mapMutations（）语法糖是关联的
          },
          // 从getSingerLis() api 获取singers数据，此时的数据是原网站上原始格式的，还需要进一步处理
          _getSingerList() {
            getSingerList().then((res) => {
              if (res.code === ERR_OK) {
                this.singers = this._normalizeSingerList(res.singerList.data.singerlist)
                // console.log(this.singers)
                // console.log(Mtils.utils.makePy('屈波', true))
              }
            })
          },
          // 把从api获取到的数据先按需要截取相应字段，再按转成数组排序
          _normalizeSingerList(list) {
            // 选初始化singersMap，并把hot赋值进去
            let singersMap = {
              hot: {
                title: HOT_NAME,
                items: []
              }
            }
            // 遍历传入的list，按A~Z字母赋值
            list.forEach((item, index) => {
              // 填充HOT_NAME数据
              if (index < HOT_SINGER_LENGTH) {
                singersMap.hot.items.push(new Singer({
                  id: item.singer_mid,
                  name: item.singer_name
                }))
              }
              let key = Mtils.utils.makePy(item.singer_name).substr(0, 1).toUpperCase() // 取名字拼音的第一个大写字母，如果是小写则转为大写
              // 如果没有A~Z的key值则生成一个
              if (!singersMap[key]) {
                singersMap[key] = {
                  title: key,
                  items: []
                }
              }
              // 把数据填入对应的key
              singersMap[key].items.push(new Singer({
                id: item.singer_mid,
                name: item.singer_name
              }))
            })

            // 进一步对singerMap进行排序处理，把对象转换成排序的数组
            let hotArr = []
            let otherArr = []
            for (let key in singersMap) {
              let tempItem = singersMap[key]
              if (tempItem.title.match(/[a-zA-Z]/)) {
                otherArr.push(tempItem)
              } else if (tempItem.title === HOT_NAME) {
                hotArr.push(tempItem)
              }
            }
            otherArr.sort((a, b) => {
              return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hotArr.concat(otherArr)
          },
          /**
           * @computed mapMutations
           * @returns {}
           * @desc mapMutations将需要操作的数据做映射
           */
          ...mapMutations({
            setSinger: 'SET_SINGER'
          })
        },
        components: {
          ListView
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
