import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/recommend' // 推荐页面
import Singer from 'components/singer/singer' // 歌手页面
import SingerDetail from '../components/singer-detail/singer-detail' // 歌手详情页面
import Rank from 'components/rank/rank' // 排行页面
import Search from 'components/search/search' // 搜索页面

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'SingerDetail',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    },
    {
      path: '/search',
      name: Search,
      component: Search
    }
  ]
})
