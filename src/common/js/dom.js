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

/**
 * @method getData
 * @returns {}
 * @desc 读取和写入dom中的属性数据（两个参数时为读，三个参数时为写）
 */
export function getData(element, name, value) {
  const prefix = 'data-'
  name = prefix + name
  if (value) {
    return element.setAttribute(name, value)
  } else {
    return element.getAttribute(name)
  }
}

/**
 * @
 * @returns {}
 * @desc 浏览器能力检测，这里先检测出是什么类型的浏览器，然后再根据检测结果给传入的样式添加相应的前缀
 */
let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformName = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformName) {
    if (elementStyle[transformName[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
