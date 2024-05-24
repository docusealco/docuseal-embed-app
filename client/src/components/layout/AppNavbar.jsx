import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

const AppNavbar = () => {
  return (
    <div className="navbar bg-base-200 justify-between">
      <span className="btn btn-ghost text-xl no-animation">Demo Project</span>
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/docusealco/docuseal-embed-app"
          className="btn btn-neutral btn-outline inline-flex items-center justify-center uppercase  no-animation"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub className="w-6 h-6" />
          View on Github
        </a>
        <Link
          to="/templates/new"
          className="btn bg-green-500 border-green-500 text-white no-animation hover:bg-green-400 hover:border-green-400"
        >
          New Template
        </Link>
      </div>
    </div>
  );
};

export default AppNavbar;
