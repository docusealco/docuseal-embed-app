import React from "react";
import { DocusealBuilder } from "@docuseal/react";

const TemplateBuilderWithMultiLanguage = (props) => {
  return (
    <DocusealBuilder
      {...props}
      language={["es", "de", "fr", "pt", "he", "ar"][Math.floor(Math.random() * 6)]}
    />
  );
};

export default TemplateBuilderWithMultiLanguage;
