import { FaHome } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { BiSolidCustomize } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

const CustomLink = ({ to, children, className }) => {
  const location = useLocation();
  const isActive = location.pathname + location.search + location.hash === to;

  return (
    <Link to={to} className={`${className} ${isActive ? "active !text-white font-semibold" : ""}`}>
      {children}
    </Link>
  );
};

const AppSidebar = () => {
  const templateBuilders = [
    {
      name: "Custom Fields",
      param: "type=custom_fields"
    },
    {
      name: "Allowed Fields",
      param: "type=allowed_fields"
    },
    {
      name: "Custom Styles",
      param: "type=custom_styles"
    },
    {
      name: "Preview Mode",
      param: "type=preview_mode"
    },
    {
      name: "Multi-Language",
      param: "type=multi_language"
    },
    {
      name: "Defined Signer Roles",
      param: "type=defined_signer_roles"
    },
  ];

  return (
    <div className="bg-primary w-56 h-screen">
      <div className="flex items-center justify-center">
        <div className="mx-4 py-4 border-b-2 border-white w-full">
          <h1 className="text-xl text-white text-center font-extrabold">
            Embed Demo
          </h1>
        </div>
      </div>
      <ul className="menu text-white text-lg">
        <li>
          <CustomLink to="/">
            <FaHome className="w-5 h=5" />
            Home
          </CustomLink>
        </li>
        <li>
          <CustomLink to="/templates">
            <IoDocuments className="w-5 h=5" />
            Templates
          </CustomLink>
        </li>
        <li>
          <p className="menu-title text-white text-lg flex items-center space-x-3 font-normal">
            <BiSolidCustomize className="w-5 h-5" />
            <span>Builders</span>
          </p>
          <ul className="border-l border-gray-100 ml-5 text-sm">
            {templateBuilders.map((builder) => (
              <li key={builder.name}>
                <CustomLink
                  className="pl-0"
                  to={`/templates/new?${builder.param}`}
                >
                  <FaRegCircleDot className="w-5 h=5" />
                  {builder.name}
                </CustomLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default AppSidebar;
