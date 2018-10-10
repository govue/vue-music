/**
 * @file singer.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-10 16:46:00
 * @desc 歌手数据接口api
 */

import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

/**
 * @method getSingerList
 * @returns {json} jsonp歌手列表
 * @desc 获取歌手列表数据
 */
export function getSingerList() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?callback=getUCGI4493462176516605'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    needNewCode: 0,
    data: '{"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}'
    // data: {
    //   comm: {ct: 24, cv: 10000},
    //   singerList: {
    //     module: 'Music.SingerListServer',
    //     method: 'get_singer_list',
    //     param: {area: -100, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1}
    //   }
    // }
  })
  return jsonp(url, data, options)
}
