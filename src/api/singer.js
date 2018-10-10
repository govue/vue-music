/**
 * @file singer.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-10 16:46:00
 * @desc 歌手数据接口api
 */

import jsonp from 'common/js/jsonp'
import {commonParams} from './config'

/**
 * @method getSingerList
 * @returns {json} jsonp歌手列表
 * @desc 获取歌手列表数据
 */
export function getSingerList() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
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
  const options = {
    param: 'callback', // 这里使用jsonpCallback则报错：index.js?854e:94 Cross-Origin Read Blocking (CORB) blocked cross-origin response https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=yqq&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A10000%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22area%22%3A-100%2C%22sex%22%3A-100%2C%22genre%22%3A-100%2C%22index%22%3A-100%2C%22sin%22%3A0%2C%22cur_page%22%3A1%7D%7D%7D&jsonpCallback=getUCGI21555557964218952 with MIME type text/plain. See https://www.chromestatus.com/feature/5629709824032768 for more details.
    prefix: '',
    name: 'getUCGI21555557964218952'
  }
  return jsonp(url, data, options)
}
