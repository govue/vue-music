// 将传入的数组随机打乱
export function shuffle (arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
}

// 生成min（包含）到max（包含）之间的随机整数
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
