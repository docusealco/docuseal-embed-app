import React from "react";
import { DocusealBuilder } from "@docuseal/react";

const TemplateBuilderWithDefinedSignerRoles = (props) => {
  return <DocusealBuilder {...props} roles={["Signer", "Approver"]} />;
};

export default TemplateBuilderWithDefinedSignerRoles;
