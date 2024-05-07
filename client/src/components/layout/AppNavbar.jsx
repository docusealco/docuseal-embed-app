import { Link } from "react-router-dom";

const AppNavbar = () => {
  return (
    <div className="navbar bg-base-200 justify-between">
      <span className="btn btn-ghost text-xl no-animation">Demo Project</span>
      <Link
        to="/templates/new"
        className="btn btn-secondary text-white no-animation"
      >
        New Template
      </Link>
    </div>
  );
};

export default AppNavbar;
