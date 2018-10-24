// action为对mutation的封装，即有多个mutation操作时，封装在actions里面

import * as types from './mutation-types'
import {playMode} from 'common/js/config' // 引入播放模式常量
import {shuffle} from 'common/js/util' // 引入将数组随机打乱的函数
import {saveSearch, deleteSearch, clearSearch} from 'common/js/cache' // 引入写本地存储storage方法

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

// 插入一首歌到播放列表（搜索时）
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice() // 数组是引用类型，slice是返回playlist的副本，不然就直接修改了vuex变量，会报警告
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex // currentIndex是值类型，不需要创建副本
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  playlist.splice(currentIndex, 0, song)

  // 如果已经包含了这首歌，判断位置再删除
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) { // 如果查找到的歌曲在当前播放列表前面，则删除后当前播放歌曲索引再向前移一位
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else { // 如果查找到的歌曲在当前播放列表后面，则直接删除
      playlist.splice(fpIndex + 1, 1)
    }
  }

  // 查找sequence列表，先添加到列表，再判断是否重复，如果有则计算位置并删除
  let currentSindex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSindex, 0, song) // 添加
  if (fsIndex > -1) {
    if (currentSindex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  // 修改vuex中的数据
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 从playlist删除一首歌
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice() // 数组是引用类型，slice是返回playlist的副本，不然就直接修改了vuex变量，会报警告
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex // currentIndex是值类型，不需要创建副本
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1) // 从当前播放列表中删除
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1) // 从sequenceList列表中删除

  // 如果删除的歌在当前播放歌的前面，或是当前播放的歌是最后一首
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  // 如果playlist中的歌全部删完了
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false) // 将播放器隐藏
  } else {
    commit(types.SET_PLAYING_STATE, true) // 如果暂停时删除playlist中的歌，这时播放状态还是暂停，但歌却在播放，这里调用setPlayingState解决这个问题
  }
}

// 将搜索的记录写入vuex变量和写入本地缓存
export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除searchHistory历史记录(一条)
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空全部历史记录
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 在数组中查找对应item并返回index
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
