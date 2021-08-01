<template>
  <v-app dark style="background: #171717">
    <v-app-bar
      app
      color="#222"
    >
      <div class="text-h6">
        Minesweeper
      </div>
    </v-app-bar>

    <v-main>
      <PeerConnector v-if="!conn" @connected="handleConnection" />

      <Minesweeper v-else ref="mines" @send="sendMessage" />
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
  }),

  methods: {
    handleConnection(conn) {
      const vm = this;
      vm.conn = conn;

      vm.conn.on('open', () => {
        vm.conn.on('data', ({ action, row, col }) => {
          if (action === 'left-click') vm.$refs.mines.leftClick(row, col);
          else if (action === 'right-click') vm.$refs.mines.rightClick(row, col);
        });
      });
    },
    sendMessage(message) {
      this.conn.send(message);
    },
  },
};
</script>
