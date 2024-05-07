import React, { useState, useEffect } from 'react';
import { DocusealBuilder } from '@docuseal/react';
import { useNavigate, useSearchParams } from "react-router-dom";

const TemplateNewPage = () => {
  const [token, setToken] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  let builderProps = {
    defined_fields: {
      fields: [
        { "name": "First Name", "type": "text" },
        { "name": "Last Name", "type": "text" }
      ],
    },
    allowed_fields: {
      fieldTypes: ['text', 'date', 'signature', 'initials']
    },
    custom_styles: {
      customCss: `
        #sign_yourself_button { background-color: #FFA500; }
        #send_button { background-color: #87CEEB; }
        #main_container { background-color: #dff7fe; }
      `
    },
    preview_mode: {
      preview: true
    },
    non_english_language: {
      language: ['es', 'de', 'fr', 'pt', 'he', 'ar'][Math.floor(Math.random() * 6)]
    },
    defined_role_names: {
      roles: ['Signer', 'Approver']
    }
  }[searchParams.get('type')]

  builderProps ||= {
    autosave: false,
    withSendButton: false,
    withSignYourselfButton: false,
    backgroundColor: '#e5e9f0',
  };

  useEffect(() => {
    fetch('/api/templates/new', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setToken(data.token);
      }).catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleTemplateSave = (data) => {
    fetch('/api/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ template_id: data.id })
    }).then((response) => response.json())
      .then((data) => {
        navigate(`/templates/${data.template.id}`);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div key={Math.random()} className="border-1 border-info-content max-h-[calc(85vh)] overflow-y-hidden">
      {token &&  (
        <DocusealBuilder
          token={token}
          onSave={handleTemplateSave}
          {...builderProps}
        />)
      }
    </div>
  );
}

export default TemplateNewPage;
