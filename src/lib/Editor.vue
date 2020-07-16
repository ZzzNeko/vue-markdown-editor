<template lang="pug">
.editor
  .header-control
    input.title(v-model="title")
  .markdown-editor
    .monaco-editor(ref="editor")
    Splitter
    .markdown-preview.markdown-body(v-html="markdownRender")
</template>

<script lang="ts">
import Vue from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import markdown from "./markdown";
import mermaid from "./mermaid";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/github-gist.css";
import "./main.sass";

import Splitter from "./Splitter.vue";

export default Vue.extend({
  components: { Splitter },
  data() {
    return {
      title: "233",
      markdownRender: ""
    };
  },
  methods: {
    init() {
      const editorDom = this.$refs.editor as HTMLElement;
      const monacoEditor = monaco.editor.create(editorDom, {
        language: "markdown",
        fontSize: 18,
        automaticLayout: true
      });
      monacoEditor.onDidChangeModelContent(event => {
        // console.log(event);
        const content = monacoEditor.getValue();
        const result = markdown.render(content);
        this.markdownRender = result;

        mermaid.init("mermaid");
      });
    }
  },
  mounted() {
    this.init();
  }
});
</script>

<style lang="sass" scoped>
.editor
  height: 100%
.markdown-editor
  display: flex
  align-items: stretch
  height: 100%
  overflow: hidden
.monaco-editor
  width: 50%
.markdown-preview
  width: 50%
  overflow: scroll
  border: 1px solid red
  padding: 14px
</style>
