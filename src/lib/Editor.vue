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
import mermaid from "mermaid";
import markdown from "./markdown";
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
      focus: ""
    };
  },
  methods: {
    init() {
      const editorDom = this.$refs.editor as HTMLElement;
      const previewDom = this.$refs.preview as HTMLElement;
      const monacoEditor = monaco.editor.create(editorDom, {
        language: "markdown",
        fontSize: 16,
        automaticLayout: true
      });
      monacoEditor.onDidChangeModelContent(event => {
        // console.log(event);
        const content = monacoEditor.getValue();
        const result = markdown.render(content);
        this.markdownRender = result;
        this.$nextTick(() => mermaid.init(".mermaid"));
      });
      editorDom.addEventListener("mouseenter", e => (this.focus = "editor"));
      previewDom.addEventListener("mouseenter", e => (this.focus = "preview"));
      // NOTE: 给 DOM 设置 scrollTo 之后至触发 scroll 事件为宏任务
      // 使用 setTimeout 修改 focus = '' 无法完全避免 previewDom 后续的执行
      monacoEditor.onDidScrollChange(event => {
        if (this.focus === "preview") return;
        this.focus = "editor";
        const toTopPercent = event.scrollTop / event.scrollHeight;
        previewDom.scrollTo({ top: previewDom.scrollHeight * toTopPercent });
      });
      previewDom.addEventListener("scroll", event => {
        if (this.focus === "editor") return;
        this.focus = "preview";
        const toTopPercent = previewDom.scrollTop / previewDom.scrollHeight;
        const editorScrollTop = monacoEditor.getScrollHeight() * toTopPercent;
        monacoEditor.setScrollTop(editorScrollTop);
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
