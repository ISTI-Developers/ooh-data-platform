import Template from "~components/template";
import { useState, useEffect, useRef } from "react";
import AssetDetailCard from "~/components/details";
import { useStations } from "~config/LRTContext";
import { FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import {
  sb_ticketBooth_top,
  sb_ticketBooth_mid,
  sb_ticketBooth_bot,
  nb_ticketBooth_top,
  nb_ticketBooth_mid,
  nb_ticketBooth_bot,
} from "./utasi.const";
const StationAssets = ({ onBackStations }) => {
  const { stationData, specs, refreshAllStationAssets, refreshSpecifications } = useStations();
  const [currentStationId, setCurrentStationId] = useState(null);
  const componentRef = useRef();
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      await refreshAllStationAssets();
      await refreshSpecifications();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const takeScreenshot = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = currentStation?.station_name + ".png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  useEffect(() => {
    if (stationData.length > 0 && !currentStationId) {
      setCurrentStationId(stationData[0]?.station_id);
    }
  }, [currentStationId, stationData]);

  const handleNextStation = () => {
    const currentIndex = stationData.findIndex((station) => station.station_id === currentStationId);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % stationData.length;
      setCurrentStationId(stationData[nextIndex].station_id);
    }
  };

  const handlePreviousStation = () => {
    const currentIndex = stationData.findIndex((station) => station.station_id === currentStationId);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + stationData.length) % stationData.length;
      setCurrentStationId(stationData[prevIndex].station_id);
    }
  };

  const mergedStations = stationData.map((station) => ({
    ...station,
    details: specs.filter((spec) => spec.station_id === station.station_id),
  }));

  const currentStation = mergedStations.find((station) => station.station_id === currentStationId);
  if (!currentStation) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        {/* Back Button */}
        <button
          onClick={onBackStations}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 active:scale-95 transition"
        >
          <FaArrowLeft />
          Back
        </button>
        {/* Right Action Buttons */}
        <div className="flex gap-3">
          {/* Refresh Button */}
          <button
            onClick={refresh}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white"
            }`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          {/* Screenshot Button */}
          <button
            onClick={takeScreenshot}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition"
          >
            📸 Take Screenshot
          </button>
        </div>
      </div>

      <div ref={componentRef}>
        <Template
          key={currentStation.station_id}
          station_id={currentStation.station_id}
          station_name={currentStation?.station_name || "Sample Station"}
          backLitsSB={currentStation.backlits?.filter((b) => b.asset_distinction.startsWith("SB")) || []}
          backLitsNB={currentStation.backlits?.filter((b) => b.asset_distinction.startsWith("NB")) || []}
          parapetSB={currentStation.parapets?.filter((p) => p.asset_distinction.startsWith("SB")) || []}
          parapetNB={currentStation.parapets?.filter((p) => p.asset_distinction.startsWith("NB")) || []}
          SBentryExitButton={currentStation.south_ee || []}
          NBentryExitButton={currentStation.north_ee || []}
          southBound={currentStation.next_south_station || ""}
          northBound={currentStation.next_north_station || ""}
          handleSouthClick={handlePreviousStation}
          handleNorthClick={handleNextStation}
          stations={stationData}
          currentStationId={currentStationId}
          onChange={setCurrentStationId}
          sbTop={currentStation.ticketbooths?.filter((b) => b.row_category === sb_ticketBooth_top)}
          sbMid={currentStation.ticketbooths?.filter((b) => b.row_category === sb_ticketBooth_mid)}
          sbBelow={currentStation.ticketbooths?.filter((b) => b.row_category === sb_ticketBooth_bot)}
          nbTop={currentStation.ticketbooths?.filter((b) => b.row_category === nb_ticketBooth_top)}
          nbMid={currentStation.ticketbooths?.filter((b) => b.row_category === nb_ticketBooth_mid)}
          nbBelow={currentStation.ticketbooths?.filter((b) => b.row_category === nb_ticketBooth_bot)}
          sbStairs={
            currentStation.stairs?.filter((s) => s.asset_distinction.includes("W") || s.asset_distinction === "SBS") ||
            []
          }
          nbStairs={
            currentStation.stairs?.filter((s) => s.asset_distinction.includes("E") || s.asset_distinction === "NBS") ||
            []
          }
        />
      </div>

      {currentStation.details?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentStation.details[0]?.details?.map((detail, index) => (
            <AssetDetailCard
              key={index}
              station_id={currentStation.station_id}
              station_name={currentStation.station_name}
              detail={detail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
StationAssets.propTypes = {
  onBackStations: PropTypes.func,
};
export default StationAssets;
