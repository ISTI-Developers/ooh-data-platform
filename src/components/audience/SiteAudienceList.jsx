import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "~config/services";
import { Table } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Loader from "~fragments/Loader";
import { useFunction } from "~config/functions";

function SiteAudienceList({ options, query }) {
  const { retrieveSites } = useService();
  const { searchItems } = useFunction();
  const headers = ["site", "location", "coordinates", "type"];
  const [siteList, setSites] = useState(null);
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

      setSites(searchItems(combinedSites, query));
    };
    setup();
  }, [retrieveSites, options, query, searchItems]);
  return (
    <section className=" bg-white">
      {siteList ? (
        <>
          {siteList.length !== 0 ? (
            <Table>
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
