/**
 * @file search.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-19 19:00:00
 * @desc 搜索相关数据接口api
 */

import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

/**
 * @method getHotKey
 * @returns {json} jsonp热点搜索关键词
 * @desc 获取排热点搜索关键词数据
 */
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 0
  })
  // const options = {
  //   param: 'callback',
  //   prefix: '',
  //   name: 'getUCGI7515964745815737'
  // }
  return jsonp(url, data, options)
}

/**
 * @method search
 * @returns {json} jsonp通过关键词搜索
 * @desc 获取排热点搜索关键词数据
 */
export function search(query, page, zhida) {
  const url = '/search'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 0,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    format: 'json',
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: page,
    remoteplace: 'txt.mqq.all'
  })
  // const options = {
  //   param: 'callback',
  //   prefix: '',
  //   name: 'getUCGI7515964745815737'
  // }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
