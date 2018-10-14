// import {getSongUrl} from '../../../api/singer'
/**
 * @file Song.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-10 16:46:00
 * @desc 歌曲类
 */
export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album // 专辑
    this.duration = duration // 歌长
    this.image = image
    this.url = url
  }
}

/**
 * @function createSong
 * @returns {}
 * @desc 工厂方法
 */
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${musicData.albummid}.webp`,
    url: `http://dl.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?vkey=91A134958047EC04A21B8BFB7E9107BACB69E05A534FE40D340F735D128ADD558310154230F4BC6CE6710F441F0CB82636782DE73A72ABD4&fromtag=66`
  })
}

/**
 * @function filterSinger
 * @returns {}
 * @desc 因为Song里面的singer有可能是多个，是用‘/’连接的
 */
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s)
  })
  return ret.join('/')
}
