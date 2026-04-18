'use client';

// Markdown preview component with syntax highlighting
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { replaceWikilinks } from '@/lib/markdown';
import { useEffect, useState } from 'react';

interface MarkdownPreviewProps {
  content: string;
  noteId: string;
}

export default function MarkdownPreview({ content, noteId }: MarkdownPreviewProps) {
  const [processedContent, setProcessedContent] = useState(content);

  useEffect(() => {
    // Replace wikilinks with actual links
    const processed = replaceWikilinks(content, noteId);
    setProcessedContent(processed);
  }, [content, noteId]);

  return (
    <div className="prose prose-invert max-w-none h-full overflow-auto p-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Custom link renderer for internal links
          a: ({ href, children, ...props }) => {
            // Check if it's an internal link (starts with /)
            if (href?.startsWith('/')) {
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    // Navigate to note - this would integrate with your router
                    window.location.href = href;
                  }}
                  className="text-blue-400 hover:text-blue-300 underline"
                  {...props}
                >
                  {children}
                </a>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Code blocks with syntax highlighting
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={`block bg-zinc-800 p-4 rounded-lg overflow-x-auto text-sm ${className || ''}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Headings with anchor links
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mb-4" id={String(children).toLowerCase().replace(/\s+/g, '-')} {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold mb-3 mt-6" id={String(children).toLowerCase().replace(/\s+/g, '-')} {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-bold mb-2 mt-4" id={String(children).toLowerCase().replace(/\s+/g, '-')} {...props}>
              {children}
            </h3>
          ),
          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-zinc-600 pl-4 italic my-4" {...props}>
              {children}
            </blockquote>
          ),
          // Lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside my-2 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside my-2 space-y-1" {...props}>
              {children}
            </ol>
          ),
          // Tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-zinc-700" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-zinc-800" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-zinc-700" {...props}>
              {children}
            </tbody>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-2 text-left" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-2" {...props}>
              {children}
            </td>
          ),
          // Horizontal rule
          hr: (props) => (
            <hr className="border-zinc-700 my-6" {...props} />
          ),
          // Images
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg max-w-full h-auto my-4"
              loading="lazy"
              {...props}
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
