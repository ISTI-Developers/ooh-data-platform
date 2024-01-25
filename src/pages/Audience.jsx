import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import AudienceOptions from "../fragments/AudienceOptions";
import classNames from "classnames";
import SiteInformation from "../components/audience/SiteInformation";
import { Route, Routes } from "react-router-dom";

function Audience() {
  return (
    <div className="w-full">
      <p className="text-xl font-bold text-main flex items-center gap-2">
        Audiences
        <span className="text-blue-800">
          <FaUsers />
        </span>
      </p>
      <div className="flex flex-col gap-4 w-full">
        <AudienceOptions />
        <Routes>
          <Route
            path="/"
            element={
              <section
                className={classNames(
                  "min-h-[60vh] flex w-full bg-slate-300 items-center justify-center rounded-lg"
                )}
              >
                <p className="text-slate-600 font-semibold">
                  Select a site to show its information.
                </p>
              </section>
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
