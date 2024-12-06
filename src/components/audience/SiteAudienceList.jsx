import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "~config/services";
import { Pagination, Table } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Loader from "~fragments/Loader";
import { pagination, table } from "~config/themes";

function SiteAudienceList({ options, query }) {
  const { retrieveSites } = useService();
  const headers = ["site", "location", "coordinates", "type"];
  const [siteList, setSites] = useState([]);
  const [siteCount, setSiteCount] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate start and end index
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const onPageChange = (page) => setCurrentPage(page);

  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    const { type, region, city } = options;

    return siteList.filter((item) => {
      setCurrentPage(1);

      const matchesQuery =
        item.site.toLowerCase().includes(query.toLowerCase()) ||
        item.unis_code.toLowerCase().includes(query.toLowerCase()) ||
        item.address.toLowerCase().includes(query.toLowerCase());
      const matchesType =
        type === "all" || item.type.toLowerCase() === type.toLowerCase();
      const matchesRegion = region.length === 0 || region.includes(item.region);
      const matchesCity = city.length === 0 || region.includes(item.city);

      return matchesQuery && matchesType && matchesRegion && matchesCity;
    });
  }, [options, siteList, query]);

  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSites();
      console.log(data);
      setSites(data);
    };
    setup();
  }, []);

  useEffect(() => {
    setSiteCount(filteredItems.length);
    // Calculate start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    // Slice the array to get the current page items
    const currentPageItems = filteredItems.slice(startIndex, endIndex);

    // Set the current page items
    setCurrentItems(currentPageItems);
  }, [currentPage, endIndex, filteredItems]);

  return (
    <section>
      {currentItems ? (
        <>
          {currentItems.length !== 0 ? (
            <>
              <Table theme={table} className="bg-white shadow rounded-md">
                <Table.Head>
                  {headers.map((site) => {
                    return <Table.HeadCell key={site}>{site}</Table.HeadCell>;
                  })}
                </Table.Head>
                <Table.Body>
                  {currentItems.map((site) => {
                    return (
                      <Table.Row
                        key={site.site_id}
                        className="p-2 cursor-pointer hover:bg-slate-100"
                        onClick={() => navigate(`./${site.site_code}`)}
                      >
                        <Table.Cell>{site.unis_code}</Table.Cell>
                        <Table.Cell>
                          <div>
                            <p>{site.address}</p>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <p>{site.latitude}</p>
                            <p>{site.longitude}</p>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="capitalize">
                          {site.type}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
              <Pagination
                theme={pagination}
                currentPage={currentPage}
                totalPages={Math.ceil(siteCount / 6)}
                onPageChange={onPageChange}
              />
            </>
          ) : (
            <div className="p-2">No sites found</div>
          )}
        </>
      ) : (
        <Loader height="50vh" />
      )}
    </section>
  );
}

SiteAudienceList.propTypes = {
  options: PropTypes.object,
  query: PropTypes.string,
};

export default SiteAudienceList;
