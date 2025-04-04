import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { usePlanning } from "~config/PlanningContext";

function PlanningTable({ filter }) {
  const [sites, setSites] = useState([]);
  const { dates, profiles, areas, setAreas, allowedMultiple, siteResults } =
    usePlanning();
  const headers = [
    "city",
    "# fits profile",
    "% fits profile",
    "avg monthly impressions",
    "action",
  ];
  const countSitesByArea = (siteData) => {
    const groupedData = [];
    console.log(siteData);
    for (const city in siteData) {
      if (!groupedData.find((data) => data === city)) {
        const newItem = {
          city: city,
          siteCount: siteData[city].length,
          region: siteData[city][0].region,
          fits_no: siteData[city].reduce(
            (total, site) => total + site.fits_no,
            0
          ),
          fits_rate: siteData[city].reduce(
            (total, site) => total + site.fits_rate,
            0
          ),
          avg_monthly_impressions: siteData[city].reduce(
            (total, site) => total + site.avg_monthly_impressions,
            0
          ),
        };
        groupedData.push(newItem);
      }
    }

    return groupedData;
  };

  useEffect(() => {
    const setup = async () => {
      if (siteResults) {
        const siteData = siteResults;

        setSites(
          filter !== "all"
            ? countSitesByArea(
                siteData.filter((site) => site.region === filter)
              )
            : countSitesByArea(siteData)
        );
      }
    };
    setup();
  }, [allowedMultiple, filter, dates, profiles, siteResults]);

  return (
    sites && (
      <>
        <Table
          className="bg-white rounded-md"
          theme={{
            head: {
              cell: {
                base: "bg-gray-100 px-4 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700",
              },
            },
          }}
        >
          <Table.Head className="">
            {headers.map((header, index) => {
              return (
                <Table.HeadCell
                  key={index}
                  className="text-main sticky top-0 z-10 text-center whitespace-nowrap last:sticky last:right-0"
                  onClick={(e) => console.log(e.target.innerHTML)}
                >
                  {header}
                </Table.HeadCell>
              );
            })}
          </Table.Head>
          <Table.Body>
            {sites.length > 0 ? (
              sites.map((areaData, index) => {
                const { city, region, siteCount } = areaData;
                return (
                  <Table.Row
                    key={city + "_" + index}
                    className="relative group hover:bg-slate-100 text-main"
                  >
                    <Table.Cell>
                      <p className="flex flex-col whitespace-nowrap">
                        <span>{city}</span>
                        <span className="text-xs">{region}</span>
                        <span className="text-xs">
                          No. of Sites: {siteCount}
                        </span>
                      </p>
                    </Table.Cell>
                    <Table.Cell align="center">{areaData.fits_no}</Table.Cell>
                    <Table.Cell align="center">
                      {(areaData.fits_rate / siteCount).toFixed(2)}%
                    </Table.Cell>
                    <Table.Cell align="center">
                      {(areaData.fits_rate / siteCount).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell
                      align="center"
                      className="sticky right-0 bg-gradient-to-l from-white from-80% to-[#ffffff00]"
                    >
                      <button
                        className={classNames(
                          "p-1 text-sm border-2 rounded-md outline-none",
                          "transition-all",
                          areas.find((area) => area.city === areaData.city)
                            ? "px-3 border-green-300 bg-green-300 text-white"
                            : "px-2.5 border-secondary-500 text-secondary-hover hover:bg-secondary-500"
                        )}
                        onClick={() => {
                          console.log(areaData);
                          if (areas.length === 0) {
                            setAreas([areaData]);
                          } else {
                            if (
                              !areas.find((area) => area.city === areaData.city)
                            ) {
                              setAreas((prev) => [...prev, areaData]);
                            } else {
                              const updatedAreas = areas.filter(
                                (area) => area.city !== areaData.city
                              );
                              setAreas(updatedAreas);
                            }
                          }
                        }}
                      >
                        {areas.find((area) => area.city === areaData.city) ? (
                          <FaCheck className="text-xl" />
                        ) : (
                          "Add"
                        )}
                      </button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={headers.length} align="center">
                  No areas found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </>
    )
  );
}

PlanningTable.propTypes = {
  selectedAreas: PropTypes.array,
  setAreas: PropTypes.func,
  filter: PropTypes.string,
  allowedMultiple: PropTypes.array,
  profileFilters: PropTypes.array,
};

export default PlanningTable;
