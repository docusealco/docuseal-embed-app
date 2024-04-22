import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TemplateNewPage from "../pages/templates/TemplateNewPage";
import TemplateShowPage from "../pages/templates/TemplateShowPage";
import TemplatesIndexPage from "../pages/templates/TemplatesIndexPage";
import SubmitterSignPage from "../pages/submitters/SubmitterSignPage";
import SubmissionShowPage from "../pages/submissions/SubmissionShowPage";
import SubmissionNewPage from "../pages/submissions/SubmissionNewPage";

const AppRoutes = () => {
  const routes = [
    {
      path: "/",
      component: <DashboardPage />,
      key: "home_page",
    },
    {
      path: "/templates",
      component: <TemplatesIndexPage />,
      key: "templates_index_page",
    },
    {
      path: "/templates/:id",
      component: <TemplateShowPage />,
      key: "templates_show_page",
    },
    {
      path: "/templates/new",
      component: <TemplateNewPage />,
      key: "template_new_page",
    },
    {
      path: "/templates/:id/submissions/new",
      component: <SubmissionNewPage />,
      key: "submission_new_page",
    },
    {
      path: "/sign/:id",
      component: <SubmitterSignPage />,
      key: "submitter_sign_page",
    },
    {
      path: "/submissions/:id",
      component: <SubmissionShowPage />,
      key: "submission_show_page",
    },
    {
      path: "*",
      component: <Navigate to="/" />,
      key: "undefined_page",
    },
  ];

  const routeComponents = routes.map((item) => {
    return (
      <Route
        exact="true"
        path={item.path}
        element={item.component}
        key={item.key}
      />
    );
  });

  return <Routes>{routeComponents}</Routes>;
};

export default AppRoutes;
