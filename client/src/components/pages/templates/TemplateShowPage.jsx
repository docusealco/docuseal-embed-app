import React, { useState, useEffect } from 'react';
import { PageLoader, ClipboardBoard } from '../../ui';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";

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
            {template.slug && <Link to={`/templates/${templateId}/submissions/new`} className="btn btn-primary text-white no-animation">New Submission</Link>}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="bg-slate-50 rounded-box p-6 border border-slate-300" style={{maxHeight: 'calc(-90px + 100vh)', overflow: 'auto' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold">{ template.name }</h1>
          <div className="flex gap-2">
            <Link to={`/templates/${templateId}/submissions/new`} className="btn btn-sm btn-primary text-white no-animation">New Submission</Link>
            <Link to={`/templates/${templateId}/edit`} className="btn btn-sm btn-accent text-white no-animation">
              <MdEdit />
              Edit
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {submissions.map((submission, index) => {
            return (
              <div className="card card-compact w-full bg-base-100 border border-base-300" key={`submission-${index}`}>
                <div className="card-body">
                  <div className="flex gap-2 items-start justify-between">
                    <div className="flex flex-col flex-grow gap-2">
                      {submission.submitters.map((submitter, index) => {
                        return (
                          <div className="flex items-center justify-between flex-grow" key={`submitter-${index}`}>
                            <div className='flex items-centers space-x-2'>
                              <span className='badge badge-accent font-bold text-white'>{submitter.status}</span>
                              <span>{submitter.email}</span>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <ClipboardBoard
                                text="Copy Link"
                                copyText={`${document.location.origin}/sign/${submitter.id}`}
                                className="btn btn-sm btn-info text-white no-animation"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Link to={`/submissions/${submission.id}`} className="btn btn-sm btn-secondary text-white no-animation">View</Link>
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
