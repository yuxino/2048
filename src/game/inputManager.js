class InputManager {
  constructor (el) {
    this.events = {}
    // 处理Ie 10的监听事件
    if (window.navigator.msPointerEnabled) {
      this.eventTouchstart = 'MSPointerDown'
      this.eventTouchmove = 'MSPointerMove'
      this.eventTouchend = 'MSPointerUp'
    } else {
      this.eventTouchstart = 'touchstart'
      this.eventTouchmove = 'touchmove'
      this.eventTouchend = 'touchend'
    }
  }
  // 监听
  listen (gameContainer) {
    const map = {
      38: 0, // Up
      39: 1, // Right
      40: 2, // Down
      37: 3, // Left
      75: 0, // Vim up
      76: 1, // Vim right
      74: 2, // Vim down
      72: 3, // Vim left
      87: 0, // W
      68: 1, // D
      83: 2, // S
      65: 3  // A
    }
    // 响应方向键
    document.addEventListener('keydown', event => {
      // 描述符
      let modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                      event.shiftKey
      let mapped = map[event.which]
      // 如果是map表里的键
      // 就通知一下
      if (!modifiers && mapped !== undefined) {
        event.preventDefault()
        this.emit('move', mapped)
      }
      // 按 R 重启游戏
      if (!modifiers && event.which === 82) {
        this.restart(event)
      }
    })
    // 手机端处理
    let touchStartClientX
    let touchStartClientY
    gameContainer.addEventListener(this.eventTouchstart, function (event) {
      // 记录方向
      if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches.length > 1) {
        return
      }
      if (window.navigator.msPointerEnabled) {
        touchStartClientX = event.pageX
        touchStartClientY = event.pageY
      } else {
        touchStartClientX = event.touches[0].clientX
        touchStartClientY = event.touches[0].clientY
      }
      event.preventDefault()
    })
    gameContainer.addEventListener(this.eventTouchmove, event => {
      event.preventDefault()
    })
    gameContainer.addEventListener(this.eventTouchend, event => {
      // 计算方向
      let touchEndClientX, touchEndClientY
      touchEndClientX = event.changedTouches[0].clientX
      touchEndClientY = event.changedTouches[0].clientY
      let dx = touchEndClientX - touchStartClientX
      let absDx = Math.abs(dx)
      let dy = touchEndClientY - touchStartClientY
      let absDy = Math.abs(dy)
      if (Math.max(absDx, absDy) > 10) {
        // (right : left) : (down : up)
        this.emit('move', absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0))
      }
    })
  }
  // 接收事件
  on (event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  // 通知
  emit (event, data) {
    var callbacks = this.events[event]
    if (callbacks) {
      callbacks.forEach(function (callback) {
        callback(data)
      })
    }
  }
  // 封装了一下的重启事件
  restart (event) {
    event.preventDefault()
    this.emit('restart')
  }
  // 继续玩
  keepPlaying = function (event) {
    event.preventDefault()
    this.emit('keepPlaying')
  }
}

export default InputManager
