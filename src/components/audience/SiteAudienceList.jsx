import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "~config/services";
import { Pagination, Table } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Loader from "~fragments/Loader";
import { useFunction } from "~config/functions";

function SiteAudienceList({ options, query }) {
  const { retrieveSites } = useService();
  const { searchItems } = useFunction();
  const headers = ["site", "location", "coordinates", "type"];
  const [siteList, setSites] = useState(null);
  const [siteCount, setSiteCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate start and end index
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const onPageChange = (page) => setCurrentPage(page);

  const navigate = useNavigate();

  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSites();
      let combinedSites = data.map((item) => ({
        site_code: item.site_code,
        site_id: item.site_id,
        site: item.site,
        region: item.region,
        city: item.city || "EDSA",
        area: item.area,
        latitude: item.latitude,
        longitude: item.longitude,
        type: item.type,
      }));

      if (options.type !== "all") {
        combinedSites = combinedSites.filter(
          (site) => site.type.toLowerCase() === options.type
        );
      }
      if (options.region.length !== 0) {
        combinedSites = combinedSites.filter((site) =>
          options.region.includes(site.region)
        );
      }
      if (options.city.length !== 0) {
        combinedSites = combinedSites.filter((site) =>
          options.city.includes(site.city)
        );
      }
      if (options.area.length !== 0) {
        combinedSites = combinedSites.filter((site) =>
          options.area.includes(site.area)
        );
      }

      if (!query) {
        setSites(combinedSites);
      }

      if (query?.length < 3) {
        setSites(combinedSites);
      }

      const sites = searchItems(combinedSites, query);
      setSiteCount(sites.length);
      // Slice the array to get the current page items
      const currentItems = sites.slice(startIndex, endIndex);
      // Handle next and previous page clicks
      setSites(currentItems);
    };
    setup();
  }, [retrieveSites, options, query, searchItems, startIndex, endIndex]);
  return (
    <section>
      {siteList ? (
        <>
          {siteList.length !== 0 ? (
            <>
              <Table className="bg-white shadow rounded-md">
                <Table.Head>
                  {headers.map((site) => {
                    return <Table.HeadCell key={site}>{site}</Table.HeadCell>;
                  })}
                </Table.Head>
                <Table.Body>
                  {siteList.map((site) => {
                    return (
                      <Table.Row
                        key={site.site_id}
                        className="p-2 cursor-pointer hover:bg-slate-100"
                        onClick={() => navigate(`./${site.site_code}`)}
                      >
                        <Table.Cell>{site.site}</Table.Cell>
                        <Table.Cell>
                          <div>
                            <p>{site.region}</p>
                            <p>{site.city}</p>
                            <p>{site.area}</p>
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
