import { FaHome } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { BiSolidCustomize } from "react-icons/bi";
import { Link } from "react-router-dom";

const AppSidebar = () => {
  const templateBuilders = [
    {
      name: "Defined Fields",
      param: "type=defined_fields"
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
      name: "Non-English Language",
      param: "type=non_english_language"
    },
    {
      name: "Defined Role Names",
      param: "type=defined_role_names"
    }
  ];

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
        <li>
          <h2 className="menu-title text-white text-lg flex items-center space-x-3 ">
            <BiSolidCustomize className="w-5 h=5" />
            <span>Builders</span>
          </h2>
          <ul className="border-l border-gray-100 ml-5 text-sm">
            {templateBuilders.map((builder) => (
              <li  key={builder.name}>
                <Link className="pl-0" to={`/templates/new?${builder.param}`}>
                  <FaRegCircleDot className="w-5 h=5" />
                  {builder.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default AppSidebar;
