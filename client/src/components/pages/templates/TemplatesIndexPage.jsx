import React, { useState, useEffect } from 'react';
import { PageLoader } from '../../ui';

const TemplatesIndexPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch('/api/templates', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setTemplates(data.templates);
        setLoading(false);
      }).catch((error) => {
        console.error('Error:', error);
      })
  }, []);

  if (loading) {
    return <PageLoader />;
  } else if (templates.length === 0) {
    return (
      <div className="hero py-12 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold">No templates found</h1>
            <p className="py-6">Unfortunately, there are no templates available at the moment.</p>
            <a href="templates/new" className="btn btn-primary text-white">New Tempate</a>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <h1 className="text-2xl font-extrabold mb-4">Templates</h1>
        <div className="grid grid-cols-3 gap-4">
          {templates.map((template) => {
            return (
              <div className="card card-compact w-full bg-base-100 border border-base-300">
                <div className="card-body">
                  <h2 className="card-title">{template.name}</h2>
                  <div className="card-actions justify-end">
                    <a href={`/templates/${template.id}`} className="btn btn-secondary text-white w-full">Show</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TemplatesIndexPage;
