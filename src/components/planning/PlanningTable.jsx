import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import sampleSites from "~config/sites.json";
import { useFunction } from "~config/functions";
import { usePlanning } from "~config/PlanningContext";

function PlanningTable({ filter }) {
  const [sites, setSites] = useState([]);
  const { toUnderscored } = useFunction();
  const { dates, profiles, areas, setAreas, allowedMultiple, siteResults } =
    usePlanning();
  const headers = [
    "area",
    "# fits profile",
    "% fits profile",
    "avg monthly impressions",
    "action",
  ];
  const countSitesByArea = (siteData) => {
    const groupedData = siteData.reduce((result, current) => {
      const areaKey = current.area;
      if (!result[areaKey]) {
        result[areaKey] = {
          area: areaKey,
          siteCount: 0,
          region: current.region,
          fits_no: 0,
          fits_rate: 0,
          avg_monthly_impressions: 0,
        };
      }

      // Summing up values
      result[areaKey].siteCount++;
      result[areaKey].fits_no += current.fits_no;
      result[areaKey].fits_rate += current.fits_rate;
      result[areaKey].avg_monthly_impressions +=
        current.avg_monthly_impressions;

      return result;
    }, {});

    return Object.values(groupedData);
  };
  const groupFilters = () => {
    if (!profiles) return;

    const groupedData = profiles.reduce((result, current) => {
      const question = current.question;

      if (!result[question]) {
        result[question] = {
          allowMultiple: false,
          choices: [],
        };
      }

      result[question].choices.push(current.key);

      // Update allowMultiple based on allowedMultiple array
      if (allowedMultiple && allowedMultiple.length > 0) {
        // Check if the question key is in allowedMultiple
        result[question].allowMultiple = allowedMultiple.includes(question);
      }

      return result;
    }, {});
    return groupedData;
  };

  useEffect(() => {
    // const filterSites = () => {
    //   const filters = groupFilters();
    //   if (!filters)
    //     return sampleSites.map((site, index) => {
    //       return {
    //         id: index + 1,
    //         site: site.site,
    //         area: site.area,
    //         region: site.region,
    //         fits_no: 65,
    //         fits_rate: 100,
    //         avg_monthly_impressions: 65,
    //       };
    //     });

    //   const profiles = Object.keys(filters);

    //   const audiences = sampleSites.map((site) => site.analytics.audiences);

    //   const fits = audiences.map((response) => {
    //     const fits = [];
    //     return profiles.map((profile) => {
    //       let question = response.find(
    //         (response) =>
    //           toUnderscored(response.question.toLowerCase()) === profile
    //       );
    //       question = question.responses;
    //       const sum = question
    //         .filter((q) => filters[profile].includes(q.choice))
    //         ?.reduce((sum, item) => (sum += item.count), 0);
    //       fits.push(sum);

    //       return fits.reduce((sum, total) => (sum += total), 0);
    //     });
    //   });

    //   const data = sampleSites.map((site, index) => {
    //     return {
    //       id: index + 1,
    //       site: site.site,
    //       area: site.area,
    //       region: site.region,
    //       fits_no: fits[index].reduce((sum, total) => (sum += total), 0),
    //       fits_rate:
    //         (fits[index].reduce((sum, total) => (sum += total), 0) / 65) * 100,
    //       avg_monthly_impressions: 65,
    //     };
    //   });
    //   return data;
    // };
    const setup = async () => {
      if (siteResults) {
        const siteData = [...Object.values(siteResults) /*, ...filterSites()*/];

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
            {sites.length > 0 ? (
              sites.map((areaData, index) => {
                const { area, region, siteCount } = areaData;
                return (
                  <Table.Row
                    key={area + "_" + index}
                    className="relative group hover:bg-slate-100 text-main"
                  >
                    <Table.Cell>
                      <p className="flex flex-col whitespace-nowrap">
                        <span>{area}</span>
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
                      {areaData.avg_monthly_impressions}
                    </Table.Cell>
                    <Table.Cell
                      align="center"
                      className="sticky right-0 bg-gradient-to-l from-white from-80% to-[#ffffff00]"
                    >
                      <button
                        className={classNames(
                          "p-1 text-sm border-2 rounded-md outline-none",
                          "transition-all",
                          areas.find((area) => area.area === areaData.area)
                            ? "px-3 border-green-300 bg-green-300 text-white"
                            : "px-2.5 border-secondary-500 text-secondary-hover hover:bg-secondary-500"
                        )}
                        onClick={() => {
                          if (areas.length === 0) {
                            setAreas([areaData]);
                          } else {
                            if (
                              !areas.find((area) => area.area === areaData.area)
                            ) {
                              setAreas((prev) => [...prev, areaData]);
                            } else {
                              const updatedAreas = areas.filter(
                                (area) => area.area !== areaData.area
                              );
                              setAreas(updatedAreas);
                            }
                          }
                        }}
                      >
                        {areas.find((area) => area.area === areaData.area) ? (
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
