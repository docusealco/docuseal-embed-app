import React, { useState, useEffect } from "react";
import ReactDOMServer from 'react-dom/server';
import { useParams } from "react-router-dom";
import { DocusealForm } from "@docuseal/react";
import { PageLoader, LogoPlaceholder } from "../../ui";

const SubmissionShowPage = () => {
  const { id: submissionId } = useParams();
  const [submitters, setSubmitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/submissions/${submissionId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubmitters(data.submitters || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  if (loading) {
    return <PageLoader />;
  } else if (submitters.length > 0) {
    const submitter = submitters[submitters.length - 1];

    return (
      <div
        className="bg-slate-50 rounded-box border border-slate-300"
        style={{ maxHeight: "calc(-90px + 100vh)", overflow: "auto" }}
      >
        <DocusealForm
          host={process.env.REACT_APP_DOCUSEAL_CDN_HOST}
          src={`${process.env.REACT_APP_DOCUSEAL_URL}/s/${submitter.slug}`}
          rememberSignature={true}
          externalId={submitter.app_id}
          preview={true}
          logo={`data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToString(<LogoPlaceholder />)).replace('\n', '')}`}
        />
      </div>
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
};

export default SubmissionShowPage;
