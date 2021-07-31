<template>
  <v-app style="background: #171717">
    <v-app-bar
      app
      color="#222"
      dark
    >
      <div class="text-h6">
        Minesweeper
      </div>
    </v-app-bar>

    <v-main>
      <Minesweeper />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import Minesweeper from './components/Minesweeper.vue';

export default {
  name: 'App',

  components: {
    // HelloWorld,
    Minesweeper,
  },

  data: () => ({
    //
  }),
};
</script>
