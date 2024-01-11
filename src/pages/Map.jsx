import { FaMapMarkerAlt } from "react-icons/fa";
import MapLocation from "../components/map/MapLocation";
import BillboardGraph from "../components/map/BillboardGraph";
function Map() {
  const billboardDistribution = [
    {
      region: "NCR",
      digital: 129,
      static: 87,
      dColor: "#8B4513",
      sColor: "#00BFFF",
    },
    {
      region: "CAR",
      digital: 32,
      static: 16,
      dColor: "#A0522D",
      sColor: "#87CEEB",
    },
    {
      region: "Region I",
      digital: 20,
      static: 75,
      dColor: "#D2691E",
      sColor: "#4682B4",
    },
    {
      region: "Region II",
      digital: 36,
      static: 91,
      dColor: "#CD853F",
      sColor: "#1E90FF",
    },
    {
      region: "Region III",
      digital: 15,
      static: 82,
      dColor: "#DEB887",
      sColor: "#20B2AA",
    },
    {
      region: "Region IV-A",
      digital: 48,
      static: 68,
      dColor: "#FF8C00",
      sColor: "#ADD8E6",
    },
    {
      region: "Region IV-B",
      digital: 53,
      static: 77,
      dColor: "#FFA500",
      sColor: "#00FA9A",
    },
    {
      region: "Region V",
      digital: 62,
      static: 80,
      dColor: "#FF7F50",
      sColor: "#4B0082",
    },
    {
      region: "Region VI",
      digital: 75,
      static: 88,
      dColor: "#FF6347",
      sColor: "#7FFFD4",
    },
    {
      region: "Region VII",
      digital: 46,
      static: 93,
      dColor: "#FF4500",
      sColor: "#66CDAA",
    },
    {
      region: "Region VIII",
      digital: 39,
      static: 72,
      dColor: "#B8860B",
      sColor: "#8A2BE2",
    },
    {
      region: "Region IX",
      digital: 57,
      static: 85,
      dColor: "#DAA520",
      sColor: "#9932CC",
    },
    {
      region: "Region X",
      digital: 68,
      static: 79,
      dColor: "#FFD700",
      sColor: "#9400D3",
    },
    {
      region: "Region XI",
      digital: 74,
      static: 90,
      dColor: "#FFB6C1",
      sColor: "#48D1CC",
    },
    {
      region: "Region XII",
      digital: 55,
      static: 81,
      dColor: "#FF69B4",
      sColor: "#6A5ACD",
    },
    {
      region: "Region XIII",
      digital: 49,
      static: 94,
      dColor: "#DC143C",
      sColor: "#00FFFF",
    },
    {
      region: "BARMM",
      digital: 63,
      static: 76,
      dColor: "#2E8B57",
      sColor: "#483D8B",
    },
  ];
  return (
    <>
      <p className="text-xl font-bold text-main flex items-center gap-1">
        Billboard Sites
        <span className="text-red-500">
          <FaMapMarkerAlt />
        </span>
      </p>
      <MapLocation />
      <div className="flex items-center gap-4">
        <BillboardGraph
          data={billboardDistribution}
          title="Overall Billboards"
        />
      </div>
    </>
  );
}

export default Map;
