class Grid {
  constructor (size, cells, tiles) {
    this.size = size
    this.cells = cells || this.init()
    this.tiles = tiles || []
  }

  // 初始化
  init () {
    let size = this.size
    let cells = []
    for (let row = 0; row < size; row++) {
      cells[row] = []
      for (let column = 0; column < size; column++) {
        cells[row][column] = 0
      }
    }
    return cells
  }

  // 增加格子
  addTile (tile, value) {
    let tiles = this.tiles
    tiles.push({
      // 防止 reuse
      id: Math.random() * 9999999,
      ...tile,
      value,
      class: 'tile-new'
    })
    this.cells[tile.x][tile.y] = 1
  }

  // 生成随机格子
  randomTile () {
    if (this.freeCell().length > 0) {
      let value = Math.random() < 0.9 ? 2 : 4
      let randomCell = this.randomAvailableCell()
      this.addTile(randomCell, value)
    }
  }

  // 随机格子
  randomAvailableCell () {
    let cells = this.freeCell()
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)]
    }
  }

  // 移动格子
  moveTile (tile, position) {
    tile = this.findTile(tile)
    // 顶到边框 所以是false 不能继续移动
    if (tile.x === position.x && tile.y === position.y) {
      return false
    } else {
      this.cells[tile.x][tile.y] = 0
      this.cells[position.x][position.y] = 1
      tile.x = position.x
      tile.y = position.y
      tile.class = ''
      return true
    }
  }

   // 矢量
  getVector (direction) {
  // 向量代表了方向的运动
    let map = {
      0: { x: 0, y: -1 }, // Up
      1: { x: 1, y: 0 },  // Right
      2: { x: 0, y: 1 },  // Down
      3: { x: -1, y: 0 }   // Left
    }
    return map[direction]
  }

  // 找可以合并的 tile
  tileMatchesAvailable () {
    let size = this.size
    let cells = this.cells
    let tile
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        tile = cells[x][y]
        if (tile) {
          // 每个方向都暴力的搜索一遍
          for (let direction = 0; direction < 4; direction++) {
            let vector = this.getVector(direction)
            let cell = {
              x: x + vector.x,
              y: y + vector.y
            }
            let other

            if (cell.x >= 0 && cell.x < size && cell.y >= 0 && cell.y < size) {
              other = cells[cell.x][cell.y]
            } else {
              continue
            }

            if (other && this.findTile(cell).value === this.findTile({
              x: x,
              y: y
            }).value) {
              return true // 发现可以合并的继续游戏
            }
          }
        }
      }
    }
    return false
  }

  // 合并 tile
  mergeTiles (curr, next) {
    next.value *= 2
    next.class = 'tile-merged'
    // 删掉 curr
    var tiles = this.tiles
    // Better Way to find index of data
    for (var key in tiles) {
      if (tiles[key].x === curr.x && tiles[key].y === curr.y) {
        tiles.splice(parseInt(key), 1)
        break
      }
    }
    // 清空占用
    this.cells[curr.x][curr.y] = 0
    // 更新分数
    return true
  }

  // 搜索 tile
  findTile (position) {
    if (position.x === -1 || position.y === -1) {
      return null
    } else {
      var tiles = this.tiles
      return tiles.filter(function (item, index) {
        return item.x === position.x && item.y === position.y
      })[0]
    }
  }

  // 遍历格子
  eachCell (callback) {
    this.cells.forEach((cell, x) => {
      cell.forEach((tile, y) => {
        callback(tile, x, y)
      })
    })
  }

  // 寻找空闲的格子
  freeCell () {
    let cells = []
    this.eachCell((cell, x, y) => {
      if (!cell) {
        cells.push({x, y})
      }
    })
    return cells
  }

  // 获取对应坐标的格子
  getTile ({x, y}) {
    let tile = this.cells[x][y]
    if (tile) {
      return tile
    }
    return null
  }

  // 边界判定
  withinBounds = function ({x, y}) {
    return x >= 0 && x < this.size &&
           y >= 0 && y < this.size
  };

  // 寻找最远的格子
  // 判定条件是为不为空
  // farthest 最远的格子
  // next 可能需要合并的格子
  findFarthestPosition = function (tile, vector) {
    // temp
    let previous
    do {
      previous = tile
      tile = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      }
    } while (this.withinBounds(tile) && !this.cells[tile.x][tile.y])

    return {
      farthest: previous,
      next: tile
    }
  }
}

export default Grid
