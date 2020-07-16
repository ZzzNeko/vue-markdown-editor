<template lang="pug">
#app
  Editor
</template>

<script lang="ts">
import Vue from "vue";
import Editor from "@/lib/Editor.vue";
export default Vue.extend({
  components: { Editor },
  data() {
    return {};
  }
});
</script>

<style lang="sass">
#app
  height: 100%
</style>
