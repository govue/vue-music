/**
 * @file dom.js
 * @author qubo
 * @copyright govue.cn
 * @createDate 2018-10-10 15:10:11
 * @desc dom操作相关
 */

/**
 * @method addClass
 * @returns
 * @desc 添加class样式
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

/**
 * @method hasClass
 * @returns {boolean}
 * @desc 判断是否存在class样式
 */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
