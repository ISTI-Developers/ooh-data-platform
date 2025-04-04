import { FaMapMarkerAlt } from "react-icons/fa";
import MapLocation from "~components/map/MapLocation";
import BillboardGraph from "~components/map/BillboardGraph";
import { useEffect, useState } from "react";
import { useService } from "~config/services";
import Cookies from "js-cookie";

function Map() {
  const [billboards, setBillboards] = useState(null);
  const { retrieveSitesCount } = useService();
  const loggedIn = Cookies.get("token");

  useEffect(() => {
    if (loggedIn) {
      const setup = async () => {
        const data = await retrieveSitesCount();
        // console.log(data);
        setBillboards(
          data.map((item) => ({
            ...item,
            digital: parseInt(item.digital),
            classic: parseInt(item.classic),
            banner: parseInt(item.banner),
          }))
        );
      };
      setup();
    }
  }, [loggedIn]);
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
      </>
    )
  );
}

export default Map;
