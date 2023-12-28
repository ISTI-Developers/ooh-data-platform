import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { siteData } from "../config/siteData";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";

function PlanningTable({ selectedAreas, setSelectedArea, filter }) {
  const [sites, setSites] = useState([]);
  const headers = [
    "area",
    "region",
    "# fits profile",
    "% fits profile",
    "avg monthly impressions",
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
        <Table className="bg-white rounded-md">
          <Table.Head className="shadow-md">
            {headers.map((header, index) => {
              return (
                <Table.HeadCell
                  key={index}
                  className="text-main sticky top-0 z-10"
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
                      <p className="flex flex-col">
                        <span>{area}</span>
                        <span>No. of Sites: {sites[area]}</span>
                      </p>
                    </Table.Cell>
                    <Table.Cell>{siteArea.region}</Table.Cell>
                    <Table.Cell>{Math.round(count * 1.1)}</Table.Cell>
                    <Table.Cell>{count}%</Table.Cell>
                    <Table.Cell>{Math.round(count * 13)}</Table.Cell>
                    <button
                      onClick={() => {
                        if (!selectedAreas.includes(area)) {
                          setSelectedArea((prev) => [...prev, area]);
                        }
                      }}
                      className={classNames(
                        "transition-all absolute top-1/2 right-10 -translate-y-1/2  rounded-full px-4 py-2 border-2 hover:text-white",
                        selectedAreas &&
                          selectedAreas.find((filter) => filter === area)
                          ? "pointer-events-none border-green-300 bg-green-300 text-white"
                          : "opacity-0 group-hover:opacity-100 border-secondary text-secondary hover:bg-secondary"
                      )}
                    >
                      {selectedAreas &&
                      selectedAreas.find((filter) => filter === area) ? (
                        <>
                          <FaCheck className="text-xl" />
                        </>
                      ) : (
                        "Add"
                      )}
                    </button>
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
