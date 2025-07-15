import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { Modal } from "flowbite-react";
import { RouteDisplay } from "~misc/RouteDisplay";
import Legend from "./legend";
import Backlits from "./Backlits";
import Parapets from "./Parapets";
import TicketBooth from "./TicketBooth.jsx";
import Stairs from "./Stairs";
import { SWS, NWS, SES, NES, SBS, NBS } from "../pages/Utasi/utasi.const";

import parapet_pic from "../assets/parapet_pic.png";
import backlit_pic from "../assets/backlit_pic.jpg";
import tb_pic from "../assets/tb_pic.png";
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
  sbTop,
  sbMid,
  sbBelow,
  nbTop,
  nbMid,
  nbBelow,
  sbStairs,
  nbStairs,
}) => {
  const { queryAssetContracts, fetchContracts } = useStations();
  const [isParapet, setIsParapet] = useState(false);
  const [selectedParapet, setSelectedParapet] = useState(null);

  const [isBacklit, setIsBacklit] = useState(false);
  const [selectedBacklit, setSelectedBacklit] = useState(null);

  const [isTB, setIsTB] = useState(false);
  const [selectedTB, setSelectedTB] = useState(null);

  const [isStairs, setIsStairs] = useState(false);
  const [selectedStairs, setSelectedStairs] = useState(null);

  const handleParapetClick = (pp) => {
    setIsParapet(true);
    setSelectedParapet(pp);
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
  const handleTicketBoothClick = (tb) => {
    setSelectedTB(tb);
    setIsTB(true);
  };
  const handleStairsClick = (tb) => {
    setSelectedStairs(tb);
    setIsStairs(true);
  };
  const closeTB = () => {
    setIsTB(false);
  };
  const closeStairs = () => {
    setIsStairs(false);
  };
  const matchedContract = queryAssetContracts?.find((contract) => contract.backlit_id === selectedBacklit?.asset_id);
  const matchedContractTB = queryAssetContracts?.find((contract) => contract.ticketbooth_id === selectedTB?.asset_id);
  const matchedContractStairs = queryAssetContracts?.find(
    (contract) => contract.stairs_id === selectedStairs?.asset_id
  );
  const updatedBacklitsNB = backLitsNB.map((backlit) => {
    const matchedContract = queryAssetContracts?.find((contract) => contract.backlit_id === backlit.asset_id);
    return {
      ...backlit,
      asset_text: matchedContract?.brand_owner || null,
    };
  });

  const updatedBacklitsSB = backLitsSB.map((backlit) => {
    const matchedContract = queryAssetContracts?.find((contract) => contract.backlit_id === backlit.asset_id);
    return {
      ...backlit,
      asset_text: matchedContract?.brand_owner || null,
    };
  });

  const updatedStairsNB = nbStairs.map((stair) => {
    const matchedContract = queryAssetContracts?.find((contract) => contract.stairs_id === stair.asset_id);
    return {
      ...stair,
      asset_text: matchedContract?.brand_owner || null,
    };
  });
  const updatedStairsSB = sbStairs.map((stair) => {
    const matchedContract = queryAssetContracts?.find((contract) => contract.stairs_id === stair.asset_id);
    return {
      ...stair,
      asset_text: matchedContract?.brand_owner || null,
    };
  });
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
      <Stairs
        direction="SOUTH"
        stairsData={updatedStairsSB}
        activeSpots={sbStairs?.map((stair) => stair.position_index)}
        onClick={handleStairsClick}
        icon="▲"
      />
      <TicketBooth
        direction="SOUTH"
        ticketBoothData={sbTop}
        activeSpots={sbTop?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▲"
      />
      <Backlits direction="SOUTH" backlitData={updatedBacklitsSB} icon="▲" onClick={handleBacklitClick} />
      <TicketBooth
        direction="SOUTH"
        ticketBoothData={sbMid}
        activeSpots={sbMid?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▲"
      />
      <Parapets
        direction="SOUTH"
        parapetData={parapetSB}
        entryExitIndexes={SBentryExitButton}
        onClick={handleParapetClick}
      />
      <TicketBooth
        direction="SOUTH"
        ticketBoothData={sbBelow}
        activeSpots={sbBelow?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▲"
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
      <TicketBooth
        direction="NORTH"
        ticketBoothData={nbBelow}
        activeSpots={nbBelow?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▼"
      />
      <Parapets
        direction="NORTH"
        parapetData={parapetNB}
        entryExitIndexes={NBentryExitButton}
        onClick={handleParapetClick}
      />
      <TicketBooth
        direction="NORTH"
        ticketBoothData={nbMid}
        activeSpots={nbMid?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▼"
      />
      <Backlits direction="NORTH" backlitData={updatedBacklitsNB} icon="▼" onClick={handleBacklitClick} />
      <TicketBooth
        direction="NORTH"
        ticketBoothData={nbTop}
        activeSpots={nbTop?.map((booth) => booth.position_index)}
        icon="▼"
        onClick={handleTicketBoothClick}
      />
      <Stairs
        direction="NORTH"
        stairsData={updatedStairsNB}
        activeSpots={nbStairs?.map((stair) => stair.position_index)}
        onClick={handleStairsClick}
        icon="▼"
      />
      <h1 className="text-2xl font-bold text-center">NORTH BOUND</h1>
      <hr className="h-[3px] bg-black border-none" />
      <Legend />

      <Modal show={isParapet} onClose={closeParapet} size="xl" popup dismissible>
        <Modal.Body>
          <div className="w-full max-w-xl p-4 relative">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {station_name}
                {!matchedContract && " - " + selectedParapet?.asset_distinction}
              </h2>
            </div>
            <button
              onClick={closeParapet}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <img src={parapet_pic} alt="Parapet" className="max-h-[70vh] w-auto rounded-lg shadow-lg" />
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isBacklit} onClose={closeBacklit} size="xl" popup dismissible>
        <Modal.Body>
          <div className="w-full max-w-xl p-4 relative">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {station_name}
                {!matchedContract && " - " + selectedBacklit?.asset_distinction}
              </h2>
            </div>
            {matchedContract ? (
              <>
                <h3 className="text-lg text-gray-600 mt-1">{selectedBacklit?.asset_distinction} Backlit Details</h3>
                <div className="space-y-3 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Sales Order Code:</span>
                    <span className="text-gray-900">{matchedContract.asset_sales_order_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Start Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(matchedContract.asset_date_start), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">End Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(matchedContract.asset_date_end), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Owner:</span>
                    <span className="text-gray-900">{matchedContract.brand_owner} </span>
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
              <>
                <button
                  onClick={closeBacklit}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
                <img src={backlit_pic} alt="Backlit" className="max-h-[70vh] w-auto rounded-lg shadow-lg" />
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isTB} onClose={closeTB} size="xl" popup dismissible>
        <Modal.Body>
          <div className="w-full max-w-xl p-4 relative">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {station_name}
                {!matchedContractTB && " - " + selectedTB?.asset_distinction}
              </h2>
            </div>
            {matchedContractTB ? (
              <>
                <h3 className="text-lg text-gray-600 mt-1">{selectedTB?.asset_distinction} Ticket Booth Details</h3>
                <div className="space-y-3 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Sales Order Code:</span>
                    <span className="text-gray-900">{matchedContractTB.asset_sales_order_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Start Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(matchedContractTB.asset_date_start), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">End Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(matchedContractTB.asset_date_end), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Owner:</span>
                    <span className="text-gray-900">{matchedContractTB.brand_owner} </span>
                  </div>
                  <div className="pt-4 text-right">
                    <button
                      onClick={closeTB}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={closeTB}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
                <img src={tb_pic} alt="TicketBooth" className="max-h-[70vh] w-auto rounded-lg shadow-lg" />
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isStairs} onClose={closeStairs} size="xl" popup dismissible>
        <Modal.Body>
          <div className="w-full max-w-xl p-4 relative">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {station_name}
                {!matchedContractStairs &&
                  (() => {
                    const labels = { SWS, NWS, SES, NES, SBS, NBS };
                    const label = labels[selectedStairs?.asset_distinction];
                    return label ? ` - ${label}` : "";
                  })()}
              </h2>
            </div>
            {matchedContractStairs ? (
              <>
                <h3 className="text-lg text-gray-600 mt-1">{selectedStairs?.asset_distinction} Stairs Details</h3>
                <div className="space-y-3 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Sales Order Code:</span>
                    <span className="text-gray-900">{matchedContractStairs.asset_sales_order_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Start Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(matchedContractStairs.asset_date_start), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">End Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(matchedContractStairs.asset_date_end), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Owner:</span>
                    <span className="text-gray-900">{matchedContractStairs.brand_owner} </span>
                  </div>
                  <div className="pt-4 text-right">
                    <button
                      onClick={closeStairs}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={closeStairs}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </>
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
  sbTop: PropTypes.array,
  sbMid: PropTypes.array,
  sbBelow: PropTypes.array,
  nbTop: PropTypes.array,
  nbMid: PropTypes.array,
  nbBelow: PropTypes.array,
  sbStairs: PropTypes.array,
  nbStairs: PropTypes.array,
};

export default Template;
