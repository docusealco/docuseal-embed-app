import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageLoader } from "../../ui";
import TemplateBuilder from "./components/TemplateBuilder";

const TemplateNewPage = () => {
  const formRef = useRef(null);
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const templateType = searchParams.get("type");
  const navigate = useNavigate();

  useEffect(() => {
    if (templateType) {
      loadDemoTemplate();
    } else {
      setToken(null);
    }
  }, [templateType]);

  const loadDemoTemplate = () => {
    setLoading(true);

    fetch("/api/templates/demo", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setToken(data.token);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleTemplateCreate = (e) => {
    e.preventDefault();

    setSubmitting(true);

    const formData = new FormData(formRef.current);

    fetch(`/api/templates`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name: formData.get("name") }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setSubmitting(false);
            setToken(data.token);
            setTemplate(data.template);
          });
        } else {
          response.json().then(() => {
            setSubmitting(false);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubmitting(false);
      });
  };

  const handleTemplateSave = (data) => {
    fetch("/api/templates", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ template_id: template.id, external_id: data.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        navigate(`/templates/${data.template.id}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (loading) {
    return <PageLoader />;
  } else if (token) {
    return (
      <div
        key={Math.random()}
        className="bg-slate-50 rounded-box border border-slate-300 border-1 overflow-y-hidden"
      >
        <TemplateBuilder
          templateType={templateType}
          autosave={false}
          withSendButton={false}
          withSignYourselfButton={false}
          token={token}
          onSave={handleTemplateSave}
          style={{ maxHeight: "calc(-90px + 100vh)", display: "block" }}
        />
      </div>
    );
  } else {
    return (
      <div className="bg-slate-50 rounded-box p-6 border border-slate-300 border-1 max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-4">New Document Template</h1>
        <form ref={formRef} onSubmit={handleTemplateCreate} autoComplete="off">
          <div className="form-control mt-6">
            <input
              required={true}
              placeholder="Enter document name"
              className="input input-lg w-full"
              dir="auto"
              type="text"
              name="name"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-white no-animation w-full uppercase text-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }
};

export default TemplateNewPage;
