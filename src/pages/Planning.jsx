import { Datepicker, Label, Select, Tabs, Button } from "flowbite-react";
import Title from "../fragments/Title";
import { useEffect, useRef, useState } from "react";
import { datePickerTheme, lightButtonTheme, tabTheme } from "../config/themes";
import { demographics as list } from "../config/siteData";
import { Link, Route, Routes } from "react-router-dom";
import Results from "./Results";
import classNames from "classnames";
import PlanningList from "../components/planning/PlanningList";
import PlanningTable from "../components/planning/PlanningTable";
import { MdChecklist } from "react-icons/md";
import PlanningModal from "../components/planning/PlanningModal";
import { format } from "date-fns";
function Planning() {
  const [, setTab] = useState(0);
  const [profileFilter, setFilter] = useState(null);
  const [selectedAreas, setSelectedArea] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRegion, setRegion] = useState("");
  const [onProfileFilters, toggleProfileFilters] = useState(false);
  const [profile, toggleProfile] = useState(null);
  const [onAreasSelected, toggleAreasSelected] = useState(false);

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

    return demographics.filter(
      (item) =>
        item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.key.toLowerCase().includes(searchQuery.toLowerCase())
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

  const ProfileFilterHeader = () => {
    return (
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-main text-lg flex gap-2 px-2">
          Profile Wishlist
          {profileFilter && profileFilter.length > 0 && (
            <span className="hidden min-h-4 min-w-7 lg:flex items-center justify-center bg-secondary text-white text-sm rounded-full">
              {profileFilter.length}
            </span>
          )}
        </p>
        {profileFilter && profileFilter.length > 0 && (
          <>
            <Button
              color="transparent"
              onClick={() => setFilter(null)}
              className="text-slate-500"
            >
              Clear
            </Button>
          </>
        )}
      </div>
    );
  };
  const ProfileFilterBody = () => {
    return (
      <>
        {profileFilter?.length > 0 ? (
          <>
            <ul className="p-2 lg:py-0 max-h-[380px] overflow-y-auto flex flex-col gap-2">
              {[...new Set(profileFilter.map((keys) => keys.key))].map(
                (head, index) => {
                  return (
                    <li key={index} className="border-b-2">
                      <header className="text-lg font-semibold capitalize">
                        {head}
                      </header>
                      <ul className="flex flex-col gap-2">
                        {profileFilter
                          .filter((filter) => filter.key === head)
                          .map((item) => (
                            <li
                              key={item.value}
                              className="relative group flex transition-all flex-col p-2 px-4 hover:bg-slate-100"
                            >
                              <p className="font-semibold text-base text-slate-600">
                                {item.value}
                              </p>
                              <div className="absolute top-0 right-0 h-full w-1/4 flex items-center justify-end bg-gradient-to-l from-white from-55% to-[#ffffff00] transition-all ">
                                <button
                                  className={classNames(
                                    "mr-4 p-1 px-2.5 text-sm border-2 border-red-400 text-red-600 hover:bg-red-300 rounded-md",
                                    "transition-all"
                                  )}
                                  onClick={() => {
                                    const filters = [...profileFilter];
                                    filters.splice(filters.indexOf(item), 1);
                                    setFilter(filters);
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </li>
                  );
                }
              )}
            </ul>
          </>
        ) : (
          <p className="w-full text-center font-semibold text-slate-400 p-6">
            No profiles selected. Create your profile now!
          </p>
        )}
      </>
    );
  };
  const ProfileFilter = () => {
    return (
      <div className="bg-white w-full shadow p-2 hidden lg:flex flex-col gap-4">
        <ProfileFilterHeader />
        <ProfileFilterBody />
      </div>
    );
  };
  const ProfileHeader = () => {
    return (
      <p className="font-semibold text-main text-lg flex gap-2 capitalize">
        {profile.key}
      </p>
    );
  };
  const ProfileBody = () => {
    const { data } = profile;
    return (
      <div className="px-2">
        <p>Please choose from the options below:</p>
        <section className="flex flex-wrap gap-3 py-4 items-center">
          {data.map((dmg) => {
            return (
              <div key={dmg.value} className="py-1">
                <input
                  type="checkbox"
                  name={dmg.key}
                  id={`${dmg.key}_${dmg.value}`}
                  value={dmg.value}
                  className="peer hidden"
                  checked={profileFilter?.find((filter) => filter == dmg)}
                  onChange={(e) => {
                    handleAddDemographic(dmg);
                  }}
                />
                <label
                  htmlFor={`${dmg.key}_${dmg.value}`}
                  className={classNames(
                    "border-2 border-secondary-500 rounded-md text-secondary-hover font-medium",
                    "hover:bg-secondary-500 hover:text-white p-2.5 py-1",
                    "cursor-pointer peer-checked:border-green-300 peer-checked:bg-green-200 peer-checked:text-green-500"
                  )}
                >
                  {dmg.value}
                </label>
              </div>
            );
          })}
        </section>
      </div>
    );
  };
  const ProfileFooter = () => {
    return (
      <>
        <Button
          theme={lightButtonTheme}
          color="transparent"
          onClick={() => toggleProfile(null)}
        >
          Close
        </Button>
      </>
    );
  };
  const SelectedAreasHeader = () => {
    return (
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-main text-lg flex gap-2 px-2">
          Selected Areas
          {selectedAreas.length > 0 && (
            <span className="hidden min-h-4 min-w-7 lg:flex items-center justify-center bg-secondary text-white text-sm rounded-full">
              {selectedAreas.length}
            </span>
          )}
        </p>
        {selectedAreas.length !== 0 && (
          <>
            <Button
              color="transparent"
              onClick={() => setSelectedArea([])}
              className="text-slate-500"
            >
              Clear
            </Button>
          </>
        )}
      </div>
    );
  };
  const SelectedAreasBody = () => {
    return (
      <>
        {selectedAreas.length > 0 ? (
          <>
            <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {selectedAreas.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
                  >
                    <p className="font-semibold text-lg ">{item.area}</p>
                    <p>{item.region}</p>
                    <div className="absolute top-0 right-0 h-full w-1/4 flex items-center justify-end bg-gradient-to-l from-white from-90% to-[#ffffff00] transition-all ">
                      <button
                        className={classNames(
                          "mr-4 p-1 px-2.5 text-sm border-2 border-red-400 text-red-600 hover:bg-red-300 rounded-md bg-white",
                          "transition-all"
                        )}
                        onClick={() => {
                          const updatedAreas = [...selectedAreas];
                          updatedAreas.splice(selectedAreas.indexOf(item), 1);

                          setSelectedArea(updatedAreas);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="w-full text-center font-semibold text-slate-400 p-6">
            No areas selected.
          </p>
        )}
      </>
    );
  };
  const SelectedAreas = () => {
    return (
      <div className="bg-white w-full shadow p-2 hidden lg:flex flex-col gap-4">
        <SelectedAreasHeader />
        <SelectedAreasBody />
      </div>
    );
  };

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
              <div className="flex justify-between items-center">
                <Title
                  name={
                    <>
                      Site Planning
                      <span className="text-blue-500">
                        <MdChecklist />
                      </span>
                    </>
                  }
                />
                <Button
                  color="light"
                  className="relative lg:hidden"
                  onClick={() => toggleProfileFilters(true)}
                >
                  <span>Profile Wishlist</span>
                  {profileFilter && profileFilter.length > 0 && (
                    <span className="absolute -top-2 -left-2 min-h-5 min-w-5 bg-secondary text-white rounded-full animate-fade">
                      {profileFilter.length}
                    </span>
                  )}
                </Button>
              </div>
              <div className="lg:grid lg:gap-4 lg:grid-cols-[60fr_40fr] xl:grid-cols-[65fr_35fr] 2xl:grid-cols-[70fr_30fr]">
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
                        category={null}
                        toggleProfile={toggleProfile}
                        search={setSearchQuery}
                        searchBuyergraphics={searchBuyergraphics}
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
                              toggleProfile={toggleProfile}
                              search={setSearchQuery}
                              searchBuyergraphics={searchBuyergraphics}
                            />
                          </Tabs.Item>
                        );
                      }
                    )}
                </Tabs>
                <ProfileFilter />
              </div>
              <div className="lg:grid lg:gap-4 lg:grid-cols-[60fr_40fr] xl:grid-cols-[65fr_35fr] 2xl:grid-cols-[70fr_30fr]">
                <div className="bg-white p-2 overflow-x-auto w-full">
                  <div className="w-full">
                    <div className="border-b pb-2 flex justify-between items-center">
                      <p className="font-semibold text-main text-lg ">
                        Area Selection
                      </p>
                      <Button
                        color="light"
                        className="relative lg:hidden"
                        onClick={() => toggleAreasSelected(true)}
                      >
                        <span>Selected Areas</span>
                        {selectedAreas && selectedAreas.length > 0 && (
                          <span className="absolute -top-2 -left-2 min-h-5 min-w-5 bg-secondary text-white rounded-full animate-fade">
                            {selectedAreas.length}
                          </span>
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-row items-center gap-4 py-2 px-1">
                      <div>
                        <Label htmlFor="start_date" value="From: " />
                        <Datepicker
                          id="start_date"
                          theme={datePickerTheme}
                          value={format(new Date(startDate), "yyyy-MM-dd")}
                          onSelectedDateChanged={(date) => setStartDate(date)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date" value="To: " />
                        <Datepicker
                          id="end_date"
                          theme={datePickerTheme}
                          onSelectedDateChanged={(date) => setStartDate(date)}
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
                  <div className="max-h-[300px] overflow-y-auto">
                    <PlanningTable
                      filter={selectedRegion}
                      selectedAreas={selectedAreas}
                      setSelectedArea={setSelectedArea}
                    />
                  </div>
                </div>
                <SelectedAreas />
              </div>
              <Link
                to="/results"
                onClick={() => {
                  localStorage.setItem(
                    "profileFilter",
                    JSON.stringify(profileFilter)
                  );
                  localStorage.setItem(
                    "selectedAreas",
                    JSON.stringify(selectedAreas)
                  );
                }}
                className={classNames(
                  "w-full lg:max-w-[30%]  ml-auto p-2 px-4 text-white rounded-md hover:bg-main transition-all text-center z-20",
                  selectedAreas !== null || profileFilter !== null
                    ? "pointer-events-auto bg-secondary"
                    : "pointer-events-none bg-gray-700 cursor-not-allowed"
                )}
              >
                Show Results
              </Link>
              <PlanningModal
                trigger={onProfileFilters}
                toggle={toggleProfileFilters}
                header={<ProfileFilterHeader />}
                body={<ProfileFilterBody />}
              />
              <PlanningModal
                trigger={profile}
                toggle={toggleProfile}
                header={<ProfileHeader />}
                body={<ProfileBody />}
                footer={<ProfileFooter />}
              />
              <PlanningModal
                trigger={onAreasSelected}
                toggle={toggleAreasSelected}
                header={<SelectedAreasHeader />}
                body={<SelectedAreasBody />}
              />
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
