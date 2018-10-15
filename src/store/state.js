import {playMode} from 'common/js/config'

const state = {
  singer: {}, // 歌手
  playing: false, // 播放状态：true为正在播放，false为停止播放
  fullScreen: false, // 全屏播放：true为全屏，false为固定在底部状态栏（非全屏）
  playlist: [], // 播放中的列表，有三种状态：一是顺序，二是循环，三是随机，该列表从sequenceList列表来生成
  sequenceList: [], // 排好序的播放列表
  playMode: playMode.sequence, // 播放模式
  currentIndex: -1 // 当前播放的索引，即当前播放的歌曲
}

export default state
