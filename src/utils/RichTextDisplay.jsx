import React from 'react';
import "./RichTextDisplay.css"
import { formatText } from './formatText';
export const RichTextDisplay = ({ content }) => {
  const formattedContent = formatText(content); // Process the content

  return (
    <div
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: formattedContent }} // Inject the sanitized HTML
    />
  );
};
