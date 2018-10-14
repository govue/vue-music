/**
 * @file Singer.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-10 16:46:00
 * @desc 歌手类，在singer.vue中格式化获取的数据时用
 */
export default class Singer {
  constructor({id, name}) {
    this.id = id
    this.name = name
    this.pic = `http://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.webp`
  }
}
