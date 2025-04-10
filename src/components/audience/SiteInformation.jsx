import classic from "~assets/classic.png";
import banner from "~assets/banner.png";
import digital from "~assets/digital.png";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFunction } from "~config/functions";
import { useService } from "~config/services";
import SiteInformationLoader from "./SiteInformationLoader";
import AnalyticsInformation from "./AnalyticsInformation";
import { RiExternalLinkFill } from "react-icons/ri";

function SiteInformation() {
  const { id } = useParams();

  const { toSpaced, capitalize } = useFunction();
  const { retrieveSite } = useService();
  const [siteData, setSiteData] = useState(null);

  const siteKeys = [
    // "area",
    "city",
    "region",
    "site_owner",
    "type",
    "price",
    "segments",
    "size",
    "ideal_view",
    // "access_type",
    "board_facing",
    // "facing",
  ];

  const getImageSrc = (site) => {
    let { imageURL, type } = site;

    if (!imageURL) {
      type = type.toLowerCase();
      switch (type) {
        case "classic":
          return classic;
        case "digital":
          return digital;
        case "banner":
          return banner;
      }
    }

    return imageURL;
  };

  useEffect(() => {
    const setup = async () => {
      setSiteData(null);
      const data = await retrieveSite(id);
      console.log(data);
      if (data) {
        setSiteData(data);
      }
    };
    setup();
  }, [id, retrieveSite]);
  return siteData ? (
    <div className="flex flex-col gap-2 w-full">
      <Link to={"/audiences"} className="w-fit underline">
        &#60; Back to List
      </Link>
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-4 w-full flex-col lg:flex-row">
          <div className="lg:w-2/6 bg-white p-4 flex flex-col gap-4 shadow">
            <header className="font-bold text-xl text-main border-b-4 border-secondary pb-2">
              {capitalize(siteData.name)}
            </header>
            <img
              src={getImageSrc(siteData)}
              className="size-full object-center object-cover"
            />
          </div>
          <div className="lg:w-4/6 bg-white p-4 flex flex-col gap-4 shadow">
            <header className="font-bold text-xl text-main border-b-4 border-secondary pb-2">
              Site Details
            </header>
            <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-4">
              {siteKeys.map((site) => {
                return (
                  <p className="flex flex-col gap-1" key={site}>
                    <span className="font-semibold">
                      {capitalize(toSpaced(site))}
                    </span>
                    {site === "ideal_view" ? (
                      <a
                        href={siteData['ideal_view']}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary underline flex items-center"
                      >
                        Visit Link <RiExternalLinkFill />
                      </a>
                    ) : (
                      <span className="capitalize">
                        {site === "price"
                          ? Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(siteData[site])
                          : siteData[site]}
                      </span>
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
        <AnalyticsInformation />
      </div>
    </div>
  ) : (
    <SiteInformationLoader />
  );
}

export default SiteInformation;
