import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DocusealForm } from '@docuseal/react';

const SubmitterSignPage = () => {
  const { id: submitterId } = useParams();
  const [submitter, setSubmitter] = useState({});

  useEffect(() => {
    fetch(`/api/sign/${submitterId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setSubmitter(data.submitter || {});
      }).catch((error) => {
        console.error('Error:', error);
      })
  }, []);

  if (submitter.slug) {
    return (
      <DocusealForm
        src={`${process.env.REACT_APP_DOCUSEAL_URL}/d/${submitter.slug}`}
        email={submitter.email}
      />
    );
  }
}

export default SubmitterSignPage;
