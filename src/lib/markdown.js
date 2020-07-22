import MarkdownIt from "markdown-it";
import pluginAbbr from "markdown-it-abbr";
import pluginIns from "markdown-it-ins";
import pluginSub from "markdown-it-sub";
import pluginSup from "markdown-it-sup";
import pluginMark from "markdown-it-mark";
import pluginFoot from "markdown-it-footnote";
import pluginBlock from "markdown-it-container";
import pluginDefList from "markdown-it-deflist";
// import pluginEmoji from "markdown-it-emoji";
import pluginLink from "markdown-it-link-attributes";
import pluginAttrs from "markdown-it-attrs";
import pluginTOC from "markdown-it-toc-done-right";
import pluginAnchor from "markdown-it-anchor";
import "github-markdown-css/github-markdown.css";
import "./markdown-custom-block.sass";

const markdownIt = new MarkdownIt({ html: true, linkify: true });

async function configMarkdownIt(config) {
  markdownIt
    .use(pluginAbbr)
    .use(pluginIns)
    .use(pluginSub)
    .use(pluginSup)
    .use(pluginMark)
    .use(pluginFoot)
    .use(pluginBlock, "info", {
      validate: (param) => /^info$/.test(param.trim()),
      render: (tokens, index) =>
        tokens[index].nesting === 1
          ? `<div class="custom-block -info">`
          : "</div>\n",
    })
    .use(pluginBlock, "note", {
      validate: (param) => /^note$/.test(param.trim()),
      render: (tokens, index) =>
        tokens[index].nesting === 1
          ? `<div class="custom-block -note">`
          : "</div>\n",
    })
    .use(pluginDefList)
    .use(pluginTOC)
    .use(pluginAnchor)
    .use(pluginLink, {
      attrs: { target: "_blank", rel: "noreferrer noopener" },
    })
    .use(pluginAttrs);
  if (config) {
    // prettier-ignore
    if (config.highlight) {
      const pluginHighlight = await import(/* webpackChunkName: 'highlight' */ "markdown-it-highlightjs");
      const pluginHighlightLines = await import(/* webpackChunkName: 'highlight-lines' */ "markdown-it-highlight-lines");
      await import("highlight.js/styles/github-gist.css")
      markdownIt.use(pluginHighlight.default, { inline: true });
      markdownIt.use(pluginHighlightLines.default);
    }
    // prettier-ignore
    if (config.mermaid) {
      const pluginMermaid = await import(/* webpackChunkName: 'mermaid' */ "./mermaidPlugin");
      markdownIt.use(pluginMermaid.default);
    }
  }
  return markdownIt;
}

export default configMarkdownIt;
