import React from "react";

interface CodePreviewBoxProps {
  code: string;
}

const CodePreviewBox: React.FC<CodePreviewBoxProps> = ({ code }) => {
  return (
    <iframe
      srcDoc={code}
      title="HTML Preview"
      width="100%"
      height="100%"
      style={{ border: "none" }}
    />
  );
};

export default CodePreviewBox;
