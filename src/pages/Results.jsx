import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useService } from "~config/services";
import Loader from "~fragments/Loader";

function Results({ profileFilters, selectedAreas, dates }) {
  const [sites, setSites] = useState(null);
  const { retrievePlanning } = useService();
  const navigate = useNavigate();
  const headers = [
    "area",
    "site",
    "# fits profile",
    "% fits profile",
    "company",
  ];

  // useEffect(() => {
  //   const filter = profileFilters || [];
  //   const areas = selectedAreas || [];

  //   if (filter.length === 0 && areas.length === 0) {
  //     setSites([]);
  //     return;
  //   }
  //   // setSites(
  //   //   siteData
  //   //     .filter((data) => {
  //   //       if (areas.length > 0) {
  //   //         return areas.find((result) => result.area === data.area);
  //   //       } else {
  //   //         return data;
  //   //       }
  //   //     })
  //   //     .filter((data) => {
  //   //       return (
  //   //         filter.length === 0 ||
  //   //         filter.some((filter) => {
  //   //           const category = filter.category;
  //   //           const key = filter.key;
  //   //           const value = filter.value;
  //   //           const demographics = data.demographics;

  //   //           return value === demographics[category][key];
  //   //         })
  //   //       );
  //   //     })
  //   // );
  // }, [profileFilters, selectedAreas]);
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
      if (profileFilters === null && selectedAreas.length === 0) {
        setSites([]);
        return;
      }

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

        setSites(
          siteData.filter((data) =>
            selectedAreas.length > 0
              ? selectedAreas.some((result) => result.area === data.area)
              : true
          )
        );
      }
    };

    setup();
  }, [selectedAreas, dates, profileFilters]);

  return sites !== null ? (
    <div className="overflow-x-auto">
      <Table className="border bg-white rounded-md w-full">
        <Table.Head className="shadow-md">
          {headers.map((header, index) => {
            return (
              <Table.HeadCell key={index} className="text-main">
                {header}
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
                    navigate(`/audience/${item.site}`);
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
                  <Table.Cell>{item.fits_rate}%</Table.Cell>
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
