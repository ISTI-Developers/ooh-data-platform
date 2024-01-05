import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { billboardData } from "../../config/siteData";
import Markers from "./Markers";
import { Accordion } from "flowbite-react";
import digital from "../../assets/digital.png";
import classic from "../../assets/classic.png";
import classNames from "classnames";
function MapLocation() {
  const [center, setCenter] = useState({ lat: 12.8797, lng: 121.774 });
  const [zoom, setZoom] = useState(6);

  const updateMapCenter = (coords, zoom) => {
    setZoom(() => zoom);
    setCenter(() => coords);
  };

  return (
    <div className="flex flex-row bg-white shadow p-4 gap-4">
      <div className="w-1/4">
        <Accordion>
          {[...new Set(billboardData.map((item) => item.type))].map((type) => (
            <Accordion.Panel key={type}>
              <Accordion.Title>{type}</Accordion.Title>
              <Accordion.Content>
                <ul className="flex flex-col max-h-[375px] overflow-y-auto">
                  {billboardData
                    .filter((item) => item.type === type)
                    .map(({ location, latitude, longitude }, index) => {
                      return (
                        <li
                          key={location + index}
                          className="flex gap-2 transition-all cursor-pointer p-2 hover:bg-gray-300"
                          onClick={() => {
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
                              {location}
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
      <APIProvider apiKey="AIzaSyBgdBRaOqyGeoc4E4cWlP8N_wlILEFdgtQ">
        <div className="h-[550px] w-3/4">
          <Map
            zoom={zoom}
            center={center}
            mapId={"d552bb0d161a38d8"}
            streetViewControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
          >
            <Markers
              list={billboardData}
              center={center}
              setCenter={setCenter}
              setZoom={setZoom}
            />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
}

export default MapLocation;
