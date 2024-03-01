import { FaMapMarkerAlt } from "react-icons/fa";
import MapLocation from "../components/map/MapLocation";
import BillboardGraph from "../components/map/BillboardGraph";
import { useEffect, useState } from "react";
import { useService } from "../config/services";

function Map() {
  const [billboards, setBillboards] = useState(null);
  const { retrieveSitesCount } = useService();

  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSitesCount("demographics");
      setBillboards(data);
    };
    setup();
  }, []);
  return (
    billboards && (
      <>
        <p className="text-xl font-bold text-main flex items-center gap-1">
          Billboard Sites
          <span className="text-red-500">
            <FaMapMarkerAlt />
          </span>
        </p>
        <MapLocation />
        <div className="flex items-center gap-4">
          <BillboardGraph data={billboards} title="Overall Billboards" />
        </div>
        {/* <iframe
          src="https://www.google.com/maps/embed/v1/streetview?key=AIzaSyCA8e__QnDK_Hc0p4QgLyePl3ONN8IpNKU&location=14.6574066,120.9925084"
          title="Street View"
          width="100%"
          height="500"
          style={{ border: 0 }}
        ></iframe> */}
      </>
    )
  );
}

export default Map;
