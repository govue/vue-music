/**
 * @file cache.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-22 10:50:00
 * @desc cache缓存操作相关
 */

import storage from 'good-storage'

const SEARCH_KEY = '__search__' // 搜索历史
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__PLAY__' // 播放历史
const PLAY_MAX_LENGTH = 200

/**
 * 保存搜索历史记录(一条)，在vuex中的actions.js文件引用
 * @param query
 * @returns {*}
 */
export function saveSearch(query) {
  let searchHistories = storage.get(SEARCH_KEY, []) // 获取storage中的搜索历史，没有就返回空数组
  insertArray(searchHistories, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searchHistories)
  return searchHistories
}

/**
 * 删除搜索历史记录（一条），在vuex中的actions.js文件引用
 * @param query
 * @returns {*}
 */
export function deleteSearch(query) {
  let searchHistories = storage.get(SEARCH_KEY, []) // 获取storage中的搜索历史，没有就返回空数组
  deleteFromArray(searchHistories, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searchHistories)
  return searchHistories
}

/**
 * 清空搜索历史记录（全部），在vuex中的actions.js文件引用
 * @param query
 * @returns {Array}
 */
export function clearSearch(query) {
  storage.remove(SEARCH_KEY)
  return []
}

/**
 * 向数组中插入元素函数
 * @param arr
 * @param val
 * @param compare 比较函数，外部传入
 * @param maxLen
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare) // 在数据中找是否存在查找的数据
  if (index === 0) { // 如果是数组的第一条数据
    return // 直接返回
  }
  if (index > 0) { // 如果不是数组的第一条数据
    arr.splice(index, 1) // 从查找到的位置删除该条数据
  }
  arr.unshift(val) // 把查找的数据放入数组第一条（结合上面的if，如果有就删除后插入，没有就直接插入）
  if (maxLen && arr.length > maxLen) { // 如果数组长度超过了最大限制长度
    arr.pop() // 从数组未尾删除一条数据
  }
  return arr
}

/**
 * 数组中的元素删除函数
 * @param arr
 * @param compare
 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 读取storage存储中的对应的值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 将当前播放的歌写入播放历史
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 获取播放历史
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}
