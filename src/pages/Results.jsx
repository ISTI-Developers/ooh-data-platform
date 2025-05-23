import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "~fragments/Loader";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import classNames from "classnames";
import { useFunction } from "~config/functions";
import { usePlanning } from "~config/PlanningContext";

function Results() {
  const { profiles, areas, siteResults, impressions } = usePlanning();
  const [sort, setSort] = useState("# fits profile");
  const [order, setOrder] = useState(false);
  const { toUnderscored } = useFunction();
  const navigate = useNavigate();
  const headers = [
    "site",
    "city",
    "# fits profile",
    "% fits profile",
    "site owner",
  ];

  const results = useMemo(() => {
    if (
      ((profiles === null || profiles?.length === 0) && areas.length === 0) ||
      !siteResults
    ) {
      return [];
    }
    const siteData = Object.values(siteResults).flatMap((item) => item);

    let filteredSites = siteData;

    if (areas.length > 0) {
      filteredSites = siteData.filter((site) =>
        areas.some((area) => area.city === site.mmda)
      );
    }

    const sitesWithFITs = filteredSites.map((site) => {
      const areaImpression = impressions.find((imp) => imp.area === site.area);
      const siteImpression = Math.round(areaImpression?.avg ?? 0);
      const fitsNo = Math.round((site.fits_rate * siteImpression) / 100);

      return {
        ...site,
        fits_no: fitsNo,
        avg_monthly_impressions: siteImpression,
      };
    });

    return sitesWithFITs.sort((area1, area2) => {
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
    });
  }, [profiles, areas, siteResults, impressions, sort, order]);

  return results !== null ? (
    <div className="overflow-x-auto h-full max-h-[92vh] rounded-lg shadow-md">
      <Table className="bg-white rounded-md w-full">
        <Table.Head className="shadow-md sticky top-0">
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
          {results.length !== 0 ? (
            results.map((item, index) => {
              return (
                <Table.Row
                  key={index}
                  className="hover:bg-slate-200 transition-all cursor-pointer"
                  onClick={() => {
                    localStorage.setItem("location", item.site_code);
                    navigate(`/audiences/${toUnderscored(item.site_code)}`);
                  }}
                >
                  <Table.Cell>
                    <p className="flex flex-col text-main whitespace-nowrap">
                      <span className="font-semibold text-lg ">
                        {item.site_code}
                      </span>
                      <span>
                        Avg Monthly Impressions: {item.avg_monthly_impressions}
                      </span>
                    </p>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <p>{item.city}</p>
                    <p>{item.region}</p>
                  </Table.Cell>
                  <Table.Cell>{item.fits_no}</Table.Cell>
                  <Table.Cell>{item.fits_rate?.toFixed(2)}%</Table.Cell>
                  <Table.Cell>{item.site_owner}</Table.Cell>
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
  dates: PropTypes.object,
};

export default Results;
