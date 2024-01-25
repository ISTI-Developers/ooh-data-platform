/* eslint-disable react/prop-types */
import classic from "~assets/classic.png";
import digital from "~assets/digital.png";
import SiteGraph from "./SiteGraph";
import { Badge } from "flowbite-react";
import { useEffect, useState } from "react";
import { DateRangePicker } from "~fragments/AudienceOptions";
import Behaviorals from "./Behaviorals";
import { useParams } from "react-router-dom";
import { useFunction } from "~config/functions";
import { useService } from "~config/services";
import SiteInformationLoader from "./SiteInformationLoader";
import sites from "~config/sites.json";
function SiteInformation() {
  const { id } = useParams();
  const { toSpaced, capitalize } = useFunction();
  const { retrieveSite } = useService();
  const [dates, setDateRange] = useState({
    from: new Date().setDate(new Date().getDate() - 30),
    to: new Date(),
  });
  const [siteData, setSiteData] = useState(null);
  const [onFetching, toggleFetching] = useState(false);
  const siteKeys = [
    "area",
    "city",
    "region",
    "site_owner",
    "latitude",
    "longitude",
    "type",
    "segments",
    "access_type",
    "board_facing",
    "facing",
  ];
  const impressionKeys = [
    "average_daily_impressions",
    "average_weekly_impressions",
    "average_monthly_impressions",
    "highest_monthly_impression",
  ];

  const Detail = ({ title, value }) => {
    return (
      <p className="flex flex-col gap-1">
        <span className="font-semibold">{title}</span>
        {typeof value === "object" ? (
          <div className="flex gap-2 capitalize">
            {value.map((type) => (
              <Badge key={type}>{type}</Badge>
            ))}
          </div>
        ) : (
          <span className="capitalize">{value}</span>
        )}
      </p>
    );
  };
  const Card = ({ title, count }) => {
    const countLength = count.toString().length;
    let amount = count;
    if (countLength > 3 && countLength < 7) {
      amount /= 1000;
    } else if (countLength >= 7) {
      amount /= 1000000;
    }
    return (
      <div className="w-full min-w-full sm:min-w-[50%] lg:min-w-[unset] flex flex-col items-center justify-center gap-2 snap-start">
        <p className="text-5xl font-bold text-main-500">{`${amount.toFixed(2)}${
          countLength >= 7
            ? "M"
            : countLength >= 4 && countLength <= 6
            ? "K"
            : ""
        }`}</p>
        <p className="text-secondary-hover xl:text-lg font-semibold text-center">
          {title}
        </p>
      </div>
    );
  };

  useEffect(() => {
    toggleFetching(true);
    const setup = async () => {
      console.log("fetching...");
      setSiteData(null);
      if (id === "GUADALED") {
        const data = await retrieveSite(id, dates);
        if (data) {
          setSiteData(data);
          console.log("site information loaded :)");
        } else {
          console.log("No data found.");
        }
      } else {
        const sampleSite = sites.find((site) => site.site === toSpaced(id));
        setSiteData(sampleSite);
      }
      toggleFetching(false);
    };
    setup();
  }, [id, dates, retrieveSite]);
  return siteData ? (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 w-full flex-col lg:flex-row">
        <div className="lg:w-2/6 bg-white p-4 flex flex-col gap-4 shadow">
          <header className="font-bold text-xl text-main border-b-4 border-secondary pb-2">
            {toSpaced(id) || siteData.area_code}
          </header>
          <img
            src={siteData.type.toLowerCase() === "classic" ? classic : digital}
            className="w-full"
          />
        </div>
        <div className="lg:w-4/6 bg-white p-4 flex flex-col gap-4 shadow">
          <header className="font-bold text-xl text-main border-b-4 border-secondary pb-2">
            Site Details
          </header>
          <div className="grid grid-cols-2 grid-rows-6 grid-flow-col gap-4">
            {siteKeys.map((site) => {
              return (
                <Detail
                  key={site}
                  title={capitalize(toSpaced(site))}
                  value={
                    site === "availability"
                      ? site
                        ? "Yes"
                        : "No"
                      : siteData[site]
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex w-full gap-4 bg-white p-4 py-8 shadow overflow-x-auto snap-x snap-mandatory">
        {impressionKeys.map((key) => {
          return (
            <Card
              key={key}
              count={siteData.analytics[key]}
              title={`Total ${capitalize(key, "_")}`}
            />
          );
        })}
      </div>
      <DateRangePicker
        setDates={setDateRange}
        dates={dates}
        showLoader={toggleFetching}
      />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Object.keys(siteData.analytics.impressions).map((impression) => {
          return (
            <SiteGraph
              key={impression + "_graph"}
              title={`Average ${capitalize(impression)} Impression`}
              data={siteData.analytics.impressions[impression]}
              className={
                impression === "daily" ? "lg:col-[1/3] xl:col-[1/2]" : ""
              }
              isFetching={onFetching}
            />
          );
        })}
      </div>
      <div className="bg-white p-4 w-full shadow flex flex-col gap-4">
        <p className="font-semibold text-main">Audience Behavior</p>
        <Behaviorals
          audienceData={siteData.analytics.audiences}
          isFetching={onFetching}
        />
      </div>
    </div>
  ) : (
    <SiteInformationLoader />
  );
}
export default SiteInformation;
