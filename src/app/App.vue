<template lang="pug">
#app
  Editor.editor(:content="mdText", @change="getValue")
</template>

<script lang="ts">
import Vue from "vue";
import Editor from "@/lib/Editor.vue";
import mdText from "./mdText.md";
export default Vue.extend({
  components: { Editor },
  data() {
    return {
      mdText,
    };
  },
  methods: {
    getValue(value: { source: string; render: string }) {
      const { source, render } = value;
    },
  },
});
</script>

<style lang="sass">
#app
  height: 100%
  display: flex
  justify-content: center
  align-items: center

  .editor
    width: 1280px
    height: 800px
    border: 1px solid #ccc
</style>
