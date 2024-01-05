import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import AudienceOptions from "../fragments/AudienceOptions";
import classNames from "classnames";
import SiteInformation from "../components/audience/SiteInformation";

function Audience() {
  const [dates, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [siteLocation, setSiteLocation] = useState(null);
  return (
    <div className="w-full">
      <p className="text-xl font-bold text-main flex items-center gap-2">
        Audiences
        <span className="text-blue-800">
          <FaUsers />
        </span>
      </p>
      <div className="flex flex-col gap-4 w-full">
        <AudienceOptions
          dates={dates}
          setDates={setDateRange}
          location={siteLocation}
          setLocation={setSiteLocation}
        />
        <section
          className={classNames(
            "min-h-[60vh] flex w-full",
            !siteLocation && "bg-slate-300 items-center justify-center"
          )}
        >
          {siteLocation ? (
            <SiteInformation site={siteLocation} />
          ) : (
            <p className="text-slate-600 font-semibold">
              Select a site to show its information.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Audience;
