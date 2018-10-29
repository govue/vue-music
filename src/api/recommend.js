/**
 * @file recommend.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-10 15:10:11
 * @desc 推荐页相关数据接口api
 */

import jsonp from 'common/js/jsonp'
// import axios from 'axios'
import {commonParams, options} from './config'

/**
 * @method getSliders
 * @returns {json} jsonp轮播图列表
 * @desc 获取轮播图数据
 */
export function getSliders() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDissList() {
  const url = 'http://musicdisslistapi.freetable.cn'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'jsonp'
  })

  return jsonp(url, data, options)
}

export function getSongList(dissid) {
  const url = 'http://musicdisssonglistapi.freetable.cn'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: dissid,
    format: 'json',
    // jsonpCallback: 'playlistinfoCallback',
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  const options = {
    param: 'jsonpCallback',
    prefix: '',
    name: 'playlistinfoCallback'
  }

  return jsonp(url, data, options)
}

/**
 * @method getDiscList
 * @returns {json} json歌单列表
 * @desc 获取歌单数据，通过webpack.conf.js中的devServer里面before(app) {...}来代理后端数据
 */
// export function getDissList() {
//   const url = 'http://musicapi.freetable.cn'
//   const data = Object.assign({}, commonParams, {
//     platform: 'yqq',
//     hostUin: 0,
//     sin: 0,
//     ein: 29,
//     sortId: 5,
//     needNewCode: 0,
//     categoryId: 10000000,
//     rnd: Math.random(),
//     format: 'jsonp'
//   })
//
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data)
//   }).catch(err => console.log(err))
// }

/**
 * @method getSongList
 * @returns {json} json歌单对应歌曲列表
 * @desc 获取歌单对应的歌曲数据
 */
// export function getSongList(dissid) {
//   const url = '/getDissSongList'
//   const data = Object.assign({}, commonParams, {
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     disstid: dissid,
//     format: 'json',
//     // jsonpCallback: 'playlistinfoCallback',
//     loginUin: 0,
//     hostUin: 0,
//     notice: 0,
//     platform: 'yqq',
//     needNewCode: 0
//   })
//
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data)
//   })
// }
