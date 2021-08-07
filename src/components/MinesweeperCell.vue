<template>
  <v-btn
    class="px-0 text-body-1 font-weight-bold"
    dark
    :disabled="(messedUp && !cell.isMine)"
    large
    icon
    plain
    tile
    style="box-sizing:border-box; border: 1px solid #272727; color: #b8b8b8"
    @click="() => {}"
    @click.left="leftClick()"
    @click.middle.prevent="$emit('middle-click')"
    @click.right.prevent="$emit('right-click')"
    @mouseover="$emit('hover')">
  </v-btn>
</template>

<script>
export default {
  props: {
    cell: {
      type: Object,
      default: () => ({}),
    },
    messedUp: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
