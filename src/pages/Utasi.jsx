import { useState } from "react";
import Template from "~components/template";
import { useMap } from "~config/MapsContext";

const Utasi = () => {
  const { queryAllStationsData } = useMap();
  const [currentStationId, setCurrentStationId] = useState(queryAllStationsData[0]?.station_id); // Initialize with the first station's ID

  const handleNextStation = () => {
    const currentIndex = queryAllStationsData.findIndex((station) => station.station_id === currentStationId);
    const nextIndex = (currentIndex + 1) % queryAllStationsData.length;
    setCurrentStationId(queryAllStationsData[nextIndex].station_id);
  };

  const handlePreviousStation = () => {
    const currentIndex = queryAllStationsData.findIndex((station) => station.station_id === currentStationId);
    const prevIndex = (currentIndex - 1 + queryAllStationsData.length) % queryAllStationsData.length;
    setCurrentStationId(queryAllStationsData[prevIndex].station_id);
  };

  const currentStation = queryAllStationsData.find((station) => station.station_id === currentStationId);

  return (
    <div>
      <Template
        key={currentStation.station_id}
        station_name={currentStation?.station_name || "Sample Station"}
        backLitsSB={currentStation.backlits?.filter((backlit) => backlit.asset_distinction.startsWith("SB")) || []}
        backLitsNB={currentStation.backlits?.filter((backlit) => backlit.asset_distinction.startsWith("NB")) || []}
        parapetSB={currentStation.parapets?.filter((parapet) => parapet.asset_distinction.startsWith("SB")) || []}
        parapetNB={currentStation.parapets?.filter((parapet) => parapet.asset_distinction.startsWith("NB")) || []}
        SBentryExitButton={currentStation.south_ee || []}
        NBentryExitButton={currentStation.north_ee || []}
        southBound={currentStation.next_station_name || ""}
        northBound={currentStation.previous_station_name || ""}
        handleSouthClick={handlePreviousStation}
        handleNorthClick={handleNextStation}
      />
    </div>
  );
};

export default Utasi;
