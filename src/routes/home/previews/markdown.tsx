import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  code: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ code }) => {
  return (
    <div className="prose bg-white w-full h-full max-w-none p-2">
      <ReactMarkdown
        children={code}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      />
    </div>
  );
};

export default MarkdownPreview;
