<template>
  <div class="pt-12">
    <v-row>
      <v-text-field label="Connection id" v-model="connectionId" />
    </v-row>

    <v-row>
      <v-btn block @click="useConnectionId">
        Use connection id
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import Peer from 'peerjs';

export default {
  data() {
    return {
      connectionId: '',
    };
  },

  created() {
    const vm = this;
    vm.peer = new Peer();

    vm.peer.on('open', (id) => {
      console.log(`My peer id is ${id}`);
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
      console.log(`connecting to ${this.connectionId}`);
      vm.startListening(conn);
    },

  },
};
</script>
