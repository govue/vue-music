// import jsonp from 'common/js/jsonp'
import axios from 'axios'
import {commonParams} from './config'

/**
 * @method getDiscList
 * @returns {json} json歌单列表
 * @desc 获取歌词数据，通过webpack.conf.js中的devServer里面before(app) {...}来代理后端数据,
 */
export function getLyric(mid) {
  const url = '/lyric'
  const data = Object.assign({}, commonParams, {
    // platform: 'yqq',
    // hostUin: 0,
    // sin: 0,
    // ein: 29,
    // sortId: 5,
    // needNewCode: 0,
    // categoryId: 10000000,
    // rnd: Math.random(),
    // format: 'json'
    pcachetime: +new Date(),
    songmid: mid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
