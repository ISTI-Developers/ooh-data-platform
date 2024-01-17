import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import Markers from "./Markers";
import { Accordion } from "flowbite-react";
import digital from "~assets/digital.png";
import classic from "~assets/classic.png";
import classNames from "classnames";
import { IoMdMenu } from "react-icons/io";
import { useService } from "~config/services";
import Loader from "~fragments/Loader";
function MapLocation() {
  const { retrieveSites } = useService();
  const [center, setCenter] = useState({ lat: 12.8797, lng: 121.774 });
  const [zoom, setZoom] = useState(6);
  const [showLocations, toggleLocations] = useState(false);
  const [billboards, setBillboards] = useState(null);

  const updateMapCenter = (coords, zoom) => {
    setZoom(() => zoom);
    setCenter(() => coords);
  };

  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSites();
      setBillboards(
        data.map((item) => ({
          ...item,
          longitude: parseFloat(item.longitude),
          latitude: parseFloat(item.latitude),
        }))
      );
    };
    setup();
  }, []);
  return billboards ? (
    <div className="relative flex flex-row bg-white shadow p-4 gap-4 overflow-hidden">
      <div
        className={classNames(
          "absolute w-full h-full top-0 left-0 z-[1] bg-white transition-all lg:relative lg:w-1/4",
          !showLocations
            ? "-translate-x-full lg:translate-x-0"
            : "translate-x-0"
        )}
      >
        <Accordion flush>
          {[...new Set(billboards.map((item) => item.type))].map((type) => (
            <Accordion.Panel key={type}>
              <Accordion.Title>{type}</Accordion.Title>
              <Accordion.Content>
                <ul className="flex flex-col max-h-[375px] overflow-y-auto">
                  {billboards
                    .filter((item) => item.type === type)
                    .map(({ site, latitude, longitude }, index) => {
                      return (
                        <li
                          key={site + index}
                          className="flex gap-2 transition-all cursor-pointer p-2 hover:bg-gray-300"
                          onClick={() => {
                            toggleLocations(false);
                            updateMapCenter(
                              { lat: latitude, lng: longitude },
                              17
                            );
                          }}
                        >
                          <img
                            src={type === "Classic" ? classic : digital}
                            className="max-w-10"
                          />
                          <div>
                            <p
                              className={classNames(
                                "font-semibold",
                                type === "Classic" ? "text-xs" : "text-sm"
                              )}
                            >
                              {site}
                            </p>
                            <p className="text-[0.6rem] text-gray-500">
                              {[latitude, longitude].join(",")}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>
      <button
        className={classNames(
          "absolute group top-0 left-0 z-[2] p-2 bg-[#ffffff] shadow flex items-center gap-1 lg:hidden",
          showLocations ? "opacity-50 hover:opacity-100" : "opacity-100"
        )}
        onClick={() => toggleLocations((prev) => !prev)}
      >
        <span className="hidden animate-fade group-hover:block">
          {!showLocations ? "Show" : "Hide"} sites
        </span>
        <IoMdMenu className="text-xl text-slate-700" />
      </button>
      <APIProvider apiKey="AIzaSyCA8e__QnDK_Hc0p4QgLyePl3ONN8IpNKU">
        <div className="h-[550px] w-full lg:w-3/4">
          <Map
            zoom={zoom}
            center={center}
            mapId={"b65921a4dd014b72"}
            streetViewControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
          >
            <Markers
              list={billboards}
              center={center}
              setCenter={setCenter}
              setZoom={setZoom}
            />
          </Map>
        </div>
      </APIProvider>
    </div>
  ) : (
    <div className="relative flex flex-row bg-white shadow p-4 gap-4 h-[37.5rem]">
      <div className="w-full lg:w-1/4 flex flex-col gap-2">
        {Array(8)
          .fill(0)
          .map((idx) => {
            return <Loader key={idx} height="4rem" />;
          })}
      </div>
      <div className="w-full lg:w-3/4">
        <Loader height="35.5rem" />
      </div>
    </div>
  );
}

export default MapLocation;
