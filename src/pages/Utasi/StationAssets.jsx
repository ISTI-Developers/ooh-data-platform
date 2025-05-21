import Template from "~components/template";
import { useState, useEffect, useRef } from "react";
import AssetDetailCard from "~/components/details";
import { useStations } from "~config/LRTContext";
import { FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";

const StationAssets = ({ onBackStations }) => {
  const { queryAllStationsData, querySpecs } = useStations();
  const [currentStationId, setCurrentStationId] = useState(null);
  const componentRef = useRef();

  const takeScreenshot = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = currentStation?.station_name + ".png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  useEffect(() => {
    if (queryAllStationsData.length > 0 && !currentStationId) {
      setCurrentStationId(queryAllStationsData[0]?.station_id);
    }
  }, [currentStationId, queryAllStationsData]);

  const handleNextStation = () => {
    const currentIndex = queryAllStationsData.findIndex((station) => station.station_id === currentStationId);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % queryAllStationsData.length;
      setCurrentStationId(queryAllStationsData[nextIndex].station_id);
    }
  };

  const handlePreviousStation = () => {
    const currentIndex = queryAllStationsData.findIndex((station) => station.station_id === currentStationId);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + queryAllStationsData.length) % queryAllStationsData.length;
      setCurrentStationId(queryAllStationsData[prevIndex].station_id);
    }
  };

  const mergedStations = queryAllStationsData.map((station) => ({
    ...station,
    details: querySpecs.filter((spec) => spec.station_id === station.station_id),
  }));

  const currentStation = mergedStations.find((station) => station.station_id === currentStationId);
  if (!currentStation) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="flex justify-between">
        <div className="mb-4">
          <button onClick={onBackStations} className="flex items-center px-4 py-2 rounded hover:bg-gray-400">
            <FaArrowLeft />
            Back
          </button>
        </div>
        <div>
          <button
            onClick={takeScreenshot}
            className="p-3 font-semibold rounded-lg shadow-lg  transition duration-300 ease-in-out transform hover:scale-105"
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
          stations={queryAllStationsData}
          currentStationId={currentStationId}
          onChange={setCurrentStationId}
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
