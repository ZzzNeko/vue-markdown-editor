<template lang="pug">
.editor
  //- .header-control
  //-   input.title(v-model="title")
  .markdown-editor
    .monaco-editor(ref="editor")
    Splitter
    .markdown-preview.markdown-body(v-html="markdownRender" ref="preview")
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
      markdownRender: "",
      scrollTarget: ""
    };
  },
  methods: {
    init() {
      const editorDom = this.$refs.editor as HTMLElement;
      const previewDom = this.$refs.preview as HTMLElement;
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
      monacoEditor.onDidScrollChange(event => {
        if (this.scrollTarget === "preview") return;
        console.log("editor");
        this.scrollTarget = "editor";
        const { scrollTop, scrollHeight } = event;
        const toTopPercent = scrollTop / scrollHeight;
        previewDom.scrollTo({ top: previewDom.scrollHeight * toTopPercent });
        setTimeout(() => {
          this.scrollTarget = "";
        }, 100);
      });
      previewDom.addEventListener("scroll", event => {
        if (this.scrollTarget === "editor") return;
        console.log("preview");
        this.scrollTarget = "preview";
        const toTopPercent = previewDom.scrollTop / previewDom.scrollHeight;
        monacoEditor.setScrollTop(
          monacoEditor.getScrollHeight() * toTopPercent
        );
        this.$nextTick(() => {
          this.scrollTarget = "";
        });
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
  border-right: 1px solid #ccc
.markdown-preview
  width: 50%
  overflow: scroll
  border-left: 1px solid #ccc
  padding: 14px
</style>
