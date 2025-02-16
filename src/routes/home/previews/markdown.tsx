import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  code: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ code }) => {
  return (
    <div className="prose bg-white w-full h-full max-h-full overflow-auto max-w-none p-2">
      <ReactMarkdown
        children={code}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      />
    </div>
  );
};

export default MarkdownPreview;
