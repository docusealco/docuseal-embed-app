import React from "react";
import { DocusealBuilder } from "@docuseal/react";

const TemplateBuilderWithCustomStyles = (props) => {
  return (
    <DocusealBuilder
      {...props}
      withSendButton={true}
      withSignYourselfButton={true}
      customCss={`
        #sign_yourself_button { background-color: #FFA500; }
        #send_button { background-color: #87CEEB; }
      `}
    />
  );
};

export default TemplateBuilderWithCustomStyles;
