import React, { useState, useEffect } from 'react';
import { DocusealBuilder } from '@docuseal/react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { PageLoader } from '../../ui';

const TemplateEditPage = () => {
  const { id: templateId } = useParams();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/templates/${templateId}/edit`, {
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
  }, []);

  const handleTemplateSave = (data) => {
    fetch('/api/templates', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ template_id: templateId, external_id: data.id })
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
        className="bg-slate-50 rounded-box border border-slate-300 border-1 overflow-y-hidden"
      >
        <DocusealBuilder
          token={token}
          autosave={false}
          onSave={handleTemplateSave}
          style={{ maxHeight: 'calc(-90px + 100vh)', display: 'block' }}
          />
      </div>
    );
  };
}

export default TemplateEditPage;
