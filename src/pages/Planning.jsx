import { Datepicker, Label, Select, Tabs } from "flowbite-react";
import Title from "../fragments/Title";
import { useEffect, useRef, useState } from "react";
import { datePickerTheme, tabTheme } from "../config/themes";
import { demographics as list } from "../config/siteData";
import { Link, Route, Routes } from "react-router-dom";
import Results from "./Results";
import classNames from "classnames";
import PlanningList from "../components/PlanningList";
import PlanningTable from "../components/PlanningTable";
function Planning() {
  const [, setTab] = useState(0);
  const [profileFilter, setFilter] = useState(null);
  const [selectedAreas, setSelectedArea] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRegion, setRegion] = useState("");

  const tabs = useRef(null);

  const handleAddDemographic = (item) => {
    if (profileFilter) {
      if (profileFilter.find((filter) => filter === item)) return;

      setFilter((prev) => [...prev, item]);
    } else {
      setFilter([item]);
    }
  };

  const searchBuyergraphics = (demographics) => {
    if (!searchQuery) {
      return demographics;
    }

    if (searchQuery.length < 3) {
      return demographics;
    }

    return demographics.filter((item) =>
      item.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const regions = [
    "National Capital Region (NCR)",
    "Cordillera Administrative Region (CAR)",
    "Region I (Ilocos Region)",
    "Region II (Cagayan Valley)",
    "Region III (Central Luzon)",
    "Region IV-A (CALABARZON)",
    "Region IV-B (MIMAROPA)",
    "Region V (Bicol Region)",
    "Region VI (Western Visayas)",
    "Region VII (Central Visayas)",
    "Region VIII (Eastern Visayas)",
    "Region IX (Zamboanga Peninsula)",
    "Region X (Northern Mindanao)",
    "Region XI (Davao Region)",
    "Region XII (SOCCSKSARGEN)",
    "Region XIII (Caraga)",
    "Autonomous Region in Muslim Mindanao (ARMM)",
    "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
  ];

  useEffect(() => {
    setDemographics(list);
  }, []);
  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <Title name="Site Planning" />

              <div className="grid grid-cols-[70fr_30fr] gap-4">
                <Tabs
                  ref={tabs}
                  style="default"
                  className="w-full bg-white p-2 border-b-2 border-default"
                  theme={tabTheme}
                  onActiveTabChange={(e) => setTab(e)}
                >
                  <Tabs.Item title="All">
                    {demographics && (
                      <PlanningList
                        handleAddDemographic={handleAddDemographic}
                        search={setSearchQuery}
                        searchBuyergraphics={searchBuyergraphics}
                        profileFilter={profileFilter}
                      />
                    )}
                  </Tabs.Item>
                  {demographics &&
                    [...new Set(demographics.map((item) => item.category))].map(
                      (category, index) => {
                        return (
                          <Tabs.Item title={category} key={index}>
                            <PlanningList
                              category={category}
                              handleAddDemographic={handleAddDemographic}
                              search={setSearchQuery}
                              searchBuyergraphics={searchBuyergraphics}
                              profileFilter={profileFilter}
                            />
                          </Tabs.Item>
                        );
                      }
                    )}
                </Tabs>
                <div className="bg-white w-full shadow p-2 flex flex-col gap-4">
                  <p className="font-semibold text-main">Profile Wishlist</p>
                  {profileFilter && (
                    <>
                      <ul className="max-h-[380px] overflow-y-auto">
                        {profileFilter.map((item, index) => {
                          return (
                            <li
                              key={index}
                              className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
                            >
                              <p className="font-semibold text-lg">
                                {item.value}
                              </p>
                              <p className="capitalize">{item.key}</p>
                              <button
                                onClick={() => {
                                  const filters = [...profileFilter];

                                  filters.splice(filters.indexOf(item), 1);

                                  setFilter(filters);
                                }}
                                className="transition-all absolute top-1/2 right-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 border-2 border-red-400 text-red-400 rounded-full px-3 py-1 hover:text-white hover:bg-red-400"
                              >
                                Remove
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[70fr_30fr] gap-4">
                <div className="flex flex-col gap-2 bg-white p-2 shadow">
                  <div>
                    <p className="font-semibold text-main text-lg border-b pb-1">
                      Area Selection
                    </p>
                    <div className="flex flex-row items-center gap-4">
                      <div>
                        <Label htmlFor="start_date" value="From: " />
                        <Datepicker
                          id="start_date"
                          theme={datePickerTheme}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date" value="To: " />
                        <Datepicker
                          id="end_date"
                          theme={datePickerTheme}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="regions" value="Filter Region: " />
                        <Select
                          id="regions"
                          onChange={(e) => setRegion(e.target.value)}
                        >
                          <option value="" selected={selectedRegion === null}>
                            Select Region
                          </option>
                          {regions.map((region) => {
                            return (
                              <option key={region} value={region}>
                                {region}
                              </option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[375px] overflow-y-auto">
                    <PlanningTable
                      filter={selectedRegion}
                      selectedAreas={selectedAreas}
                      setSelectedArea={setSelectedArea}
                    />
                  </div>
                </div>
                <div className="bg-white w-full shadow p-2 flex flex-col gap-4">
                  <p className="font-semibold text-main">Selected Areas</p>
                  {selectedAreas && (
                    <>
                      <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                        {selectedAreas.map((item, index) => {
                          return (
                            <li
                              key={index}
                              className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
                            >
                              <p className="font-semibold text-lg">{item}</p>
                              <button
                                onClick={() => {
                                  const updatedAreas = [...selectedAreas];
                                  updatedAreas.splice(
                                    selectedAreas.indexOf(item),
                                    1
                                  );

                                  setSelectedArea(updatedAreas);
                                }}
                                className="transition-all absolute top-1/2 right-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 border-2 border-red-400 text-red-400 rounded-full px-3 py-1 hover:text-white hover:bg-red-400"
                              >
                                Remove
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <Link
                to="/results"
                className={classNames(
                  "w-[30%] ml-auto p-2 px-4 rounded-full text-white hover:bg-main transition-all text-center",
                  selectedAreas.length === 0 || profileFilter === null
                    ? "pointer-events-none bg-gray-700 cursor-not-allowed"
                    : "pointer-events-auto bg-secondary"
                )}
              >
                Show Results
              </Link>
            </>
          }
        />
        <Route
          path="/results"
          element={
            <Results
              profileFilters={profileFilter}
              selectedAreas={selectedAreas}
            />
          }
        />
      </Routes>
    </>
  );
}

export default Planning;
