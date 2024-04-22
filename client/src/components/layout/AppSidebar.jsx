import { FaHome } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { BiSolidCustomize } from "react-icons/bi";
import { Link } from "react-router-dom";

const AppSidebar = () => {
  const templateBuilders = [
    {
      name: "Builder 1",
      param: "type=fields"
    },
    {
      name: "Builder 2",
      param: "type=fieldTypes"
    },
    {
      name: "Builder 3",
      param: "type=customCss"
    },
    {
      name: "Builder 4",
      param: "type=preview"
    },
    {
      name: "Builder 5",
      param: "type=language"
    },
    {
      name: "Builder 6",
      param: "type=roles"
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
          <ul className="border-l border-gray-100 ml-5">
            {templateBuilders.map((builder) => (
              <li key={builder.name}>
                <Link to={`/templates/new?${builder.param}`}>
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
