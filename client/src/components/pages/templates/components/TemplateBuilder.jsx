import React from "react";
import { DocusealBuilder } from "@docuseal/react";
import TemplateBuilderWithCustomFields from "./TemplateBuilderWithCustomFields";
import TemplateBuilderWithAllowedFields from "./TemplateBuilderWithAllowedFields";
import TemplateBuilderWithCustomStyles from "./TemplateBuilderWithCustomStyles";
import TemplateBuilderWithPreviewMode from "./TemplateBuilderWithPreviewMode";
import TemplateBuilderWithMultiLanguage from "./TemplateBuilderWithMultiLanguage";
import TemplateBuilderWithDefinedSignerRoles from "./TemplateBuilderWithDefinedSignerRoles";

const TemplateBuilder = ({ templateType, ...props }) => {
  const baseProps = { host: process.env.REACT_APP_DOCUSEAL_CDN_HOST, ...props };
  const customBuilders = {
    custom_fields: TemplateBuilderWithCustomFields,
    allowed_fields: TemplateBuilderWithAllowedFields,
    custom_styles: TemplateBuilderWithCustomStyles,
    preview_mode: TemplateBuilderWithPreviewMode,
    multi_language: TemplateBuilderWithMultiLanguage,
    defined_signer_roles: TemplateBuilderWithDefinedSignerRoles,
  };

  return React.createElement(customBuilders[templateType] || DocusealBuilder, baseProps);
};

export default TemplateBuilder;
