import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageLoader } from '../../ui';

const SubmissionNewPage = () => {
  const { id: templateId } = useParams();
  const [template, setTemplate] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/templates/${templateId}/submissions/new`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setTemplate(data.template || {});
        setLoading(false);
      }).catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  if (loading) {
    return <PageLoader />;
  } else {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold mb-4">New Submission</h1>
        </div>
        <div>Loaded: {template.name}</div>
      </div>
    );
  }
}

export default SubmissionNewPage;
