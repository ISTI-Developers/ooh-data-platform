import { Button, Accordion } from "flowbite-react";
import Title from "../fragments/Title";
import { useEffect, useState } from "react";
import { lightButtonTheme } from "../config/themes";
import classNames from "classnames";
import { MdChecklist } from "react-icons/md";
import PlanningModal from "../components/planning/PlanningModal";
import AreaSelectionList from "../components/planning/AreaSelectionList";
import ProfileFilterList from "../components/planning/ProfileFilterList";
import Results from "./Results";
import { useFunction } from "../config/functions";
function Planning() {
  const { capitalize, toSpaced } = useFunction();
  const [profileFilter, setFilter] = useState(null);
  const [selectedAreas, setSelectedArea] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRegion, setRegion] = useState("");
  const [onProfileFilters, toggleProfileFilters] = useState(false);
  const [profile, toggleProfile] = useState(null);
  const [onAreasSelected, toggleAreasSelected] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    if (searchQuery.length < 2) {
      return demographics;
    }
    return demographics.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const ProfileFilterHeader = () => {
    return (
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-main text-lg flex gap-1 px-2 items-center justify-center lg:text-sm">
          Profile Wishlist
          {profileFilter && profileFilter.length > 0 && (
            <span className="hidden min-h-6  min-w-6 lg:flex items-center justify-center bg-secondary text-white text-xs rounded-full">
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
            <ul className="p-2 lg:py-0 max-h-[300px] overflow-y-auto flex flex-col gap-2">
              {[...new Set(profileFilter.map((keys) => keys.question))].map(
                (head, index) => {
                  return (
                    <li key={index} className="border-b-2">
                      <header className="text-sm font-semibold capitalize">
                        {head}
                      </header>
                      <ul className="flex flex-col gap-2">
                        {profileFilter
                          .filter((filter) => filter.question === head)
                          .map((item) => (
                            <li
                              key={item.key}
                              className="relative group flex transition-all flex-col p-2 px-4 hover:bg-slate-100"
                            >
                              <p className="font-semibold text-sm text-slate-600">
                                {item.key}
                              </p>
                              <div className="absolute top-0 right-0 h-full w-1/4 flex items-center justify-end bg-gradient-to-l from-white from-55% to-[#ffffff00] transition-all ">
                                <button
                                  className={classNames(
                                    "mr-4 p-1 px-2.5 text-xs border-2 border-red-400 text-red-600 hover:bg-red-300 rounded-md",
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
          <p className="w-full text-center font-semibold text-slate-400 p-6 min-h-[calc(190px-2rem)]">
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
      <p className="font-semibold text-main text-lg flex gap-2">
        {capitalize(toSpaced(profile.key))}
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
              <div key={dmg.key} className="py-1">
                <input
                  type="checkbox"
                  name={dmg.key}
                  id={`${dmg.question}_${dmg.key}`}
                  value={dmg.key}
                  className="peer hidden"
                  checked={profileFilter?.find((filter) => filter == dmg)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      //check
                      handleAddDemographic(dmg);
                    } else {
                      const filters = [...profileFilter];
                      filters.splice(filters.indexOf(dmg), 1);
                      setFilter(filters);
                    }
                  }}
                />
                <label
                  htmlFor={`${dmg.question}_${dmg.key}`}
                  className={classNames(
                    "border-2 border-secondary-500 rounded-md text-secondary-hover font-medium",
                    "hover:bg-secondary-500 hover:text-white p-2.5 py-1",
                    "cursor-pointer peer-checked:border-green-300 peer-checked:bg-green-200 peer-checked:text-green-500"
                  )}
                >
                  {dmg.key}
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
        <p className="font-semibold text-main text-sm flex gap-2 px-2 items-center">
          Selected Areas
          {selectedAreas.length > 0 && (
            <span className="hidden min-h-6 min-w-6 lg:flex items-center justify-center bg-secondary text-white text-sm rounded-full">
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
            <ul className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {selectedAreas.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
                  >
                    <p className="font-semibold text-sm ">{item.area}</p>
                    <p className="text-xs">{item.region}</p>
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
          <p className="w-full text-center font-semibold text-slate-400 p-6 min-h-[calc(195px-3rem)]">
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
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
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
      </div>
      <div className="flex flex-col gap-4">
        {windowWidth <= 1024 ? (
          <>
            <div className="bg-white shadow">
              <Accordion flush collapseAll>
                <Accordion.Panel>
                  <Accordion.Title>Profile Filters</Accordion.Title>
                  <Accordion.Content theme={{ base: "p-0" }}>
                    <ProfileFilterList
                      searchBuyergraphics={searchBuyergraphics}
                      setSearchQuery={setSearchQuery}
                      toggleProfile={toggleProfile}
                    />
                  </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                  <Accordion.Title>Area Selection</Accordion.Title>
                  <Accordion.Content theme={{ base: "p-0" }}>
                    <AreaSelectionList
                      setEndDate={setEndDate}
                      setStartDate={setStartDate}
                      setRegion={setRegion}
                      setSelectedArea={setSelectedArea}
                      selectedAreas={selectedAreas}
                      selectedRegion={selectedRegion}
                    />
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            </div>
            <div className="flex gap-4">
              <Button
                color="light"
                className="relative lg:hidden w-full"
                onClick={() => toggleProfileFilters(true)}
              >
                <span>Profile Wishlist</span>
                {profileFilter && profileFilter.length > 0 && (
                  <span className="absolute -top-2 -left-2 min-h-5 min-w-5 bg-secondary text-white rounded-full animate-fade">
                    {profileFilter.length}
                  </span>
                )}
              </Button>
              <Button
                color="light"
                className="relative lg:hidden w-full"
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
            <Title name="Results" />
            <Results
              profileFilters={profileFilter}
              selectedAreas={selectedAreas}
            />
          </>
        ) : (
          <>
            <div className="relative flex gap-4">
              <div className="w-[75%] flex flex-col gap-4">
                <div className="flex flex-row items-start gap-4">
                  <div className="bg-white w-2/5 min-h-[425px] max-h-[425px] overflow-y-auto shadow">
                    <ProfileFilterList
                      searchBuyergraphics={searchBuyergraphics}
                      setSearchQuery={setSearchQuery}
                      toggleProfile={toggleProfile}
                    />
                  </div>
                  <div className="bg-white w-3/5 min-h-[425px] max-h-[425px] overflow-y-auto shadow">
                    <AreaSelectionList
                      setEndDate={setEndDate}
                      setStartDate={setStartDate}
                      setRegion={setRegion}
                      setSelectedArea={setSelectedArea}
                      selectedAreas={selectedAreas}
                      selectedRegion={selectedRegion}
                    />
                  </div>
                </div>
                <Title name="Results" />
                <Results
                  profileFilters={profileFilter}
                  selectedAreas={selectedAreas}
                />
              </div>
              <div className="w-[25%] h-full flex flex-col gap-4 sticky top-4">
                <ProfileFilter />
                <SelectedAreas />
              </div>
            </div>
          </>
        )}
      </div>
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
  );
}

export default Planning;
