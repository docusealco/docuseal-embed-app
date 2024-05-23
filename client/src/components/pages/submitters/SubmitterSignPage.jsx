import React from "react";
import { useParams } from "react-router-dom";
import { DocusealForm } from "@docuseal/react";

const SubmitterSignPage = () => {
  const { slug } = useParams();

  return (
    <div
      className="bg-slate-50 rounded-box border border-slate-300"
      style={{ maxHeight: "calc(-90px + 100vh)", overflow: "auto" }}
    >
      <DocusealForm src={`${process.env.REACT_APP_DOCUSEAL_URL}/d/${slug}`} />
    </div>
  );
};

export default SubmitterSignPage;
