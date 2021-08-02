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

      <v-btn
        class="mr-4"
        icon
        @click="refresh">
        <v-icon>
          mdi-refresh
        </v-icon>
      </v-btn>

      <div>
        <div class="text-body-2">
          Share id
        </div>

        <div class="text-caption text--secondary">
          {{ peerId }}
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <PeerConnector
        v-if="!startedGame && !conn"
        @connected="handleConnection"
        @peer="id => peerId = id"
        @start-game="startedGame = true" />

      <Minesweeper
        v-else
        ref="mines"
        :key="minesKey"
        @send="sendMessage" />
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
    minesKey: 0,
    peerId: '',
    startedGame: false,
  }),

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
          if (action === 'refresh') this.minesKey += 1;
          else if (action === 'left-click') vm.$refs.mines.leftClick(row, col, true);
          else if (action === 'middle-click') vm.$refs.mines.middleClick(row, col, true);
          else if (action === 'right-click') vm.$refs.mines.rightClick(row, col, true);
          else if (action === 'init-blocks') vm.$refs.mines.setBlocks(blocks);
        });
      });
    },
    refresh() {
      this.conn.send({ action: 'refresh' });
      this.minesKey += 1;
    },
    sendMessage(message) {
      if (this.conn) this.conn.send(message);
    },
  },
};
</script>
