<template lang="pug">
.editor
  .tool-bar
    .text-tools
    .view-tools
      .tool-btn(
        :class="{ '-checked': visible.editor && !visible.splitter }",
        @click="switchView('edit')"
      )
        svg.icon(aria-hidden="true")
          use(xlink:href="#icon-edit")
      .tool-btn(
        :class="{ '-checked': visible.preview && !visible.splitter }",
        @click="switchView('view')"
      )
        svg.icon(aria-hidden="true")
          use(xlink:href="#icon-view")
      .tool-btn(
        :class="{ '-checked': visible.splitter }",
        @click="switchView('half')"
      )
        svg.icon(aria-hidden="true")
          use(xlink:href="#icon-half")
  .markdown-editor
    .monaco-editor(v-show="visible.editor", ref="editor")
    Splitter(v-show="visible.splitter")
    .markdown-preview(v-show="visible.preview", ref="preview")
      .scroll-decoration(v-show="renderScrollTop > 0")
      .markdown-body(v-html="render", ref="render")
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Splitter from "./Splitter.vue";
import configMarkdownIt, { MarkdownIt } from "./markdown";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "./editor.sass";
import "./iconfont.js";
import "./iconfont.sass";

interface ExtendSupport {
  highlight?: boolean;
  mermaid?: boolean;
}

type Keys = "edit" | "view" | "half";

export default Vue.extend({
  components: { Splitter },
  props: {
    content: { type: String, default: "" },
    extends: {
      type: [Boolean, Object] as PropType<boolean | ExtendSupport>,
      default: true,
    },
  },
  data() {
    return {
      markdown: null as MarkdownIt | null,
      render: "",
      focus: "",
      visible: {
        editor: true,
        splitter: true,
        preview: true,
      },
      editorDom: null as HTMLElement | null,
      previewDom: null as HTMLElement | null,
      renderDom: null as HTMLElement | null,
      renderScrollTop: 0,
    };
  },
  methods: {
    async initMarkdownIt() {
      const markdownConfig = (() => {
        if (this.extends === true) return { highlight: true, mermaid: true };
        if (this.extends === false) return null;
        return {
          highlight: this.extends.highlight || false,
          mermaid: this.extends.mermaid || false,
        };
      })();
      this.markdown = await configMarkdownIt(markdownConfig);
    },
    initMonacoEditor() {
      const editorDom = this.$refs.editor as HTMLElement;
      const previewDom = this.$refs.preview as HTMLElement;
      const renderDom = this.$refs.render as HTMLElement;
      this.editorDom = editorDom;
      this.previewDom = previewDom;
      this.renderDom = renderDom;
      const monacoEditor = monaco.editor.create(editorDom, {
        language: "markdown",
        fontSize: 16,
        automaticLayout: true,
      });
      const renderContent = () => {
        const content = monacoEditor.getValue();
        const result = (this.markdown as MarkdownIt).render(content);
        this.render = result;
        this.$emit("change", { source: content, render: result });
      };
      monacoEditor.setValue(this.content);
      renderContent();
      monacoEditor.onDidChangeModelContent(renderContent);
      editorDom.addEventListener("mouseenter", (e) => (this.focus = "editor"));
      renderDom.addEventListener("mouseenter", (e) => (this.focus = "render"));
      // NOTE: 给 DOM 设置 scrollTo 之后至触发 scroll 事件为宏任务
      // 使用 setTimeout 修改 focus = '' 无法完全避免 renderDom 后续的执行
      monacoEditor.onDidScrollChange((event) => {
        if (this.focus === "render") return;
        this.focus = "editor";
        const toTopPercent = event.scrollTop / event.scrollHeight;
        renderDom.scrollTo({ top: renderDom.scrollHeight * toTopPercent });
      });
      renderDom.addEventListener("scroll", (event) => {
        this.renderScrollTop = renderDom.scrollTop;
        if (this.focus === "editor") return;
        this.focus = "render";
        const toTopPercent = renderDom.scrollTop / renderDom.scrollHeight;
        const editorScrollTop = monacoEditor.getScrollHeight() * toTopPercent;
        monacoEditor.setScrollTop(editorScrollTop);
      });
    },
    switchView(key: Keys) {
      this.visible.editor = key === "edit" || key === "half";
      this.visible.splitter = key === "half";
      this.visible.preview = key === "view" || key === "half";
      if (this.editorDom) {
        this.editorDom.style.width =
          (key == "edit" && "100%") || (key == "view" && "0") || "50%";
      }
      if (this.previewDom) {
        this.previewDom.style.width =
          (key == "edit" && "0") || (key == "view" && "100%") || "50%";
      }
    },
  },
  async mounted() {
    await this.initMarkdownIt();
    this.initMonacoEditor();
  },
});
</script>

<style lang="sass" scoped>
@import './colorlib.sass'

.editor
  display: flex
  flex-direction: column
  box-shadow: 0 0 1px #ccc

  & > .tool-bar
    display: flex
    justify-content: space-between
    align-items: center
    
    .text-tools
      display: flex
    .view-tools
      display: flex
    .tool-btn
      display: flex
      justify-content: center
      align-items: center
      width: 28px
      height: 28px
      margin: 4px
      cursor: pointer
      border: 1px solid $grey-3
      &.-checked
        background-color: $grey-2
        cursor: auto

  & > .markdown-editor
    display: flex
    align-items: stretch
    height: 100%
    overflow: hidden
    background-color: #fff
    .monaco-editor
      width: 50%
      border-right: 1px solid #ccc
    .markdown-preview
      position: relative
      width: 50%
      border-left: 1px solid #ccc
      .scroll-decoration
        box-shadow: #dddddd 0 6px 6px -6px inset
        position: absolute
        top: 0
        left: 0
        right: 0
        height: 6px
      .markdown-body
        overflow: scroll
        padding: 14px
        height: 100%

</style>
