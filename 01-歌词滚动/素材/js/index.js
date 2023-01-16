
// console.log('lrc', lrc)



function transformTime(time) {
  const arr = time.split(':')
  return Number(arr[0]) * 60 + Number(arr[1])
}

function parseLrc(lrc) {
  const arr = lrc.split('\n')
  return arr.map(item => {
    const temp = item.split(']')
    const time = temp[0].slice(1)
    const word = temp[1]
    return {
      time: transformTime(time),
      word
    }
  })
}

const lrcData = parseLrc(lrc)
console.log(lrcData)

var doms = {
  box: document.querySelector('.box'),
  ul: document.querySelector('ul'),
  audio: document.querySelector('audio')
}


// 1. 要知道当前播放哪一句歌词

function findIndex() {
  const currentTime = doms.audio.currentTime
  const index = lrcData.findIndex(_ => currentTime < _.time)
  return index - 1
}

// findIndex()

// 2. 动态创建 li

function createLrc() {
  const fra = document.createDocumentFragment()
  lrcData.forEach(item => {
    const li = document.createElement('li')
    li.innerText = item.word
    fra.append(li)
  })
  doms.ul.append(fra)
}

createLrc()


// 容器高度
const boxHeight = doms.box.clientHeight
// li 高度
const liHeight = doms.ul.children[0].clientHeight
// 最大偏移量
const MAX_OFFSET = doms.ul.clientHeight - boxHeight


function setOffset() {
  const index = findIndex()
  let offset = liHeight * index + liHeight / 2 - boxHeight / 2
  if (offset < 0) {
    offset = 0
  }
  if (offset > MAX_OFFSET) {
    offset = MAX_OFFSET
  }
  doms.ul.style.transform = `translateY(-${offset}px)`

  const preLi = doms.ul.querySelector('.active')
  if (preLi) {
    preLi.classList.remove('active')
  }

  const li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}

doms.audio.addEventListener('timeupdate', setOffset)



