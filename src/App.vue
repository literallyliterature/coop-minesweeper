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
      <PeerConnector />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
// import Minesweeper from './components/Minesweeper.vue';
import PeerConnector from './components/PeerConnector.vue';

export default {
  name: 'App',

  components: {
    // HelloWorld,
    // Minesweeper,
    PeerConnector,
  },

  data: () => ({
    //
  }),
};
</script>
