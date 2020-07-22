import MarkdownIt from 'markdown-it'

interface ExtendSupport {
  highlight?: boolean;
  mermaid?: boolean;
}

export default function configMarkdownIt(config: ExtendSupport | null): MarkdownIt
export { MarkdownIt }