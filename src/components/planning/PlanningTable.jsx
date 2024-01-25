import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useService } from "~config/services";
import { format } from "date-fns";
import sampleSites from "~config/sites.json";
import { useFunction } from "~config/functions";

function PlanningTable({
  dates,
  profileFilters,
  selectedAreas,
  setSelectedArea,
  filter,
}) {
  const [sites, setSites] = useState([]);
  const { toUnderscored } = useFunction();
  const { retrievePlanning } = useService();
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
    if (!profileFilters) return;
    const groupedData = profileFilters.reduce((result, current) => {
      const question = current.question;

      if (!result[question]) {
        result[question] = [];
      }

      result[question].push(current.key);

      return result;
    }, {});
    return groupedData;
  };

  useEffect(() => {
    const filterSites = () => {
      const filters = groupFilters();
      if (!filters)
        return sampleSites.map((site, index) => {
          return {
            id: index + 1,
            site: site.site,
            area: site.area,
            region: site.region,
            fits_no: 65,
            fits_rate: 100,
            avg_monthly_impressions: 65,
          };
        });

      const profiles = Object.keys(filters);

      const audiences = sampleSites.map((site) => site.analytics.audiences);

      const fits = audiences.map((response) => {
        const fits = [];
        return profiles.map((profile) => {
          let question = response.find(
            (response) =>
              toUnderscored(response.question.toLowerCase()) === profile
          );
          question = question.responses;
          const sum = question
            .filter((q) => filters[profile].includes(q.choice))
            ?.reduce((sum, item) => (sum += item.count), 0);
          fits.push(sum);

          return fits.reduce((sum, total) => (sum += total), 0);
        });
      });

      const data = sampleSites.map((site, index) => {
        return {
          id: index + 1,
          site: site.site,
          area: site.area,
          region: site.region,
          fits_no: fits[index].reduce((sum, total) => (sum += total), 0),
          fits_rate:
            (fits[index].reduce((sum, total) => (sum += total), 0) / 65) * 100,
          avg_monthly_impressions: 65,
        };
      });
      return data;
    };
    const setup = async () => {
      const options = {
        ...groupFilters(),
        dates: {
          from: format(new Date(dates.start), "MM-dd-yyyy"),
          to: format(new Date(dates.end), "MM-dd-yyyy"),
        },
      };
      const data = await retrievePlanning("areas", options);
      if (data) {
        const siteData = [...Object.values(data), ...filterSites()];

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
  }, [filter, dates, profileFilters, selectedAreas]);

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
                    className="relative group hover:bg-slate-100"
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
                          selectedAreas.find(
                            (area) => area.area === areaData.area
                          )
                            ? "px-3 border-green-300 bg-green-300 text-white"
                            : "px-2.5 border-secondary-500 text-secondary-hover hover:bg-secondary-500"
                        )}
                        onClick={() => {
                          if (selectedAreas.length === 0) {
                            setSelectedArea([areaData]);
                          } else {
                            if (
                              !selectedAreas.find(
                                (area) => area.area === areaData.area
                              )
                            ) {
                              setSelectedArea((prev) => [...prev, areaData]);
                            } else {
                              const updatedAreas = selectedAreas.filter(
                                (area) => area.area !== areaData.area
                              );
                              setSelectedArea(updatedAreas);
                            }
                          }
                        }}
                      >
                        {selectedAreas.find(
                          (area) => area.area === areaData.area
                        ) ? (
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
  setSelectedArea: PropTypes.func,
  filter: PropTypes.string,
  dates: PropTypes.object,
  profileFilters: PropTypes.array,
};

export default PlanningTable;
