<template>
  <div id="app">
    <div class="heading"><!-- 这里是头部 -->
      <h1 class="title">2048</h1>
      <div class="scores-container">
        <div class="score-container">
          {{ currentScore }}
          <div class="score-add" :class="{add : showAddScore}">+ {{addScore}}</div>
        </div>
        <div class="best-container">{{ bestScore }}</div>
      </div>
    </div>
    <div class="restart-container"><!-- 开始游戏 -->
      <div class="tip">Join the numbers and get to the <b>2048 tile!</b></div>
      <button class="btn restart-button" @click="newGame">New Game</button>
    </div>
    <div class="game-container" ref="gameContainer">
      <!-- Message -->
      <div class="message-container gg" v-show="over">
        <p>Game Over!</p>
        <button class="btn" @click="newGame">Try Again</button>
      </div>
      <div class="message-container win" v-show="win && !keep">
        <p>You Win!</p>
        <button class="btn" @click="keepPlay">Keep going</button>
        <button class="btn" @click="newGame">Try again</button>
      </div>
      <!--Grid-->
      <div class="grid-container">
        <div class="grid-row" :key="index" v-for="index in 4">
          <div class="grid-cell" :key="index" v-for="index in 4">
          </div>
        </div>
      </div>
      <!-- Tile -->
      <div class="tile-container">
        <div :key="tile.id" v-for="(tile,index) in tiles" class="tile"
             :class="[`${tile.class}`,`tile-position-${tile.x + 1}-${tile.y + 1}`, `tile-${tile.value}`]">
          <div class="tile-inner">{{ tile.value }}</div>
        </div>
      </div>
    </div>
    <footer>
      <p><b>HOW TO PLAY</b>: Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p>
      <hr />
      <p>This Game was power by vue.js <b> Created by </b><a href="https://github.com/Nbsaw">Nbsaw</a>.</p>
    </footer>
  </div>
</template>

<script>
import Game from '@/game/index.js'

export default {
  name: 'app',
  data () {
    return {
      game: new Game(),
      show: false
    }
  },
  mounted () {
    // 移动端处理
    // 得等加载完了
    let gameContainer = this.$refs.gameContainer
    this.game.inputManager.listen(gameContainer)
  },
  computed: {
    tiles () {
      return this.game.grid.tiles
    },
    currentScore () {
      return this.game.currentScore
    },
    bestScore () {
      return this.game.bestScore
    },
    over () {
      return this.game.over
    },
    win () {
      return this.game.win
    },
    keep () {
      return this.game.keep
    },
    showAddScore () {
      return this.game.showAddScore
    },
    addScore () {
      return this.game.addScore
    }
  },
  methods: {
    newGame () {
      this.game.restart()
    },
    keepPlay () {
      this.game.keepPlaying()
    }
  }
}
</script>

<style lang="scss">
@import '~style/main';
</style>
