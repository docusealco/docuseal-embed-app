import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DocusealBuilder } from '@docuseal/react';

const SubmissionShowPage = () => {
  const { id: submissionId } = useParams();
  const [token, setToken] = useState();

  useEffect(() => {
    fetch(`/api/submissions/${submissionId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setToken(data.token);
      }).catch((error) => {
        console.error('Error:', error);
      })
  }, []);

  if (token){
    return (
      <DocusealBuilder
        token={token}
        preview={true}
        withSendButton={false}
        withSignYourselfButton={false}
      />
    );
  }
}

export default SubmissionShowPage;
