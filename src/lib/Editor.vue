<template lang="pug">
.markdown-editor
  .monaco-editor(ref="editor")
  Splitter
  .markdown-preview.markdown-body(v-html="markdownRender")
</template>

<script lang="ts">
import Vue from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import MarkdownIt from "markdown-it";

import pluginAbbr from "markdown-it-abbr";
import pluginIns from "markdown-it-ins";
import pluginSub from "markdown-it-sub";
import pluginSup from "markdown-it-sup";
import pluginMark from "markdown-it-mark";
import pluginFoot from "markdown-it-footnote";
import pluginBlock from "markdown-it-container";
import pluginDefList from "markdown-it-deflist";
import pluginEmoji from "markdown-it-emoji";
import pluginHighlight from "markdown-it-highlightjs";
import pluginHighlightLines from "markdown-it-highlight-lines";
import pluginTOC from "markdown-it-toc-done-right";
import pluginAnchor from "markdown-it-anchor";
import pluginLink from "markdown-it-link-attributes";
import pluginAttrs from "markdown-it-attrs";
import pluginMermaid from "markdown-it-mermaid";
import mermaid from "mermaid";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/github-gist.css";
import "./main.sass";

import Splitter from "./splitter.vue";

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true
});
markdownIt
  .use(pluginAbbr)
  .use(pluginIns)
  .use(pluginSub)
  .use(pluginSup)
  .use(pluginMark)
  .use(pluginFoot)
  .use(pluginBlock)
  .use(pluginDefList)
  .use(pluginHighlight)
  .use(pluginHighlightLines)
  .use(pluginTOC)
  .use(pluginAnchor)
  .use(pluginLink, { attrs: { target: "_blank", rel: "noreferrer noopener" } })
  .use(pluginAttrs)
  .use(pluginMermaid);

export default Vue.extend({
  components: { Splitter },
  data() {
    return {
      markdownRender: ""
    };
  },
  methods: {
    init() {
      const editorDom = this.$refs.editor;
      const monacoEditor = monaco.editor.create(editorDom, {
        language: "markdown",
        fontSize: 18,
        automaticLayout: true
      });
      monacoEditor.onDidChangeModelContent(event => {
        // console.log(event);
        const content = monacoEditor.getValue();
        const result = markdownIt.render(content);
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
