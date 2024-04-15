import React, { useState, useEffect } from 'react';
import { DocusealBuilder } from '@docuseal/react';

const TemplateNewPage = () => {
  const [token, setToken] = useState();

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
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="border-1 border-info-content">
      {token &&  (
        <DocusealBuilder
          token={token}
          onSave={handleTemplateSave}
          autosave={false}
          withSignYourselfButton={false}
        />)
      }
    </div>
  );
}

export default TemplateNewPage;
