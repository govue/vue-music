import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/recommend' // 推荐页面
import Diss from '../components/diss/diss' // 歌单页面
import Singer from 'components/singer/singer' // 歌手页面
import SingerDetail from '../components/singer-detail/singer-detail' // 歌手详情页面（二级）
import Rank from 'components/rank/rank' // 排行页面
import TopList from 'components/top-list/top-list' // 排行榜页面（二级）
import Search from 'components/search/search' // 搜索页面
import UserCenter from 'components/user-center/user-center' // 用户中心

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
      component: Recommend,
      children: [
        {
          path: ':id',
          name: 'Diss',
          component: Diss
        }
      ]
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
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'TopList',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: UserCenter
    }
  ]
})
