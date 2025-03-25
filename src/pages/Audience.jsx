import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import AudienceOptions from "~fragments/AudienceOptions";
import SiteInformation from "~components/audience/SiteInformation";
import { Route, Routes } from "react-router-dom";
import SiteAudienceList from "~components/audience/SiteAudienceList";

function Audience() {
  const [options, setOptions] = useState({
    type: "all",
    region: [],
    city: [],
  });
  const [query, setQuery] = useState("");
  return (
    <div className="w-full">
      <p className="text-xl font-bold text-main flex items-center gap-2">
        Audiences
        <span className="text-[#ec9912]">
          <FaUsers />
        </span>
      </p>
      <div className="flex flex-col gap-4 w-full">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AudienceOptions
                  filterOptions={setOptions}
                  query={query}
                  setQuery={setQuery}
                />
                <SiteAudienceList options={options} query={query} />
              </>
            }
          />
          <Route
            path="/:id"
            element={
              <section className="flex w-full min-h-[60vh]">
                <SiteInformation />
              </section>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Audience;
