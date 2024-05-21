import React, { useState, useRef, useEffect } from 'react';
import { DocusealBuilder } from '@docuseal/react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageLoader } from '../../ui';

const TemplateNewPage = () => {
  const formRef = useRef(null);
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [templateName, setTemplateName] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const templateType = searchParams.get('type');
  const navigate = useNavigate();

  const customTemplateProps = {
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
  };

  const builderProps = customTemplateProps[templateType] || {
    autosave: false,
    withSendButton: false,
    withSignYourselfButton: false,
  };

  useEffect(() => {
    if (templateType) {
      loadDemoTemplate();
    } else {
      setToken(null);
    }
  }, [templateType]);

  const loadDemoTemplate = () => {
    setLoading(true);

    fetch('/api/templates/demo', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setToken(data.token);
        setLoading(false);
      }).catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      })
  }

  const handleTemplateCreate = (e) => {
    e.preventDefault();

    setSubmitting(true);

    const formData = new FormData(formRef.current);

    fetch(`/api/templates`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      method: "POST",
      body: JSON.stringify({ name: formData.get('name') })
    })
    .then((response) => {
      if (response.ok) {
         response.json().then((data) => {
            setSubmitting(false);
            setToken(data.token);
          });
      } else {
        response.json().then((data) => {
          setSubmitting(false);
        })
      }
    })
    .catch((error) => {
      setSubmitting(false);
    });
  };

  const handleTemplateSave = (data) => {
    fetch('/api/templates', {
      method: 'PATCH',
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

  if (loading) {
    return <PageLoader />;
  } else if (token) {
    return (
      <div
        key={Math.random()}
        className="border-1 border-info-content overflow-y-hidden"
        style={{ height: "calc(100vh - 8rem)" }}
      >
        <DocusealBuilder
          token={token}
          onSave={handleTemplateSave}
          templateName={templateName}
          {...builderProps}
        />
      </div>
    );
  } else {
    return (
      <div>
        <h1 className="text-2xl font-extrabold mb-4">New Document Template</h1>
        <form ref={formRef} onSubmit={handleTemplateCreate} autoComplete="off">
          <div className="form-control mt-6">
            <input
              required={true}
              placeholder="Enter document name"
              className="input input-lg w-full"
              dir="auto"
              type="text"
              name="name"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-white no-animation w-full uppercase text-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default TemplateNewPage;
