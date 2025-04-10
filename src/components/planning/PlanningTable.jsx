import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { usePlanning } from "~config/PlanningContext";
import { MdAdd } from "react-icons/md";

function PlanningTable({ filter }) {
  // const [sites, setSites] = useState([]);
  const {
    dates,
    profiles,
    areas,
    setAreas,
    allowedMultiple,
    siteResults,
    impressions,
  } = usePlanning();

  const headers = [
    "Area",
    "# fits profile",
    "% fits profile",
    "avg monthly impressions",
    "",
  ];

  const sites = useMemo(() => {
    if (!siteResults || !impressions) return [];
    return Object.keys(siteResults).map((key) => {
      const sites = siteResults[key].map((site) => {
        const siteImpressions =
          impressions.find((impression) => impression.area === site.area)
            ?.avg ?? 0;
        return {
          ...site,
          avg_monthly_impressions: Number(siteImpressions),
        };
      });

      const FITsRate =
        sites.reduce((acc, item) => (acc += item.fits_rate), 0) / sites.length;
      const avgImpressions = Math.ceil(
        sites.reduce((acc, item) => (acc += item.avg_monthly_impressions), 0) /
          sites.length
      );

      return {
        city: key,
        sites: sites,
        fits_no:
          sites.length === 0
            ? 0
            : Math.round((FITsRate / 100) * avgImpressions),
        fits_rate: sites.length === 0 ? 0 : FITsRate,
        avg_monthly_impressions: sites.length === 0 ? 0 : avgImpressions,
      };
    });
  }, [siteResults, impressions]);

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
                  className="text-main sticky top-0 z-10 text-start whitespace-nowrap"
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
                const { city, sites } = areaData;
                const siteCount = sites.length;
                return (
                  <Table.Row
                    key={city + "_" + index}
                    className="relative group hover:bg-slate-100 text-main"
                  >
                    <Table.Cell>
                      <p className="flex flex-col">
                        <span className="text-xs font-medium">{city}</span>
                        <span className="text-xs">{siteCount} sites</span>
                      </p>
                    </Table.Cell>
                    <Table.Cell align="center">{areaData.fits_no}</Table.Cell>
                    <Table.Cell align="center">
                      {Intl.NumberFormat("en-PH", {
                        style: "decimal",
                      }).format(areaData.fits_rate)}
                      %
                    </Table.Cell>
                    <Table.Cell align="center">
                      {areaData.avg_monthly_impressions}
                    </Table.Cell>
                    <Table.Cell align="center">
                      <button
                        className={classNames(
                          "p-1 px-2.5 text-sm border-2 rounded-lg outline-none",
                          "transition-all",
                          areas.find((area) => area.city === areaData.city)
                            ? "border-green-300 bg-green-300 text-white"
                            : "border-secondary-500 text-secondary-hover hover:bg-secondary-500 hover:text-white"
                        )}
                        onClick={() => {
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
                          <FaCheck />
                        ) : (
                          <MdAdd />
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
