import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DocusealForm } from "@docuseal/react";
import { PageLoader } from "../../ui";

const SubmitterSignPage = () => {
  const { slug } = useParams();
  const [submitter, setSubmitter] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/sign/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubmitter(data.submitter || {});
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(true);
      });
  }, []);

  if (loading) {
    return <PageLoader />;
  } else if (submitter.slug) {
    return (
      <div
        className="bg-slate-50 rounded-box border border-slate-300"
        style={{ maxHeight: "calc(-90px + 100vh)", overflow: "auto" }}
      >
        <DocusealForm
          src={`${process.env.REACT_APP_DOCUSEAL_URL}/${
            submitter.id ? "s" : "d"
          }/${submitter.slug}`}
          email={submitter.email}
        />
      </div>
    );
  } else {
    return (
      <div className="hero py-12 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold">Invalid Link</h1>
          </div>
        </div>
      </div>
    );
  }
};

export default SubmitterSignPage;
