import React, { useState, useEffect } from 'react';
import { PageLoader, ClipboardBoard } from '../../ui';
import { useParams } from 'react-router-dom';

const TemplateShowPage = () => {
  const { id: templateId } = useParams();
  const [template, setTemplate] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/templates/${templateId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setTemplate(data.template || {});
        setSubmissions(data.submissions || []);
        setLoading(false);
      }).catch((error) => {
        console.error('Error:', error);
      })
  }, []);

  if (loading) {
    return <PageLoader />;
  } else if (submissions.length === 0) {
    return (
      <div className="hero py-12 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold">No submissions found</h1>
            <p className="py-6">Unfortunately, there are no submissions available at the moment.</p>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold mb-4">{ template.name }</h1>
        </div>
        <div className="grid gap-4">
          {submissions.map((submission) => {
            return (
              <div className="card card-compact w-full bg-base-100 border border-base-300">
                <div className="card-body">
                  <div className="flex gap-1 justify-between">
                    {submission.submitters.map((submitter) => {
                      return (
                        <div className="flex items-center justify-between flex-grow">
                          <div className='flex items-centers space-x-2'>
                            <span className='badge badge-accent font-bold text-white'>{submitter.status}</span>
                            <span>{submitter.email}</span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <ClipboardBoard
                              text="Copy Link"
                              copyText={`${document.location.origin}/sign/${submitter.id}`}
                              className="btn btn-sm btn-info text-white"
                            />
                          </div>
                        </div>
                      );
                    })}
                    <a href={`/submissions/${submission.id}`} className='btn btn-sm btn-secondary text-white'>View</a>
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

export default TemplateShowPage;
