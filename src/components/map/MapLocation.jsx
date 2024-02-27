import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import Markers from "./Markers";
import { Accordion, Label, TextInput } from "flowbite-react";
import banner from "~assets/banner.png";
import digital from "~assets/digital.png";
import classic from "~assets/classic.png";
import classNames from "classnames";
import { IoMdMenu } from "react-icons/io";
import { useService } from "~config/services";
import Loader from "~fragments/Loader";
import { defaultTextTheme } from "~config/themes";
import { useFunction } from "~config/functions";
function MapLocation() {
  const { retrieveSites } = useService();
  const { offsetCoordinate, toUnderscored } = useFunction();
  const [center, setCenter] = useState({ lat: 12.8797, lng: 121.774 });
  const [zoom, setZoom] = useState(12);
  const [showLocations, toggleLocations] = useState(false);
  const [billboards, setBillboards] = useState(null);
  const [query, setQuery] = useState(null);

  const updateMapCenter = (coords, zoom) => {
    setZoom(() => zoom);
    setCenter(() => coords);
  };
  const calculateMidpoint = (coordinates) => {
    if (coordinates.length === 0) {
      return null; // Handle empty array
    }

    var sumLat = 0;
    var sumLon = 0;

    for (var i = 0; i < coordinates.length; i++) {
      sumLat += coordinates[i][0];
      sumLon += coordinates[i][1];
    }

    var avgLat = sumLat / coordinates.length;
    var avgLon = sumLon / coordinates.length;

    return [avgLat, avgLon];
  };

  const filterSites = (data) => {
    if (!query) {
      return data;
    }
    if (query?.length < 3) {
      return data;
    }
    return data.filter(
      (item) =>
        toUnderscored(item.site.toLowerCase()).includes(
          toUnderscored(query.toLowerCase())
        ) ||
        toUnderscored(item.site.toLowerCase()).includes(
          toUnderscored(query.toLowerCase())
        )
    );
  };

  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSites();
      setBillboards([
        ...data.map((item) => ({
          ...item,
          longitude: parseFloat(item.longitude),
          latitude: parseFloat(item.latitude),
        })),
      ]);
      const coordinates = [
        ...data.map((item) => {
          return [parseFloat(item.latitude), parseFloat(item.longitude)];
        }),
      ];
      const midpoint = calculateMidpoint(coordinates);
      setCenter({
        lat: midpoint[0],
        lng: midpoint[1],
      });
    };
    setup();
  }, []);
  return billboards ? (
    <div className="flex flex-col bg-white shadow p-4 pt-2 gap-4">
      <span className="hidden" />
      <div>
        <Label value="Search site" />
        <TextInput
          type="search"
          theme={defaultTextTheme}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="relative flex gap-4 overflow-hidden">
        <div
          className={classNames(
            "absolute w-full h-full top-0 left-0 z-[1] bg-white transition-all lg:relative lg:w-1/4",
            !showLocations
              ? "-translate-x-full lg:translate-x-0"
              : "translate-x-0"
          )}
        >
          <Accordion flush>
            {[
              ...new Set(
                filterSites(billboards).map((item) => item.type.toLowerCase())
              ),
            ].map((type) => (
              <Accordion.Panel key={type}>
                <Accordion.Title className="capitalize">{type}</Accordion.Title>
                <Accordion.Content>
                  <ul className="flex flex-col max-h-[375px] overflow-y-auto">
                    {filterSites(billboards)
                      .filter((item) => item.type.toLowerCase() === type)
                      .map(({ site, latitude, longitude }, index) => {
                        return (
                          <li
                            key={site + index}
                            className="flex gap-2 transition-all cursor-pointer p-2 hover:bg-gray-300"
                            onClick={() => {
                              toggleLocations(false);
                              updateMapCenter(
                                offsetCoordinate(latitude, longitude, 20),
                                17
                              );
                            }}
                          >
                            <img
                              src={
                                type === "classic"
                                  ? classic
                                  : type === "digital"
                                  ? digital
                                  : banner
                              }
                              className="max-w-10"
                            />
                            <div>
                              <p className="text-xs font-semibold">{site}</p>
                              <p className="text-[0.6rem] text-gray-500">
                                {[latitude, longitude].join(", ")}
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
                list={filterSites(billboards)}
                center={center}
                setCenter={setCenter}
                setZoom={setZoom}
              />
            </Map>
          </div>
        </APIProvider>
      </div>
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
