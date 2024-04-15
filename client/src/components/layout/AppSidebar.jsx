import { FaHome } from "react-icons/fa";
import { IoDocuments } from "react-icons/io5";
import { Link } from "react-router-dom";

const AppSidebar = () => {
  return (
    <div className="bg-primary w-56 h-screen">
      <div className="flex items-center justify-center">
        <div className="mx-4 py-4 border-b-2 border-white w-full">
          <h1 className="text-xl text-white text-center font-extrabold">
            DocuSeal
          </h1>
        </div>
      </div>
      <ul className="menu text-white text-lg">
        <li>
          <Link to="/">
            <FaHome className="w-5 h=5" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/templates">
            <IoDocuments className="w-5 h=5" />
            Templates
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AppSidebar;
