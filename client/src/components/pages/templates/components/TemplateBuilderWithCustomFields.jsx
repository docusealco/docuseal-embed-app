import React from "react";
import { DocusealBuilder } from "@docuseal/react";

const TemplateBuilderWithCustomFields = (props) => {
  return (
    <DocusealBuilder
      {...props}
      fields={[
        { name: "First Name", type: "text" },
        { name: "Last Name", type: "text" },
      ]}
    />
  );
};

export default TemplateBuilderWithCustomFields;
