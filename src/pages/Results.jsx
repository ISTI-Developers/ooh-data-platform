import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useService } from "~config/services";
import Loader from "~fragments/Loader";
import sampleSites from "~config/sites.json";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import classNames from "classnames";
import { useFunction } from "~config/functions";

function Results({ profileFilters, selectedAreas, dates }) {
  const [sites, setSites] = useState(null);
  const [sort, setSort] = useState("# fits profile");
  const [order, setOrder] = useState(false);
  const { retrievePlanning } = useService();
  const { toUnderscored } = useFunction();
  const navigate = useNavigate();
  const headers = [
    "area",
    "site",
    "# fits profile",
    "% fits profile",
    "company",
  ];

  useEffect(() => {
    const groupFilters = () => {
      if (!profileFilters) return null;

      return profileFilters.reduce((result, current) => {
        const question = current.question;
        result[question] = result[question] || [];
        result[question].push(current.key);
        return result;
      }, {});
    };
    const setup = async () => {
      if (
        (profileFilters === null || profileFilters?.length === 0) &&
        selectedAreas.length === 0
      ) {
        setSites([]);
        return;
      }
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
              (fits[index].reduce((sum, total) => (sum += total), 0) / 65) *
              100,
            avg_monthly_impressions: 65,
          };
        });
        return data;
      };

      const options = {
        ...groupFilters(),
        dates: {
          from: format(new Date(dates.start), "MM-dd-yyyy"),
          to: format(new Date(dates.end), "MM-dd-yyyy"),
        },
      };

      const data = await retrievePlanning("areas", options);

      if (data) {
        const siteData = Object.values(data);

        setSites([
          ...siteData
            .filter((data) =>
              selectedAreas.length > 0
                ? selectedAreas.some((result) => result.area === data.area)
                : true
            )
            .sort((area1, area2) => {
              const sortOption =
                sort === "# fits profile"
                  ? "fits_no"
                  : sort === "% fits profile"
                  ? "fits_rate"
                  : sort;
              const value1 = area1[sortOption];
              const value2 = area2[sortOption];

              // Determine sorting order based on the 'order' variable
              const sortOrder = order ? 1 : -1;

              // Check if the values are numbers
              if (typeof value1 === "number" && typeof value2 === "number") {
                return (value1 - value2) * sortOrder; // Adjust order for numbers
              }

              // Use localeCompare for strings
              return String(value1).localeCompare(String(value2)) * sortOrder;
            }),
          ...filterSites().filter((data) =>
            selectedAreas.length > 0
              ? selectedAreas.some((result) => result.area === data.area)
              : true
          ),
        ]);
      }
    };

    setup();
  }, [selectedAreas, dates, profileFilters, sort, order]);

  return sites !== null ? (
    <div className="overflow-x-auto">
      <Table className="border bg-white rounded-md w-full">
        <Table.Head className="shadow-md">
          {headers.map((header, index) => {
            return (
              <Table.HeadCell
                key={index}
                className="text-main select-none cursor-pointer"
                onClick={() => {
                  setSort(header);
                  setOrder((prev) => {
                    if (sort === header) {
                      return !prev;
                    } else {
                      return prev;
                    }
                  });
                }}
              >
                <div className="flex items-center gap-1">
                  <span>{header}</span>
                  <div>
                    <MdOutlineKeyboardArrowUp
                      className={classNames(
                        header === sort && !order
                          ? "text-slate-400"
                          : header === sort && order
                          ? "text-slate-600"
                          : "text-slate-300"
                      )}
                    />
                    <MdOutlineKeyboardArrowDown
                      className={classNames(
                        header === sort && order
                          ? "text-slate-400"
                          : header === sort && !order
                          ? "text-slate-600"
                          : "text-slate-300"
                      )}
                    />
                  </div>
                </div>
              </Table.HeadCell>
            );
          })}
        </Table.Head>
        <Table.Body>
          {sites.length !== 0 ? (
            sites.map((item, index) => {
              return (
                <Table.Row
                  key={index}
                  className="hover:bg-slate-200 transition-all cursor-pointer"
                  onClick={() => {
                    localStorage.setItem("location", item.site);
                    navigate(`/audience/${toUnderscored(item.site)}`);
                  }}
                >
                  <Table.Cell className="text-main whitespace-nowrap">
                    <p className="font-semibold text-lg ">{item.area}</p>
                    <p>{item.region}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="flex flex-col whitespace-nowrap">
                      <span>{item.site}</span>
                      <span>
                        Avg Monthly Impressions: {item.avg_monthly_impressions}
                      </span>
                    </p>
                  </Table.Cell>
                  <Table.Cell>{item.fits_no}</Table.Cell>
                  <Table.Cell>{item.fits_rate.toFixed(2)}%</Table.Cell>
                  <Table.Cell>UNAI</Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell colSpan={headers.length} align="center">
                Results not available
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  ) : (
    <>
      <Loader height="10rem" />
    </>
  );
}

Results.propTypes = {
  selectedAreas: PropTypes.array,
  profileFilters: PropTypes.object,
  dates: PropTypes.object,
};

export default Results;
