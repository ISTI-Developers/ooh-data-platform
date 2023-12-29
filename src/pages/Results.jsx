import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { siteData } from "../config/siteData";
import Title from "../fragments/Title";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Results({ profileFilters, selectedAreas }) {
  const [sites, setSites] = useState(null);
  const headers = [
    "area",
    "site",
    "# fits profile",
    "% fits profile",
    "company",
  ];
  useEffect(() => {
    const filter =
      JSON.parse(localStorage.getItem("profileFilter")) || profileFilters;
    const areas =
      JSON.parse(localStorage.getItem("selectedAreas")) || selectedAreas;
    setSites(
      siteData
        .filter((data) => areas.find((result) => result.area === data.area))
        .filter((data) => {
          return filter.some((filter) => {
            const category = filter.category;
            const key = filter.key;
            const value = filter.value;
            const demographics = data.demographics;

            return value === demographics[category][key];
          });
        })
    );
  }, []);
  return (
    sites && (
      <>
        <div>
          <Title name="Site Results" />
          <Link
            to="/"
            className="underline text-gray-600 flex items-center gap-2"
          >
            <IoMdArrowRoundBack />
            <span>Back to Site Planning</span>
          </Link>
        </div>
        <div>
          <Table className="border bg-white rounded-md">
            <Table.Head className="shadow-md">
              {headers.map((header, index) => {
                return (
                  <Table.HeadCell key={index} className="text-main">
                    {header}
                  </Table.HeadCell>
                );
              })}
            </Table.Head>
            {console.log(sites)}
            <Table.Body>
              {sites.length !== 0 ? (
                sites.map((item, index) => {
                  const count = 100 - (13 * (index + 1.382)) / 4;
                  return (
                    <Table.Row key={index}>
                      <Table.Cell className="text-main">
                        <p className="font-semibold text-lg ">{item.area}</p>
                        <p>{item.region}</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p className="flex flex-col">
                          <span>{item.site}</span>
                          <span>
                            Avg Monthly Impressions: {Math.round(count * 2.43)}
                          </span>
                        </p>
                      </Table.Cell>
                      <Table.Cell>{Math.round(count * 2.12)}</Table.Cell>
                      <Table.Cell>{Math.round(count)}%</Table.Cell>
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
      </>
    )
  );
}

Results.propTypes = {
  selectedAreas: PropTypes.array,
  profileFilters: PropTypes.object,
};

export default Results;
