import InputManager from './inputManager'
import Grid from './grid'
class Game {
  constructor () {
    // size
    this.size = 4
    this.inputManager = new InputManager()

    this.startCells = 2
    this.addScore = 0
    this.showAddScore = false

    // 分发事件
    this.inputManager.on('move', this.move.bind(this))
    this.inputManager.on('restart', this.restart.bind(this))
    this.inputManager.on('keepPlaying', this.keepPlaying.bind(this))

    // 初始化游戏
    this.setUp()
  }

  // 初始化游戏
  setUp = function (newGame = false) {
    // TODO 这里如果之前玩过需要读取一波游戏状态
    let historyState = JSON.parse(localStorage.getItem('2048-state'))
    let historyCells = JSON.parse(localStorage.getItem('2048-cells'))
    let historyTiles = JSON.parse(localStorage.getItem('2048-tiles'))
    // state
    if (historyState && !newGame) {
      this.over = historyState.over
      this.win = historyState.win
      this.keep = historyState.keep
      this.currentScore = historyState.currentScore
      this.bestScore = historyState.bestScore
      this.grid = new Grid(this.size, historyCells, historyTiles)
    } else {
      this.over = false
      this.win = false
      this.keep = false
      this.currentScore = 0
      this.bestScore = historyState.bestScore || 0
      this.grid = new Grid(this.size)
      this.startRandomTiles()
      this.saveGame()
    }
  }

  // 初始化的时候随机生成x个格子
  startRandomTiles = function () {
    let randomCount = this.startCells
    for (let i = 0; i < randomCount; i++) {
      this.grid.randomTile()
    }
  }

  // 构建正确的遍历顺序
  buildTraversals = function (vector) {
    let traversals = { x: [], y: [] }

    // 格局每行的格子数遍历
    for (let pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos)
      traversals.y.push(pos)
    }

    // 更改顺序
    // 分别在往右 往下的时候触发
    if (vector.x === 1) traversals.x = traversals.x.reverse()
    if (vector.y === 1) traversals.y = traversals.y.reverse()

    return traversals
  }

  // 矢量
  getVector = function (direction) {
    // 向量代表了方向的运动
    let map = {
      0: { x: 0, y: -1 }, // Up
      1: { x: 1, y: 0 },  // Right
      2: { x: 0, y: 1 },  // Down
      3: { x: -1, y: 0 }   // Left
    }
    return map[direction]
  }

  // 移动格子
  move = function (direction) {
    const findFarthestPosition = this.grid.findFarthestPosition.bind(this.grid)
    let vector = this.getVector(direction)
    let traversals = this.buildTraversals(vector)
    // can move
    let moved = false
    let score = 0
    let flag = false
    // clear cache
    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        // 判断是否被占用
        let tile = this.grid.findTile({x, y})
        if (tile) {
          // 移动!
          let position = findFarthestPosition({ x, y }, vector)
          let farthest = position.farthest
          let next = this.grid.findTile(position.next)
          if (next && next.value === tile.value) {
            score += next.value * 2
            if (score === 2048 && !this.keep) {
              this.win = true
            }
            moved = this.grid.mergeTiles(tile, next)
          } else {
            moved = this.grid.moveTile({ x, y }, farthest)
          }
          if (moved) {
            flag = true
          }
        }
      })
    })
    if (flag) {
      this.grid.randomTile()
      if (this.grid.cells.toString().indexOf('0') === -1) {
        if (!this.grid.tileMatchesAvailable()) {
          this.gameOver()
        }
      }
    }
    if (score > 0) {
      this.updateScore(score)
    }
    // 保存游戏状态
    this.saveGame()
  }

  // 更细分能输
  updateScore = function (score) {
    this.showAddScore = false
    this.currentScore += score
    if (this.currentScore > this.bestScore) {
      this.bestScore = this.currentScore
    }
    // lazy execute
    setTimeout(_ => {
      this.addScore = score
      this.showAddScore = true
    }, 0)
  }

  // 保存游戏
  saveGame = function () {
    let state = {
      over: this.over,
      win: this.win,
      keep: this.keep,
      currentScore: this.currentScore,
      bestScore: this.bestScore
    }
    localStorage.setItem('2048-state', JSON.stringify(state))
    localStorage.setItem('2048-tiles', JSON.stringify(this.grid.tiles))
    localStorage.setItem('2048-cells', JSON.stringify(this.grid.cells))
  }

  // 重启游戏
  restart = function () {
    this.setUp(true)
  }

  // 结束游戏
  gameOver = function () {
    this.over = true
  }

  // 继续游戏
  keepPlaying = function () {
    this.keep = true
  }
}

export default Game
