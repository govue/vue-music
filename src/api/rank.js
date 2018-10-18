/**
 * @file rank.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-18 20:00:00
 * @desc 排行榜数据接口api
 */

import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

/**
 * @method getTopList
 * @returns {json} jsonp歌手列表
 * @desc 获取排行榜列表数据
 */
export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0
  })
  // const options = {
  //   param: 'callback',
  //   prefix: '',
  //   name: 'getUCGI7515964745815737'
  // }
  return jsonp(url, data, options)
}
