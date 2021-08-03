<template>
  <v-app style="background: #171717">
    <v-app-bar
      app
      color="#222"
    >
      <div class="text-h6">
        Minesweeper
      </div>

      <v-spacer />

      <v-col v-if="startedGame || conn" cols="auto">
        {{ remainingMines }}
      </v-col>

      <v-col cols="auto">
        <v-btn
          :class="conn ? 'mr-4' : ''"
          icon
          @click="refresh">
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
      </v-col>

      <v-col v-if="!conn" cols="auto">
        <div class="text-body-2">
          Share id
        </div>

        <div class="text-caption text--secondary">
          {{ peerId }}
        </div>
      </v-col>
    </v-app-bar>

    <v-main>
      <PeerConnector
        v-show="!startedGame && !conn"
        @connected="handleConnection"
        @peer="id => peerId = id"
        @start-game="startedGame = true" />

      <Minesweeper
        v-if="startedGame || conn"
        ref="mines"
        :key="minesKey"
        @send="sendMessage"
        @update:flagged-cells="fc => flaggedCells = fc" />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import Minesweeper from './components/Minesweeper.vue';
import PeerConnector from './components/PeerConnector.vue';

export default {
  name: 'App',

  components: {
    // HelloWorld,
    Minesweeper,
    PeerConnector,
  },

  data: () => ({
    conn: null,
    flaggedCells: 0,
    minesKey: 0,
    numberOfMines: 99,
    peerId: '',
    startedGame: false,
  }),

  computed: {
    remainingMines() {
      return (this.numberOfMines || 0) - (this.flaggedCells || 0);
    },
  },

  methods: {
    handleConnection(conn) {
      const vm = this;
      vm.conn = conn;

      vm.conn.on('open', () => {
        if (vm.$refs.mines && !vm.$refs.mines.zeroClicks) {
          vm.conn.send({
            action: 'init-blocks',
            blocks: vm.$refs.mines.blocks,
          });
        }

        vm.conn.on('data', ({
          action, blocks, row, col,
        }) => {
          if (action === 'refresh') vm.minesKey += 1;
          else if (action === 'hover') vm.$refs.mines.setConnHover(row, col);
          else if (action === 'left-click') vm.$refs.mines.leftClick(row, col, true);
          else if (action === 'middle-click') vm.$refs.mines.middleClick(row, col, true);
          else if (action === 'right-click') vm.$refs.mines.rightClick(row, col, true);
          else if (action === 'init-blocks') vm.$refs.mines.setBlocks(blocks);
        });
      });
    },
    refresh() {
      this.sendMessage({ action: 'refresh' });
      this.minesKey += 1;
      this.flaggedCells = 0;
    },
    sendMessage(message) {
      if (this.conn) this.conn.send(message);
    },
  },
};
</script>
