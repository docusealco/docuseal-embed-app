import React, { useState } from 'react';

const ClipboardBoard = ({ text, copyText, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        {...props}
      >
        {copied ? 'Copied' : text}
      </button>
    </div>
  );
}

export default ClipboardBoard;
