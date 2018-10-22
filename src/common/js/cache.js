/**
 * @file cache.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-22 10:50:00
 * @desc cache缓存操作相关
 */

import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

export function saveSearch(query) {
  let searchHistories = storage.get(SEARCH_KEY, []) // 获取storage中的搜索历史，没有就返回空数组
  insertArray(searchHistories, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searchHistories)
  return searchHistories
}

/**
 * 数组插入函数
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

// 读取storage存储中的对应的值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
