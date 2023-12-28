import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { siteData } from "../config/siteData";
import Title from "../fragments/Title";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

function Results({ profileFilters, selectedAreas }) {
  const headers = [
    "area",
    "site",
    "# fits profile",
    "% fits profile",
    "company",
  ];
  return (
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
          <Table.Body>
            {siteData
              .filter((data) => selectedAreas.includes(data.area))
              .map((item, index) => {
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
              })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}

Results.propTypes = {
  selectedAreas: PropTypes.array,
  profileFilters: PropTypes.object,
};

export default Results;
