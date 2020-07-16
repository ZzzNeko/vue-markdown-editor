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

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
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

export default markdownIt;
