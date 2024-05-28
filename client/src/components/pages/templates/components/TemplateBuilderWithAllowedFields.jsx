import React from "react";
import { DocusealBuilder } from "@docuseal/react";

const TemplateBuilderWithAllowedFields = (props) => {
  return (
    <DocusealBuilder
      {...props}
      fieldTypes={["text", "date", "signature", "initials"]}
    />
  );
};

export default TemplateBuilderWithAllowedFields;
