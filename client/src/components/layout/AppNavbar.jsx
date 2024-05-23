import { Link } from "react-router-dom";

const AppNavbar = () => {
  return (
    <div className="navbar bg-base-200 justify-between">
      <span className="btn btn-ghost text-xl no-animation">Demo Project</span>
      <Link
        to="/templates/new"
        className="btn bg-green-500 border-green-500 text-white no-animation hover:bg-green-400 hover:border-green-400"
      >
        New Template
      </Link>
    </div>
  );
};

export default AppNavbar;
