import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLoader } from "../../ui";

const SubmissionNewPage = () => {
  const formRef = useRef(null);
  const { id: templateId } = useParams();
  const [template, setTemplate] = useState();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emailOptionsVisible, setEmailOptionsVisible] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/templates/${templateId}/submissions/new`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setTemplate(data.template || {});
            setLoading(false);
          });
        } else {
          response.json().then((data) => {
            setFormError(data.error);
            setLoading(false);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const parseFormData = (formData) => {
    const result = {};

    for (const [key, value] of formData.entries()) {
      const parts = key
        .split(".")
        .map((part) => part.replace(/\[(\d+)\]/, "$1"));

      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const match = part.match(/^(\D+)(\d+)$/);

        if (match) {
          const name = match[1];
          const index = parseInt(match[2], 10);

          if (!current[name]) {
            current[name] = []; // Якщо масив ще не створений
          }

          if (!current[name][index]) {
            current[name][index] = {};
          }

          if (isLast) {
            current[name][index] = value;
          } else {
            current = current[name][index];
          }
        } else {
          if (isLast) {
            current[part] = value;
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        }
      }
    }

    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitting(true);

    const formData = new FormData(formRef.current);
    const formDataObject = parseFormData(formData);

    fetch(`/api/templates/${templateId}/submissions`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify(formDataObject),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then(() => {
            setSubmitting(false);
            navigate(`/templates/${templateId}`);
          });
        } else {
          response.json().then((data) => {
            setFormError(data.error);
            setSubmitting(false);
          });
        }
      })
      .catch((error) => {
        setFormError(error);
        setSubmitting(false);
      });
  };

  const handleEditMessage = (e) => {
    e.preventDefault();

    setEmailOptionsVisible(!emailOptionsVisible);
  };

  if (loading) {
    return <PageLoader />;
  } else {
    const emailSubject = "You are invited to submit a form";
    const emailBody =
      "Hi there,\n\nYou have been invited to submit the \"{{template.name}}\" form.\n\n{{submitter.link}}\n\nPlease contact us by replying to this email if you didn't request this.\n\nThanks,\n'{{account.name}}'";

    return (
      <div
        className="bg-slate-50 rounded-box p-6 border border-slate-300  max-w-2xl mx-auto"
        style={{ maxHeight: "calc(-90px + 100vh)", overflow: "auto" }}
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold mb-4">
              Add Recipients for "{template.name}"
            </h1>
          </div>
          {formError && (
            <div className="alert bg-red-400 text-white mb-4">{formError}</div>
          )}
          <div
            className={`grid ${
              template.submitters.length > 1 ? "md:grid-cols-2" : ""
            } gap-4`}
          >
            {template.submitters.map((item, index) => (
              <div className="form-control" key={item.uuid}>
                {template.submitters.length > 1 ? (
                  <label className="label pt-0 pb-1 text-xs">
                    <span className="label-text">{item.name}</span>
                  </label>
                ) : null}
                <input
                  type="hidden"
                  name={`submission.submitters[${index}].role`}
                  value={item.name}
                />
                <div data-field="name">
                  <input
                    type="text"
                    name={`submission.submitters[${index}].name`}
                    autoComplete="off"
                    className="input input-sm input-bordered w-full"
                    placeholder="Name"
                    required={index === 0}
                    dir="auto"
                  />
                </div>
                <div
                  className={`grid ${
                    template.submitters.length === 1
                      ? "md:grid-cols-2 gap-1"
                      : ""
                  }`}
                >
                  <input
                    type="email"
                    multiple
                    name={`submission.submitters[${index}].email`}
                    autoComplete="off"
                    className="input input-sm input-bordered mt-1.5 w-full"
                    placeholder="Email (optional)"
                  />
                  <input
                    type="tel"
                    pattern="^\+[0-9\s\-]+$"
                    name={`submission.submitters[${index}].phone`}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Use internatioanl format: +1xxx..."
                      )
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    autoComplete="off"
                    className="input input-sm input-bordered mt-1.5 w-full"
                    placeholder="Phone (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="form-control">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="submission.send_email"
                    className="checkbox rounded bg-white checkbox-sm no-animation"
                    defaultChecked
                  />
                  <span className="label">Send emails</span>
                </label>
              </div>
              <button className="link-primary" onClick={handleEditMessage}>
                Edit message
              </button>
            </div>
            {emailOptionsVisible && (
              <div className="card card-compact bg-base-200">
                <div className="card-body">
                  <div className="form-control space-y-2">
                    <div className="form-control">
                      <label className="label">Subject</label>
                      <input
                        type="text"
                        name="message.subject"
                        className="input input-sm input-bordered w-full"
                        defaultValue={emailSubject}
                      />
                    </div>
                    <div className="form-control">
                      <div className="flex items-center">
                        <label className="label">Body</label>
                      </div>
                      <textarea
                        name="message.body"
                        className="textarea textarea-bordered w-full"
                        defaultValue={emailBody}
                        rows={10}
                        dir="auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-white no-animation w-full uppercase text-lg"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    );
  }
};

export default SubmissionNewPage;
