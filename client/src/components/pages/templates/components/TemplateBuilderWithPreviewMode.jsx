import React from "react";
import { DocusealBuilder } from "@docuseal/react";

const TemplateBuilderWithPreviewMode = (props) => {
  return <DocusealBuilder {...props} preview={true} />;
};

export default TemplateBuilderWithPreviewMode;
