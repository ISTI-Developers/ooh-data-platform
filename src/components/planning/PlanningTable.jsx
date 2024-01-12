import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { siteData } from "../../config/siteData";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";

function PlanningTable({ selectedAreas, setSelectedArea, filter }) {
  const [sites, setSites] = useState([]);
  const headers = [
    "area",
    "# fits profile",
    "% fits profile",
    "avg monthly impressions",
    "action",
  ];
  const countSitesByArea = (siteData) => {
    const areaCountMap = {};

    // Iterate through the siteData array
    siteData.forEach((site) => {
      const area = site.area;

      // If the area already exists in the map, increment the count
      if (areaCountMap[area]) {
        areaCountMap[area]++;
      } else {
        // If the area doesn't exist, initialize the count to 1
        areaCountMap[area] = 1;
      }
    });

    return areaCountMap;
  };
  useEffect(() => {
    if (filter !== "") {
      setSites(
        countSitesByArea(siteData.filter((site) => site.region === filter))
      );
    } else {
      setSites(countSitesByArea(siteData));
    }
  }, [filter]);
  return (
    sites && (
      <>
        <Table className="bg-white rounded-md ">
          <Table.Head className="shadow-md">
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
            {Object.keys(sites).length !== 0 ? (
              Object.keys(sites).map((area, index) => {
                const count = 100 - (13 * (index + 1)) / 4;
                const siteArea = siteData.find((site) => site.area == area);
                return (
                  <Table.Row
                    key={area}
                    className="relative group hover:bg-slate-100"
                  >
                    <Table.Cell>
                      <p className="flex flex-col whitespace-nowrap">
                        <span>{area}</span>
                        <span className="text-xs">{siteArea.region}</span>
                        <span className="text-xs">
                          No. of Sites: {sites[area]}
                        </span>
                      </p>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {Math.round(count * 1.1)}
                    </Table.Cell>
                    <Table.Cell align="center">{count}%</Table.Cell>
                    <Table.Cell align="center">
                      {Math.round(count * 13)}
                    </Table.Cell>
                    <Table.Cell
                      align="center"
                      className="sticky right-0 bg-gradient-to-l from-white from-80% to-[#ffffff00]"
                    >
                      <button
                        className={classNames(
                          "p-1 text-sm border-2 rounded-md outline-none",
                          "transition-all",
                          selectedAreas &&
                            selectedAreas.find((filter) => filter === siteArea)
                            ? "px-3 border-green-300 bg-green-300 text-white"
                            : "px-2.5 border-secondary-500 text-secondary-hover hover:bg-secondary-500"
                        )}
                        onClick={() => {
                          if (
                            !(
                              selectedAreas &&
                              selectedAreas.find(
                                (filter) => filter === siteArea
                              )
                            )
                          ) {
                            setSelectedArea((prev) => [...prev, siteArea]);
                          } else {
                            const updatedAreas = [...selectedAreas];
                            updatedAreas.splice(
                              selectedAreas.indexOf(siteArea),
                              1
                            );

                            setSelectedArea(updatedAreas);
                          }
                        }}
                      >
                        {selectedAreas &&
                        selectedAreas.find((filter) => filter === siteArea) ? (
                          <>
                            <FaCheck className="text-xl" />
                          </>
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
  setSelectedArea: PropTypes.func,
  filter: PropTypes.string,
};

export default PlanningTable;
