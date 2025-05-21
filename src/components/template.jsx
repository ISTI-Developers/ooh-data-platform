import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { Modal } from "flowbite-react";
import { RouteDisplay } from "~misc/RouteDisplay";
import Legend from "./legend";
import Backlits from "./Backlits";
import Parapets from "./Parapets";
import parapet_pic from "../assets/parapet_pic.jpg";
import backlit_pic from "../assets/backlit_pic.jpg";
import { useStations } from "~config/LRTContext";

const Template = ({
  station_name,
  backLitsSB,
  backLitsNB,
  parapetSB,
  parapetNB,
  SBentryExitButton,
  NBentryExitButton,
  southBound,
  northBound,
  handleSouthClick,
  handleNorthClick,
  stations,
  currentStationId,
  onChange,
}) => {
  const { queryAssetContracts, contracts, fetchContracts } = useStations();
  const [isParapet, setIsParapet] = useState(false);

  const [isBacklit, setIsBacklit] = useState(false);
  const [selectedBacklit, setSelectedBacklit] = useState(null);

  const handleParapetClick = () => {
    setIsParapet(true);
  };

  const closeParapet = () => {
    setIsParapet(false);
  };

  const handleBacklitClick = (backlit) => {
    setSelectedBacklit(backlit);
    setIsBacklit(true);
  };

  const closeBacklit = () => {
    setIsBacklit(false);
  };
  const matchedContract = queryAssetContracts?.find((contract) => contract.backlit_id === selectedBacklit?.asset_id);
  const matchedContractFinal = contracts?.find(
    (contract) => contract.SalesOrderCode === matchedContract?.asset_sales_order_code
  );
  const SBbookable = parapetSB.filter((item) => item.asset_status === "AVAILABLE").length;
  const NBbookable = parapetNB.filter((item) => item.asset_status === "AVAILABLE").length;
  useEffect(() => {
    fetchContracts(1, 10000);
  }, []);
  return (
    <div>
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <select
            name="station"
            id="station-select"
            value={currentStationId}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="py-2 px-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            {stations.map((station) => (
              <option key={station.station_id} value={station.station_id}>
                {station.station_name}
              </option>
            ))}
          </select>
        </div>

        {/* Centered Station Name */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-center">
          {station_name} Station
        </h1>
      </div>

      <hr className="h-[3px] bg-black border-none" />
      <h1 className="text-2xl font-bold text-center">SOUTH BOUND</h1>

      <Backlits direction="SOUTH" backlitData={backLitsSB} icon="▲" onClick={handleBacklitClick} />

      <Parapets
        direction="SOUTH"
        parapetData={parapetSB}
        entryExitIndexes={SBentryExitButton}
        onClick={handleParapetClick}
      />
      {SBbookable ? (
        <p className="bg-green-100 text-green-800 font-medium px-4 py-2 rounded-md text-center shadow-md my-4">
          South Bound Parapets that can be booked: {SBbookable}
        </p>
      ) : null}

      <div className="w-full flex justify-center my-4">
        <RouteDisplay
          SouthBound={southBound}
          NorthBound={northBound}
          handleNorth={handleNorthClick}
          handleSouth={handleSouthClick}
        />
      </div>
      {NBbookable ? (
        <p className="bg-green-100 text-green-800 font-medium px-4 py-2 rounded-md text-center shadow-md my-4">
          North Bound Parapets that can be booked: {NBbookable}
        </p>
      ) : null}

      <Parapets
        direction="NORTH"
        parapetData={parapetNB}
        entryExitIndexes={NBentryExitButton}
        onClick={handleParapetClick}
      />

      <Backlits direction="NORTH" backlitData={backLitsNB} icon="▼" onClick={handleBacklitClick} />

      <h1 className="text-2xl font-bold text-center">NORTH BOUND</h1>
      <hr className="h-[3px] bg-black border-none" />
      <Legend />

      <Modal show={isParapet} onClose={closeParapet} size="xl" popup dismissible>
        <Modal.Body className="relative flex justify-center items-center p-0">
          {/* Close Button (top-right corner) */}
          <button
            onClick={closeParapet}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>

          {/* Image */}
          <img src={parapet_pic} alt="Parapet" className="max-h-[80vh] w-auto rounded-lg shadow-lg" />
        </Modal.Body>
      </Modal>

      <Modal show={isBacklit} onClose={closeBacklit} size="xl" popup dismissible>
        <Modal.Body>
          <div className="w-full max-w-xl p-4 relative">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {station_name}
                {!matchedContractFinal && " - " + selectedBacklit?.asset_distinction}
              </h2>
            </div>
            {matchedContractFinal ? (
              <>
                <h3 className="text-lg text-gray-600 mt-1">{selectedBacklit?.asset_distinction} Backlit Details</h3>
                <div className="space-y-3 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Sales Order Code:</span>
                    <span className="text-gray-900">{matchedContractFinal.SalesOrderCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Start Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(matchedContractFinal.DateRef1), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">End Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(matchedContractFinal.DateRef2), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Owner:</span>
                    <span className="text-gray-900">{matchedContractFinal.DebtorName} </span>
                  </div>
                  <div className="pt-4 text-right">
                    <button
                      onClick={closeBacklit}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative flex justify-center items-center">
                <button
                  onClick={closeBacklit}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
                <img src={backlit_pic} alt="Backlit" className="max-h-[70vh] w-auto rounded-lg shadow-lg" />
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

Template.propTypes = {
  station_id: PropTypes.number.isRequired,
  station_name: PropTypes.string.isRequired,
  backLitsSB: PropTypes.array,
  backLitsNB: PropTypes.array,
  parapetSB: PropTypes.array,
  parapetNB: PropTypes.array,
  SBentryExitButton: PropTypes.array,
  NBentryExitButton: PropTypes.array,
  southBound: PropTypes.string,
  northBound: PropTypes.string,
  handleSouthClick: PropTypes.func,
  handleNorthClick: PropTypes.func,
  onParapetClick: PropTypes.func,
  currentStationId: PropTypes.number.isRequired,
  stations: PropTypes.array,
  onChange: PropTypes.func,
};

export default Template;
