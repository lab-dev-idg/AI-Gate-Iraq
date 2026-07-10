import ReactMarkdown from 'react-markdown';

interface LazyMarkdownRendererProps {
  children: string;
}

export default function LazyMarkdownRenderer({ children }: LazyMarkdownRendererProps) {
  return <ReactMarkdown>{children}</ReactMarkdown>;
}
