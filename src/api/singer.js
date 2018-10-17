/**
 * @file singer.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-10 16:46:00
 * @desc 歌手数据接口api
 */

import jsonp from 'common/js/jsonp'
// import originJSONP from 'jsonp'
import {commonParams} from './config'

/**
 * @method getSingerList
 * @returns {json} jsonp歌手列表
 * @desc 获取歌手列表数据
 */
export function getSingerList(songmid) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0,
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
    name: 'getUCGI7515964745815737'
  }
  return jsonp(url, data, options)
}

/**
 * @method getSingerDetail
 * @returns {json} jsonp歌手详情
 * @desc 获取歌手详情
 */
export function getSingerDetail(singermid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: jsonp,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singermid,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  })
  const options = {
    param: 'jsonpCallback',
    prefix: '',
    name: 'MusicJsonCallbacksinger_track'
  }
  return jsonp(url, data, options)
}

// /**
//  * @method getSongUrl
//  * @returns {Strine} 歌曲播放地址
//  * @desc 获取歌曲播放地址
//  */
// export function getSongUrl(songmid) {
//   // const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
//   // const data = Object.assign({}, commonParams, {
//   //   loginUin: 0,
//   //   hostUin: 0,
//   //   needNewCode: 0,
//   //   platform: 'yqq',
//   //   data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"7942989088","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"7942989088","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":20,"cv":0}}`
//   // })
//   const option = {
//     param: 'callback', // 这里使用jsonpCallback则报错：index.js?854e:94 Cross-Origin Read Blocking (CORB) blocked cross-origin response https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=yqq&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A10000%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22area%22%3A-100%2C%22sex%22%3A-100%2C%22genre%22%3A-100%2C%22index%22%3A-100%2C%22sin%22%3A0%2C%22cur_page%22%3A1%7D%7D%7D&jsonpCallback=getUCGI21555557964218952 with MIME type text/plain. See https://www.chromestatus.com/feature/5629709824032768 for more details.
//     prefix: '',
//     name: 'getplaysongvkey13184190547415087'
//   }
//   // let jsonpData = jsonp(url, data, options)
//   // jsonpData.then((res) => {
//   //   if (res.code === 0) {
//   //     console.log(res.req_0.data.midurlinfo[0].purl)
//   //     // 'http://isure.stream.qqmusic.qq.com/' + res.req_0.data.midurlinfo[0].purl
//   //   }
//   // })
//   let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?callback=getplaysongvkey13184190547415087&g_tk=5381&jsonpCallback=getplaysongvkey13184190547415087&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data={"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"7942989088","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"7942989088","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":20,"cv":0}}`
//   return new Promise((resolve, reject) => {
//     originJSONP(url, option, (err, data) => {
//       if (!err) {
//         resolve(data)
//       } else {
//         reject(err)
//       }
//     })
//   })
// }
