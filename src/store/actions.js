// action为对mutation的封装，即有多个mutation操作时，封装在actions里面

import * as types from './mutation-types'
import {playMode} from 'common/js/config' // 引入播放模式常量
import {shuffle} from 'common/js/util' // 引入将数组随机打乱的函数

// 当点击歌曲播放的时候
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // 将歌手对应的歌曲list赋值给sequenceList
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_PLAYLIST, list) // 将歌手对应的歌曲list赋值给playlist,playlist为播放器播放的list
  commit(types.SET_CURRENT_INDEX, index) // 当前播放的index，即为playlist里面的数据
  commit(types.SET_FULL_SCREEN, true) // 设置为全屏
  commit(types.SET_PLAYING_STATE, true) // 设置播放中
}

// 当点击“机播放全部”曲的时候
export const randomPlay = function({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random) // 将播放模式设置成随机
  commit(types.SET_SEQUENCE_LIST, list) // 将歌手对应的歌曲list赋值给sequenceList
  let randomList = shuffle(list) // 将传过来的数组打乱
  commit(types.SET_PLAYLIST, randomList) // 将歌手对应的歌曲list赋值给playlist,playlist为播放器播放的list
  commit(types.SET_CURRENT_INDEX, 0) // 当前播放的index，即为playlist里面的数据
  commit(types.SET_FULL_SCREEN, true) // 设置为全屏
  commit(types.SET_PLAYING_STATE, true) // 设置播放中
}

// 在数组中查找对应item并返回index
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
