/**
 * @file recommend.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-10 15:10:11
 */

import jsonp from 'common/js/jsonp'
import axios from 'axios'
import {commonParams, options} from './config'

/**
 * @method getSliders
 * @returns {json} jsonp返回数据
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

/**
 * @method getDiscList
 * @returns {json} jsonp返回数据
 * @desc 获取歌单数据
 */
export function getDissList() {
  const url = '/getDissList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
