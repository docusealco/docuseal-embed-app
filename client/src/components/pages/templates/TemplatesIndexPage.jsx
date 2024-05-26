import React, { useState, useEffect } from "react";
import { PageLoader } from "../../ui";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";

const TemplatesIndexPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch("/api/templates", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTemplates(data.templates);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  if (loading) {
    return <PageLoader />;
  } else if (templates.length === 0) {
    return (
      <div className="hero py-12 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold">No templates found</h1>
            <p className="py-6">
              Unfortunately, there are no templates available at the moment.
            </p>
            <Link
              to="/templates/new"
              className="btn bg-green-500 border-green-500 text-white no-animation hover:bg-green-400 hover:border-green-400"
            >
              New Tempate
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="bg-slate-50 rounded-box p-6 border border-slate-300"
        style={{ maxHeight: "calc(-90px + 100vh)", overflow: "auto" }}
      >
        <h1 className="text-2xl font-extrabold mb-4">Templates</h1>
        <div className="grid grid-cols-3 gap-4">
          {templates.map((template, index) => {
            return (
              <div
                className="card card-compact w-full bg-base-100 border border-base-300"
                key={`template-${index}`}
              >
                <figure className="h-36 overflow-hidden relative">
                  {template.preview_image_url && (
                    <img
                      className="absolute top-0"
                      src={template.preview_image_url}
                      alt={template.name}
                    />
                  )}
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{template.name}</h2>
                  <div className="flex gap-2 justify-between items-center">
                    <Link
                      to={`/templates/${template.id}`}
                      className="btn btn-secondary text-white flex-grow no-animation"
                    >
                      View
                    </Link>
                    <Link
                      to={`/templates/${template.id}/edit`}
                      className="btn btn-accent text-white no-animation"
                    >
                      <MdEdit />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default TemplatesIndexPage;
