<template lang="pug">
.editor
  .markdown-editor
    .monaco-editor(ref="editor")
    Splitter
    //- markdown-body classname for github
    .markdown-preview.markdown-body(v-html="markdownRender" ref="preview")
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import configMarkdownIt, { MarkdownIt } from "./markdown";

import Splitter from "./Splitter.vue";

interface ExtendSupport {
  highlight?: boolean;
  mermaid?: boolean;
}

export default Vue.extend({
  components: { Splitter },
  props: {
    extends: {
      type: [Boolean, Object] as PropType<boolean | ExtendSupport>,
      default: true
    }
  },
  data() {
    return {
      markdown: null as MarkdownIt | null,
      markdownRender: "",
      focus: ""
    };
  },
  methods: {
    async initMarkdownIt() {
      const markdownConfig = (() => {
        if (this.extends === true) return { highlight: true, mermaid: true };
        if (this.extends === false) return null;
        return {
          highlight: this.extends.highlight || false,
          mermaid: this.extends.mermaid || false
        };
      })();
      this.markdown = await configMarkdownIt(markdownConfig);
    },
    initMonacoEditor() {
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
        const result = (this.markdown as MarkdownIt).render(content);
        this.markdownRender = result;
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
    this.initMarkdownIt();
    this.initMonacoEditor();
  }
});
</script>

<style lang="sass" scoped>
$color-violet-5: #845ef7
$color-violet-6: #7950f2
.mtk6
  color: $color-violet-5 !important

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
