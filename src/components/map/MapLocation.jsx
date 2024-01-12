import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { billboardData } from "../../config/siteData";
import Markers from "./Markers";
import { Accordion } from "flowbite-react";
import digital from "../../assets/digital.png";
import classic from "../../assets/classic.png";
import classNames from "classnames";
import { IoMdMenu } from "react-icons/io";
function MapLocation() {
  const [center, setCenter] = useState({ lat: 12.8797, lng: 121.774 });
  const [zoom, setZoom] = useState(6);
  const [showLocations, toggleLocations] = useState(false);

  const updateMapCenter = (coords, zoom) => {
    setZoom(() => zoom);
    setCenter(() => coords);
  };

  return (
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
        {/* AIzaSyBgdBRaOqyGeoc4E4cWlP8N_wlILEFdgtQ */}
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

const sampleData = {
  site: "One Bonifacio High Street LED",
  area: "BGC, Taguig",
  region: "National Capital Region (NCR)",
  site_owner: "United Neon Sign Services",
  type: "digital",
  latitude: 14.551399,
  longitude: 121.047685,
  category: "N/A",
  venue_type: ["office/buildings", "outdoor", "billboards"],
  availability: false,
  board_facing: "N/A",
  facing: "N/A",
  access_type: "public",
  //other site information if ever
  analytics: {
    //default date range is last month or past 30 days NOTE: for impressions and audiences data only
    date_from: "2023-12-1",
    date_to: "2024-1-1",
    //summary of impressions NOTE: this is based on the overall impressions of the site and will not be affected by the date changes.
    average_daily_impressions: 48,
    average_weekly_impressions: 92,
    average_monthly_impressions: 127,
    highest_monthly_impression: 229, //number of the month with the highest impressions
    impressions: {
      //to be used for the line charts
      daily: [
        {
          date: "2023-12-1",
          impressions: 30,
        },
        {
          date: "2023-12-2",
          impressions: 63,
        },
        //...continue based from the date range
      ],
      weekly: [
        // same data format as daily but with weekly interval: 2023-12-3 -> 2023-12-10
      ],
      monthly: [
        // same data format as daily but with monthly interval: 2023-12-1 -> 2024-1-1
      ],
    },
    audiences: [
      {
        category: "basic",
        question: "gender",
        responses: [
          {
            choice: "male",
            count: 31,
          },
          {
            choice: "female",
            count: 29,
          },
        ],
      },
      {
        category: "basic",
        question: "age group",
        responses: [
          {
            choice: "13 to 17 years old",
            count: 8,
          },
          {
            choice: "18 to 19 years old",
            count: 12,
          },
          {
            choice: "20 to 29 years old",
            count: 34,
          },
          {
            choice: "30 to 39 years old",
            count: 6,
          },
        ],
      },
    ],
  },
};
export default MapLocation;
