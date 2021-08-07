<template>
  <div class="pa-12">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Invite someone
          </v-card-title>

          <v-card-subtitle>
            by sharing the following id
          </v-card-subtitle>

          <v-card-text>
            <v-row dense>
              <v-col id="peer-connector-share-id">
                {{ peerId }}
              </v-col>

              <v-col cols="auto">
                <v-btn icon @click="$emit('copy-to-clipboard', 'peer-connector-share-id')">
                  <v-icon>
                    mdi-content-copy
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              large
              @click="$emit('start-game')">
              Start game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <v-card-title>
            Join someone's game
          </v-card-title>

          <v-card-subtitle>
            by entering their id
          </v-card-subtitle>

          <v-card-text>
            <v-text-field label="Connection id" v-model="connectionId" />
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              large
              @click="useConnectionId">
              Use connection id
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Peer from 'peerjs';

export default {
  data() {
    return {
      connectionId: '',
      peerId: '',
    };
  },

  created() {
    const vm = this;
    vm.peer = new Peer();

    vm.peer.on('open', (id) => {
      vm.$emit('peer', id);
      vm.peerId = id;
    });

    vm.peer.on('connection', (conn) => {
      vm.startListening(conn);
    });
  },

  methods: {
    startListening(conn) {
      this.$emit('connected', conn);
    },
    useConnectionId() {
      const vm = this;

      const conn = vm.peer.connect(this.connectionId);
      vm.startListening(conn);
    },

  },
};
</script>
