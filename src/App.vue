<template>
  <v-app style="background: #171717">
    <v-app-bar
      app
      color="#222"
    >
      <div v-if="$vuetify.breakpoint.smAndUp" class="text-h6">
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
          Share ID
        </div>

        <div class="text-caption text--secondary">
          {{ peerId }}
        </div>
      </v-col>

      <v-col cols="auto">
        <v-switch
          class="mb-n5"
          v-model="mobileMode">
          <template #label>
            <v-icon>
              mdi-cellphone
            </v-icon>
          </template>
        </v-switch>
      </v-col>

      <v-col cols="auto">
        <v-menu
          :close-on-content-click="false"
          nudge-bottom="16"
          offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                mdi-cog
              </v-icon>
            </v-btn>
          </template>

          <v-card class="pa-4">
            <v-text-field
              v-model.number="numberOfRows"
              label="Rows"
              type="number" />

            <v-text-field
              v-model.number="numberOfCols"
              label="Columns"
              type="number" />

            <v-text-field
              v-model.number="numberOfMines"
              label="Mines"
              type="number" />
          </v-card>
        </v-menu>
      </v-col>
    </v-app-bar>

    <v-main class="mx-4" style="overflow: auto">
      <PeerConnector
        v-show="!startedGame && !conn"
        @connected="handleConnection"
        @peer="id => peerId = id"
        @start-game="startedGame = true" />

      <Minesweeper
        v-if="startedGame || conn"
        ref="mines"
        :key="minesKey"
        :mobile-mode="mobileMode"
        :number-of-cols="numberOfCols"
        :number-of-mines="numberOfMines"
        :number-of-rows="numberOfRows"
        @game-lost="showSnackbar(false)"
        @game-won="showSnackbar(true)"
        @send="sendMessage"
        @update:flagged-cells="fc => flaggedCells = fc" />
    </v-main>

    <v-snackbar
      v-model="showingSnackbar"
      :color="snackbarColour"
      top
    >
      {{ snackbarText }}

      <template
        v-if="showingRefreshInSnackbar"
        #action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="() => { refresh(); showingSnackbar = false; }">
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Minesweeper from './components/Minesweeper.vue';
import PeerConnector from './components/PeerConnector.vue';

export default {
  name: 'App',

  components: {
    Minesweeper,
    PeerConnector,
  },

  data() {
    return {
      conn: null,
      flaggedCells: 0,
      minesKey: 0,
      mobileMode: false,
      numberOfCols: 30,
      numberOfRows: 16,
      numberOfMines: 99,
      peerId: '',
      showingRefreshInSnackbar: false,
      showingSnackbar: false,
      snackbarColour: 'error',
      snackbarText: '',
      startedGame: false,
    };
  },

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
    async showSnackbar(won = true) {
      const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      if (won) {
        this.showingRefreshInSnackbar = true;
        this.snackbarColour = 'success';
        this.snackbarText = 'Woot woot!';
        this.showingSnackbar = true;
      } else {
        this.snackbarColour = 'error darken-2';
        this.snackbarText = 'Oh no!';
        this.showingRefreshInSnackbar = false;
        this.showingSnackbar = true;
        await wait(2500);
        this.showingSnackbar = false;

        await wait(500);
        this.snackbarText = 'It\'s ok';
        this.showingRefreshInSnackbar = true;
        this.showingSnackbar = true;
      }
    },
  },
};
</script>
