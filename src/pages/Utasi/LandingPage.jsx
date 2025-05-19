import { FaTrain, FaBus, FaBan } from "react-icons/fa";
import { MdFlight } from "react-icons/md";
import { useState } from "react";
import LRTAssets from "./LRTAssets";
import PropTypes from "prop-types";
import { FaArrowLeft } from "react-icons/fa";
import { useStations } from "~config/LRTContext";
const LandingPage = ({ backToContracts }) => {
  const [selectedTransport, setSelectedTransport] = useState(null);
  const { attachedContract } = useStations();

  const transportOptions = [
    {
      icon: <FaTrain size={50} />,
      label: "LRT",
      status: "active",
      component: <LRTAssets onBack={() => setSelectedTransport(null)} />,
    },
    { icon: <MdFlight size={50} />, label: "MCIA", status: "inactive" },
    { icon: <FaBus size={50} />, label: "PITX", status: "inactive" },
  ];

  return (
    <>
      {selectedTransport ? (
        <>{selectedTransport}</>
      ) : (
        <>
          {attachedContract && (
            <div className="mb-4">
              <button onClick={backToContracts} className="flex items-center px-4 py-2 rounded hover:bg-gray-400">
                <FaArrowLeft />
                Back
              </button>
            </div>
          )}
          <div className="container flex items-center justify-center">
            <div className="flex space-x-6">
              {transportOptions.map((item, index) => (
                <div key={index} className="relative">
                  <div
                    className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md w-48 h-64 cursor-pointer ${
                      item.status === "inactive" ? "bg-blue-100 opacity-50 filter blur-sm pointer-events-none" : "bg-blue-100 hover:bg-blue-200 transition"
                    }`}
                    onClick={() => item.status === "active" && setSelectedTransport(item.component)}
                  >
                    {item.icon}
                    <p className="font-bold mt-2">{item.label}</p>
                  </div>

                  {item.status === "inactive" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaBan className="text-red-600 text-5xl bg-white p-2 rounded-full shadow-lg" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
LandingPage.propTypes = {
  backToContracts: PropTypes.func,
};
export default LandingPage;
