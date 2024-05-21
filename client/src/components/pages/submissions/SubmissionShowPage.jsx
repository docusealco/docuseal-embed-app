import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DocusealForm } from '@docuseal/react';
import { PageLoader } from '../../ui';

const SubmissionShowPage = () => {
  const { id: submissionId } = useParams();
  const [submitters, setSubmitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/submissions/${submissionId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setSubmitters(data.submitters || []);
        setLoading(false);
      }).catch((error) => {
        console.error('Error:', error);
      })
  }, []);

  if (loading) {
    return <PageLoader />;
  } else if (submitters.length > 0) {
    return (
      <DocusealForm
        src={`${process.env.REACT_APP_DOCUSEAL_URL}/d/${submitters[submitters.length - 1].slug}`}
        style={{ height: "calc(100vh - 8rem)" }}
        preview={true}
      />
    );
  } else {
    return (
      <div className="hero h-1/3 rounded-box py-12">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Not Found</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default SubmissionShowPage;
